-- UserAccount table
CREATE TABLE UserAccount (
    UserID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Contact VARCHAR(20) NOT NULL UNIQUE,
    Gender CHAR(1) CHECK (Gender IN ('M', 'F')),
    LastLogin TIMESTAMP,
    Status VARCHAR(10) NOT NULL CHECK (
        Status IN ('Active', 'Inactive')
    )
);

-- UserRole table
CREATE TABLE UserRole (
    UserID INT NOT NULL,
    Role VARCHAR(10) NOT NULL CHECK (
        Role IN (
            'Admin',
            'Staff',
            'Donor',
            'Patient'
        )
    ),
    PRIMARY KEY (UserID, Role),
    CONSTRAINT FK_UserRole_User FOREIGN KEY (UserID) REFERENCES UserAccount (UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- BloodGroup table
CREATE TABLE BloodGroup (
    BloodGroupID SERIAL PRIMARY KEY,
    BloodType CHAR(3) NOT NULL,
    CompatibilityNotes VARCHAR(255),
    DemandLevel VARCHAR(10) CHECK (
        DemandLevel IN ('Low', 'Medium', 'High')
    )
);

-- Donor table
CREATE TABLE Donor (
    DonorID INT PRIMARY KEY,
    Age INT NOT NULL CHECK (
        Age >= 16
        AND Age < 80
    ),
    BloodGroupID INT NOT NULL,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    CONSTRAINT FK_Donor_User FOREIGN KEY (DonorID) REFERENCES UserAccount (UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Hospital table
CREATE TABLE Hospital (
    HospitalID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Contact VARCHAR(20) NOT NULL,
    Location VARCHAR(100) NOT NULL,
    Type VARCHAR(30) CHECK (
        Type IN (
            'General',
            'Cancer',
            'Dialysis',
            'Trauma',
            'Obstetrics',
            'Other'
        )
    ),
    Rating INT CHECK (Rating BETWEEN 1 AND 5)
);

-- Patient table
CREATE TABLE Patient (
    PatientID INT PRIMARY KEY,
    Age INT CHECK (Age >= 0),
    HospitalID INT NOT NULL,
    BloodGroupID INT NOT NULL,
    Disease VARCHAR(100),
    CONSTRAINT FK_Patient_User FOREIGN KEY (PatientID) REFERENCES UserAccount (UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_Patient_BloodGroup FOREIGN KEY (BloodGroupID) REFERENCES BloodGroup (BloodGroupID),
    CONSTRAINT FK_Patient_Hospital FOREIGN KEY (HospitalID) REFERENCES Hospital (HospitalID)
);

-- StorageLocation table
CREATE TABLE StorageLocation (
    LocationID SERIAL PRIMARY KEY,
    LocationName VARCHAR(50) NOT NULL UNIQUE,
    Address VARCHAR(100) NOT NULL UNIQUE,
    Capacity INT NOT NULL,
    ContactPerson VARCHAR(50),
    Distance DECIMAL(6, 2)
);

-- Staff table
CREATE TABLE Staff (
    StaffID INT PRIMARY KEY,
    Position VARCHAR(30) NOT NULL,
    ShiftTiming VARCHAR(30),
    AssignedLocationID INT,
    CONSTRAINT FK_Staff_User FOREIGN KEY (StaffID) REFERENCES UserAccount (UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Donation table
CREATE TABLE Donation (
    DonationID SERIAL PRIMARY KEY,
    DonorID INT NOT NULL,
    DonationDate DATE DEFAULT CURRENT_DATE NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    StaffID INT NOT NULL
);

-- TestResult table
CREATE TABLE TestResult (
    TestID SERIAL PRIMARY KEY,
    PatientID INT,
    DonationID INT NOT NULL,
    ScreeningStatus VARCHAR(4) NOT NULL CHECK (
        ScreeningStatus IN ('Pass', 'Fail')
    ),
    DiseaseIndicators VARCHAR(100),
    Notes VARCHAR(255),
    TestDate DATE DEFAULT CURRENT_DATE NOT NULL,
    CONSTRAINT Unique_TestResDonation UNIQUE (DonationID)
);

-- BloodUnit table
CREATE TABLE BloodUnit (
    UnitID SERIAL PRIMARY KEY,
    BloodGroupID INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    ExpiryDate DATE NOT NULL,
    LocationID INT NOT NULL,
    DonationID INT NOT NULL,
    Status VARCHAR(10) NOT NULL DEFAULT 'Available' CHECK (
        Status IN (
            'Available',
            'Reserved',
            'Expired'
        )
    )
);

-- BloodRequest table
CREATE TABLE BloodRequest (
    RequestID SERIAL PRIMARY KEY,
    PatientID INT NOT NULL,
    HospitalID INT NOT NULL,
    BloodGroupID INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    PatientDisease VARCHAR(100),
    RequestDate DATE DEFAULT CURRENT_DATE NOT NULL,
    FulfillmentStatus VARCHAR(10) NOT NULL CHECK (
        FulfillmentStatus IN (
            'Pending',
            'Fulfilled',
            'Rejected'
        )
    )
);

-- Foreign key constraints
ALTER TABLE Donor
    ADD CONSTRAINT FK_Donor_BloodGroup FOREIGN KEY (BloodGroupID) REFERENCES BloodGroup (BloodGroupID);

ALTER TABLE Staff
    ADD CONSTRAINT FK_Staff_StorageLocation FOREIGN KEY (AssignedLocationID) REFERENCES StorageLocation (LocationID) ON DELETE SET NULL;

ALTER TABLE Donation
    ADD CONSTRAINT FK_Donation_Donor FOREIGN KEY (DonorID) REFERENCES Donor (DonorID),
    ADD CONSTRAINT FK_Donation_Staff FOREIGN KEY (StaffID) REFERENCES Staff (StaffID);

ALTER TABLE TestResult
    ADD CONSTRAINT FK_TestResult_Donation FOREIGN KEY (DonationID) REFERENCES Donation (DonationID) ON DELETE CASCADE,
    ADD CONSTRAINT FK_TestResult_Patient FOREIGN KEY (PatientID) REFERENCES Patient (PatientID);

ALTER TABLE BloodUnit
    ADD CONSTRAINT FK_BloodUnit_BloodGroup FOREIGN KEY (BloodGroupID) REFERENCES BloodGroup (BloodGroupID),
    ADD CONSTRAINT FK_BloodUnit_StorageLocation FOREIGN KEY (LocationID) REFERENCES StorageLocation (LocationID),
    ADD CONSTRAINT FK_BloodUnit_Donation FOREIGN KEY (DonationID) REFERENCES Donation (DonationID) ON DELETE CASCADE;

ALTER TABLE BloodRequest
    ADD CONSTRAINT FK_BloodRequest_Hospital FOREIGN KEY (HospitalID) REFERENCES Hospital (HospitalID),
    ADD CONSTRAINT FK_BloodRequest_BloodGroup FOREIGN KEY (BloodGroupID) REFERENCES BloodGroup (BloodGroupID),
    ADD CONSTRAINT FK_BloodRequest_Patient FOREIGN KEY (PatientID) REFERENCES Patient (PatientID) ON DELETE CASCADE;



ALTER TABLE BloodUnit DROP CONSTRAINT IF EXISTS bloodunit_status_check;

ALTER TABLE BloodUnit
ADD CONSTRAINT bloodunit_status_check
CHECK (Status IN ('Available', 'Reserved', 'Expired', 'Used'));
