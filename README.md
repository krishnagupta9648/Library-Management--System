# Library Management System (LMS Pro)

A modern, high-performance Library Management System built with **ASP.NET Core 8.0**, **React (Vite)**, and **MySQL**.

## Features
- **Dashboard**: Real-time statistics on total books, issued books, and availability.
- **Book Management**: Full CRUD operations for books (Add, Edit, Delete, View).
- **Advanced Search**: Search for books by title, author, or ISBN.
- **Issue & Return**: Seamlessly track book issues to users and handle returns.
- **Availability Tracking**: Automatically manages stock levels of books.
- **Premium UI**: Dark-themed glassmorphism design with responsive layouts and micro-animations.

## Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js (v18+)](https://nodejs.org/)
- [MySQL Server (v8.0+)](https://dev.mysql.com/downloads/mysql/)

## Project Setup

### 1. Database Configuration
1. Open your MySQL client (e.g., MySQL Workbench or Command Line).
2. Execute the script found in `database/schema.sql` to create the `LMS_DB` and initial tables.
3. Update the connection string in `backend/appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=LMS_DB;User=root;Password=your_password;"
   }
   ```

### 2. Backend Setup (.NET API)
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Restore dependencies:
   ```bash
   dotnet restore
   ```
3. Run the application:
   ```bash
   dotnet run
   ```
   The API will be available at `http://localhost:5000` (or `https://localhost:5001`).

### 3. Frontend Setup (React)
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

## Architecture
- **Backend**: Layered architecture using Entity Framework Core for data access and Pomelo for MySQL compatibility.
- **Frontend**: Functional React components with custom CSS hooks for a design-token-driven approach.
- **State Management**: React `useState` and `useEffect` for local state, with a modular `apiService` for backend integration.

## License
MIT
