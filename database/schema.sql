-- Library Management System Database Schema --

CREATE DATABASE IF NOT EXISTS LMS_DB;
USE LMS_DB;

-- Books Table
CREATE TABLE IF NOT EXISTS Books (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Author VARCHAR(100) NOT NULL,
    ISBN VARCHAR(50),
    Description TEXT,
    TotalCopies INT DEFAULT 0,
    AvailableCopies INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    JoinedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- BookIssues Table (Transactions)
CREATE TABLE IF NOT EXISTS BookIssues (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    BookId INT NOT NULL,
    UserId INT NOT NULL,
    IssueDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    ReturnDate DATETIME NULL,
    IsReturned BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (BookId) REFERENCES Books(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Seed Data (Optional)
INSERT INTO Users (Name, Email) VALUES ('Admin User', 'admin@lms.com') ON DUPLICATE KEY UPDATE Name=Name;
INSERT INTO Books (Title, Author, ISBN, TotalCopies, AvailableCopies) VALUES 
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 5, 5),
('1984', 'George Orwell', '9780451524935', 3, 3),
('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 4, 4);
