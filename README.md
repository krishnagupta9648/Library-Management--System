# Library Management System

This is a simple web application for managing a library's book catalog and tracking book issues to users. It was built using ASP.NET Core for the backend and React for the frontend.

## How to get it running

### The easy way
I've set up a root-level script that handles both the frontend and backend together.
1. Make sure you have the .NET 8 SDK and Node.js installed.
2. Run `npm install` in this root directory.
3. Run `npm run dev`. This will start the React dev server and the .NET API at the same time.

### Manual Setup
If you want to run things separately:

**1. Database**
- Use a MySQL server and run the script in `database/schema.sql`.
- Update the connection string in `backend/appsettings.json`.

**2. Backend**
- Go to the `backend` folder and run `dotnet run`.

**3. Frontend**
- Go to the `frontend` folder, run `npm install`, and then `npm run dev`.

## How it works

### Structure
The project is split into two main parts:
- **Backend API**: Built with ASP.NET Core 8.0. It uses Entity Framework Core to talk to the MySQL database. I used a simple controller-based setup for handling books, users, and issues.
- **Frontend UI**: Built with React (using Vite). I used custom CSS for the design (a dark glassmorphism theme) instead of a library like Tailwind to keep it lightweight.

### Key Logic
- **Stock Tracking**: When a book is issued, the system automatically subtracts from the "Available Copies". When it's returned, it adds the copy back.
- **Offline Fallback**: I added a small mock-data layer in the frontend. If the backend isn't running, the app will still function using the browser's localStorage so you can test the UI properly.

## Bonus Features
The app includes the requested bonus tasks:
- Tracking live availability for every book.
- A dashboard with stats for total books, issued books, and availability.

## About the Author
Built by Krishna Kumar Gupta as part of the LMS assignment.
