ALTER TABLE BloodUnit DROP CONSTRAINT IF EXISTS bloodunit_status_check;

ALTER TABLE BloodUnit
ADD CONSTRAINT bloodunit_status_check
CHECK (Status IN ('Available', 'Reserved', 'Expired', 'Used'));


-- views

-- 1. average donations per donor
CREATE OR REPLACE VIEW vw_donor_donation_stats AS
SELECT 
    d.DonorID, 
    ua.FirstName || ' ' || ua.LastName AS Name,
    ua.Contact,
    COUNT(dn.DonationID) AS TotalDonations,
    COALESCE(AVG(dn.Quantity), 0) AS AverageDonationQuantity
FROM Donor d
JOIN UserAccount ua ON d.DonorID = ua.UserID
LEFT JOIN Donation dn ON d.DonorID = dn.DonorID
GROUP BY d.DonorID, ua.FirstName, ua.LastName, ua.Contact
ORDER BY TotalDonations DESC;


-- 2. donors who never passed screening
CREATE OR REPLACE VIEW vw_unscreened_or_failed_donors AS
SELECT 
    d.DonorID, 
    ua.FirstName || ' ' || ua.LastName AS Name,
    ua.Contact, 
    d.Age, 
    b.BloodType
FROM Donor d
JOIN UserAccount ua ON d.DonorID = ua.UserID
JOIN BloodGroup b ON d.BloodGroupID = b.BloodGroupID
WHERE d.DonorID NOT IN (
    SELECT DISTINCT donor.DonorID
    FROM Donation dn
    INNER JOIN Donor donor ON dn.DonorID = donor.DonorID
    INNER JOIN TestResult tr ON dn.DonationID = tr.DonationID
    WHERE tr.ScreeningStatus = 'Pass'
)
ORDER BY ua.LastName, ua.FirstName ASC;

-- 3. hospital demand vs available stock
CREATE OR REPLACE VIEW vw_hospital_demand_vs_stock AS
SELECT 
    h.HospitalID, 
    h.Name AS HospitalName, 
    h.Location,
    b.BloodType,
    COALESCE(COUNT(DISTINCT br.RequestID), 0) AS RequestCount,
    COALESCE(SUM(CASE WHEN bu.Status = 'Available' THEN bu.Quantity ELSE 0 END), 0) AS AvailableUnits
FROM Hospital h
CROSS JOIN BloodGroup b
LEFT JOIN BloodRequest br ON h.HospitalID = br.HospitalID AND br.BloodGroupID = b.BloodGroupID
LEFT JOIN BloodUnit bu ON b.BloodGroupID = bu.BloodGroupID AND bu.Status = 'Available'
GROUP BY h.HospitalID, h.Name, h.Location, b.BloodType, b.BloodGroupID
ORDER BY h.HospitalID, b.BloodType;

-- 4. inventory breakdown by storage location
CREATE OR REPLACE VIEW vw_inventory_by_location AS
SELECT 
    sl.LocationID, 
    sl.LocationName, 
    sl.Address, 
    sl.Capacity,
    b.BloodType,
    SUM(bu.Quantity) AS TotalUnits,
    COUNT(bu.UnitID) AS NumberOfUnits
FROM StorageLocation sl
JOIN BloodUnit bu ON sl.LocationID = bu.LocationID
JOIN BloodGroup b ON bu.BloodGroupID = b.BloodGroupID
GROUP BY sl.LocationID, sl.LocationName, sl.Address, sl.Capacity, b.BloodType
ORDER BY sl.LocationName, b.BloodType;

-- 5. units expiring within the next 30 days
CREATE OR REPLACE VIEW vw_units_expiring_soon AS
SELECT 
    bu.UnitID, 
    b.BloodType, 
    bu.ExpiryDate, 
    sl.LocationName
FROM BloodUnit bu
JOIN BloodGroup b ON bu.BloodGroupID = b.BloodGroupID
JOIN StorageLocation sl ON bu.LocationID = sl.LocationID
WHERE bu.ExpiryDate <= CURRENT_DATE + INTERVAL '30 days'
  AND bu.ExpiryDate >= CURRENT_DATE
ORDER BY bu.ExpiryDate ASC;

