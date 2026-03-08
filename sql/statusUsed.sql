ALTER TABLE BloodUnit
DROP CONSTRAINT CK__BloodUnit__Statu__1DB06A4F

ALTER TABLE BloodUnit
ADD CONSTRAINT CHK_BloodUnit_Status
CHECK (Status IN ('Available', 'Reserved', 'Expired', 'Used'))