-- 6. blood demand analytics
CREATE OR REPLACE VIEW vw_blood_demand_analytics AS
SELECT 
    b.BloodType, 
    COUNT(br.RequestID) AS DemandCount
FROM BloodRequest br
JOIN BloodGroup b ON br.BloodGroupID = b.BloodGroupID
GROUP BY b.BloodType, b.BloodGroupID
HAVING COUNT(br.RequestID) > 0
ORDER BY DemandCount DESC;

-- 7. availability report by blood type and status
CREATE OR REPLACE VIEW vw_availability_report AS
SELECT 
    b.BloodType, 
    SUM(bu.Quantity) AS TotalQuantity, 
    bu.Status
FROM BloodUnit bu
JOIN BloodGroup b ON bu.BloodGroupID = b.BloodGroupID
WHERE bu.Status IN ('Available', 'Reserved')
GROUP BY b.BloodType, bu.Status
ORDER BY b.BloodType, bu.Status;

-- 8. full test result log with donor info
CREATE OR REPLACE VIEW vw_comprehensive_test_log AS
SELECT 
    tr.TestID, 
    tr.DonationID, 
    d.DonorID, 
    ua.FirstName || ' ' || ua.LastName AS DonorName,
    d.DonationDate, 
    b.BloodType, 
    tr.ScreeningStatus,
    tr.DiseaseIndicators, 
    tr.TestDate
FROM TestResult tr
JOIN Donation d ON tr.DonationID = d.DonationID
JOIN Donor donor ON d.DonorID = donor.DonorID
JOIN UserAccount ua ON donor.DonorID = ua.UserID
JOIN BloodGroup b ON donor.BloodGroupID = b.BloodGroupID
ORDER BY tr.TestDate DESC;

-- 9. blood groups in demand but with no available stock
CREATE OR REPLACE VIEW vw_stock_shortages AS
SELECT DISTINCT BloodGroupID 
FROM BloodRequest
EXCEPT
SELECT DISTINCT BloodGroupID 
FROM BloodUnit 
WHERE Status = 'Available';

-- 10. pending patients who have a matching available unit
CREATE OR REPLACE VIEW vw_pending_patients_with_matches AS
SELECT DISTINCT PatientID 
FROM BloodRequest 
WHERE FulfillmentStatus = 'Pending'
INTERSECT
SELECT DISTINCT PatientID 
FROM Patient 
WHERE BloodGroupID IN (
    SELECT DISTINCT BloodGroupID 
    FROM BloodUnit 
    WHERE Status = 'Available'
);

-- 11. request volume per hospital
CREATE OR REPLACE VIEW vw_hospital_request_volume AS
SELECT 
    h.Name, 
    COUNT(br.RequestID) AS RequestCount
FROM Hospital h
LEFT JOIN BloodRequest br ON br.HospitalID = h.HospitalID
GROUP BY h.HospitalID, h.Name
ORDER BY h.Name;

-- 12. full donor-donation audit, includes donors with no donations
CREATE OR REPLACE VIEW vw_donor_donation_audit AS
SELECT 
    d.DonorID, 
    ua.FirstName || ' ' || ua.LastName AS Name,
    dn.DonationID, 
    dn.DonationDate
FROM Donor d
JOIN UserAccount ua ON d.DonorID = ua.UserID
FULL OUTER JOIN Donation dn ON d.DonorID = dn.DonorID;


-- procedures

-- 13. create a new blood request for a patient
CREATE OR REPLACE PROCEDURE sp_create_blood_request(
    p_patient_id INT,
    p_hospital_id INT,
    p_blood_group_id INT,
    p_quantity INT,
    p_patient_disease VARCHAR,
    INOUT p_request_id INT DEFAULT NULL
)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO BloodRequest (PatientID, HospitalID, BloodGroupID, Quantity, PatientDisease, FulfillmentStatus)
    VALUES (p_patient_id, p_hospital_id, p_blood_group_id, p_quantity, p_patient_disease, 'Pending')
    RETURNING RequestID INTO p_request_id;
END;
$$;

-- 14. update donor rating
CREATE OR REPLACE PROCEDURE sp_update_donor_rating(
    p_donor_id INT,
    p_rating INT
)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE Donor
    SET Rating = p_rating
    WHERE DonorID = p_donor_id;
END;
$$;

-- 15. delete all expired blood units
CREATE OR REPLACE PROCEDURE sp_purge_expired_units()
LANGUAGE plpgsql AS $$
BEGIN
    DELETE FROM BloodUnit
    WHERE ExpiryDate < CURRENT_DATE;
END;
$$;


--fulfillrequest
CREATE OR REPLACE PROCEDURE sp_fulfill_request(
    p_request_id INT,
    p_unit_id INT
)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE BloodRequest
    SET FulfillmentStatus = 'Fulfilled'
    WHERE RequestID = p_request_id;
    
    UPDATE BloodUnit
    SET Status = 'Used'
    WHERE UnitID = p_unit_id;
END;
$$;




-- functions

-- 16. find available blood units matching a request's blood group
CREATE OR REPLACE FUNCTION fn_get_matching_units(p_request_id INT)
RETURNS TABLE (
    UnitID INT, BloodGroupID INT, Quantity INT, ExpiryDate DATE, LocationID INT, DonationID INT, Status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT BU.UnitID, BU.BloodGroupID, BU.Quantity, BU.ExpiryDate, BU.LocationID, BU.DonationID, BU.Status
    FROM BloodUnit BU
    WHERE BU.BloodGroupID = (
        SELECT br.BloodGroupID FROM BloodRequest br WHERE br.RequestID = p_request_id
    ) AND BU.Status = 'Available';
END;
$$ LANGUAGE plpgsql;

-- 17. get all requests for a given hospital
CREATE OR REPLACE FUNCTION fn_get_requests_by_hospital(p_hospital_id INT)
RETURNS TABLE (
    RequestID INT, PatientID INT, HospitalID INT, BloodGroupID INT, Quantity INT, 
    PatientDisease VARCHAR, RequestDate DATE, FulfillmentStatus VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT br.RequestID, br.PatientID, br.HospitalID, br.BloodGroupID, br.Quantity, 
           br.PatientDisease, br.RequestDate, br.FulfillmentStatus
    FROM BloodRequest br
    WHERE br.HospitalID = p_hospital_id;
END;
$$ LANGUAGE plpgsql;

-- 18. search donors by blood type
CREATE OR REPLACE FUNCTION fn_search_donors_by_blood_type(p_blood_type CHAR(3))
RETURNS TABLE (
    DonorID INT, Name VARCHAR, Contact VARCHAR, Age INT, Gender CHAR, BloodType CHAR(3), Rating INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.DonorID, 
        CAST(ua.FirstName || ' ' || ua.LastName AS VARCHAR) AS Name,
        ua.Contact, 
        d.Age, 
        ua.Gender, 
        b.BloodType, 
        d.Rating
    FROM Donor d
    JOIN UserAccount ua ON d.DonorID = ua.UserID
    JOIN BloodGroup b ON d.BloodGroupID = b.BloodGroupID
    WHERE b.BloodType = p_blood_type;
END;
$$ LANGUAGE plpgsql;

-- 19. get full donation history for a donor
CREATE OR REPLACE FUNCTION fn_get_donor_history(p_donor_id INT)
RETURNS TABLE (
    DonationID INT, DonorID INT, DonationDate DATE, Quantity INT, StaffID INT, 
    DonorName VARCHAR, Contact VARCHAR, BloodType CHAR(3)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.DonationID, 
        d.DonorID, 
        d.DonationDate, 
        d.Quantity, 
        d.StaffID,
        CAST(ua.FirstName || ' ' || ua.LastName AS VARCHAR) AS DonorName,
        ua.Contact, 
        b.BloodType
    FROM Donation d
    JOIN Donor donor ON d.DonorID = donor.DonorID
    JOIN UserAccount ua ON donor.DonorID = ua.UserID
    JOIN BloodGroup b ON donor.BloodGroupID = b.BloodGroupID
    WHERE d.DonorID = p_donor_id
    ORDER BY d.DonationDate DESC;
END;
$$ LANGUAGE plpgsql;

-- 20. find compatible available blood units for a patient
CREATE OR REPLACE FUNCTION fn_get_compatible_blood_for_patient(p_patient_id INT)
RETURNS TABLE (
    PatientID INT, PatientName VARCHAR, Disease VARCHAR, BloodType CHAR(3), 
    UnitID INT, Quantity INT, ExpiryDate DATE, LocationName VARCHAR, Status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.PatientID, 
        CAST(ua.FirstName || ' ' || ua.LastName AS VARCHAR) AS PatientName,
        p.Disease, 
        b.BloodType,
        bu.UnitID, 
        bu.Quantity, 
        bu.ExpiryDate, 
        sl.LocationName, 
        bu.Status
    FROM Patient p
    JOIN UserAccount ua ON p.PatientID = ua.UserID
    JOIN BloodGroup b ON p.BloodGroupID = b.BloodGroupID
    LEFT JOIN BloodUnit bu ON b.BloodGroupID = bu.BloodGroupID AND bu.Status = 'Available'
    LEFT JOIN StorageLocation sl ON bu.LocationID = sl.LocationID
    WHERE p.PatientID = p_patient_id
    ORDER BY bu.ExpiryDate ASC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- 21. search patients by disease keyword
CREATE OR REPLACE FUNCTION fn_search_patients_by_disease(p_disease_keyword VARCHAR)
RETURNS TABLE (
    PatientID INT, Name VARCHAR, Age INT, Gender CHAR, Disease VARCHAR, 
    HospitalName VARCHAR, BloodType CHAR(3)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.PatientID, 
        CAST(ua.FirstName || ' ' || ua.LastName AS VARCHAR) AS Name,
        p.Age, 
        ua.Gender, 
        p.Disease,
        h.Name AS HospitalName, 
        b.BloodType
    FROM Patient p
    JOIN UserAccount ua ON p.PatientID = ua.UserID
    JOIN Hospital h ON p.HospitalID = h.HospitalID
    JOIN BloodGroup b ON p.BloodGroupID = b.BloodGroupID
    WHERE p.Disease ILIKE '%' || p_disease_keyword || '%'
    ORDER BY ua.LastName, ua.FirstName ASC;
END;
$$ LANGUAGE plpgsql;

-- 22 Register User
CREATE OR REPLACE FUNCTION fn_register_user(p_fname VARCHAR, p_lname VARCHAR, p_email VARCHAR, p_password VARCHAR,p_contact VARCHAR, p_gender bpchar(1), p_last_login TIMESTAMP )
RETURNS INT   
LANGUAGE plpgsql AS $$
DECLARE return_user_id INT;
BEGIN
                INSERT INTO UserAccount (
                    FirstName, LastName, Email, Password, 
                    Contact, Gender, LastLogin, Status
                )
                VALUES (
                    p_fname, p_lname, p_email, p_password, 
                    p_contact, p_gender, p_last_login, 'Active'
                )
                RETURNING UserID into return_user_id;
                Return return_user_id;
END;
$$;

-- 23 Add role to user
CREATE OR REPLACE FUNCTION fn_add_role(p_userid INT, p_role VARCHAR )
RETURNS VOID 
LANGUAGE plpgsql AS $$
DECLARE return_user_id INT;
BEGIN
            IF NOT EXISTS
                (SELECT 1
                FROM useraccount
                WHERE userid = p_userid) THEN 
            RAISE
            EXCEPTION 'Cannot add role. User ID % does not exist in UserAccount.', p_userid;
            END IF;
                INSERT INTO userrole (userid, role)
                VALUES (p_userid, p_role);
END;
$$;

-- 24 Add user with role
CREATE OR REPLACE FUNCTION fn_add_user_wth_role(
p_fname VARCHAR, p_lname VARCHAR, p_email VARCHAR, p_password VARCHAR,p_contact VARCHAR, p_gender bpchar(1), p_last_login TIMESTAMP, p_role VARCHAR
)
RETURNS INT
LANGUAGE plpgsql AS $$
DECLARE return_user_id INT;
BEGIN
SELECT fn_register_user(
p_fname , p_lname , p_email , p_password ,p_contact , p_gender , p_last_login ) INTO return_user_id;
Perform fn_add_role(return_user_id, p_role);
return return_user_id ;
END;
$$;

-- 25 get user by email
CREATE OR REPLACE FUNCTION fn_get_user_by_email(p_email VARCHAR)
RETURNS SETOF UserAccount   
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM UserAccount WHERE email = p_email;
END;
$$;
