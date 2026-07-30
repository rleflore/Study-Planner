# Study Planner

A full-stack study-planning application that helps students organize courses, manage assignments, track completed work, and decide what to work on next.

Project uses:

- React for the frontend
- Node.js and Express for the backend
- MongoDB Atlas for the database
- Mongoose for database models and queries
- Bootstrap and custom CSS for the user interface

## Features

### Course Mangement

- Add a course with a course name, course code, and custom color
- View all saved courses
- Prevent duplicate course codes
- Delete a course when no assignments are still connected to it
- Use course colors as visual accents throughout the application

### Assignment management

- Add assignments
- View active assignments
- Edit existing assignments
- Delete assignments
- Search assignments by title
- Filter assignments by course
- Store an assignment title, course, assignment type, status, due date, and optional notes

### Priority recommendations

The **Recommended tab** automatically sorts active assignments based on:

1. The assignment type
2. How soon the assignment is due

Assignment type weights:

| **Assignment Type** | **Weight** |
|---|:---:|
| Exam/Quiz | 5 |
| Project | 4 |
| Homework | 3 |
| Discussion Post | 2 |
| Reading | 1 |

Urgent assignments receive additional priority points as their due dates get closer. Completed assignments are excluded from the recommendation list.

### Completion tracking

- Mark an assignment as completed using a checkbox
- Move completed assignments out of the active list
- View completed assignments in a separate tab
- Restore an assignment by unchecking it
- Permanently remove all completed assignments using **Clear Completed**

## Prerequisites

Before running the project, install or create the following:

- Node.js and npm
- A MongoDB Atlas account and cluster
- A MongoDB database user
- Git, if cloning the project from a repository

## Installation

### **1. Clone or download the project**

```bash
git clone <repository-url>
cd FinalProjectImplementation
```

### **2. Install dependencies**

From the folder containing `package.json`, run:

```bash
npm install
```

This installs the frontend and backend packages listed in `package.json`.

Important dependencies may include:

- react
- react-dom
- express
- mongoose
- cors
- dotenv
- bootstrap

## MongoDB Atlas Setup

### **1. Create a cluster**

Create or open a MongoDB Atlas project and create a database cluster.

### **2. Create a database user**

Under Security → Database Access, create a username and password that the application can use.

Do not use your MongoDB Atlas account password. Create a separate database user.

### **3. Add your current IP address**

Under **Security → Network Access:**

1. Click Add IP Address
2. Select Add Current IP Address
3. Save the change
4. Wait until the entry becomes active

If the application previously worked but later reports a MongoDB connection or TLS error, your public IP address may have changed. Add the new current IP address.

### **4. Copy the connection string**

In Atlas:

1. Open the cluster
2. Click Connect
3. Select Drivers
4. Copy the Node.js connection string

It will resemble:

```text
mongodb+srv://<username>:<password>@<cluster-address>/studyPlanner?retryWrites=true&w=majority
```

Replace `<username>`, `<password>`, and `<cluster-address>` with the correct values.

## Running the Project Locally

The backend and frontend must both be running.

### **Terminal 1: Start the backend**

From the project root:

```bash
node app.js
```

The terminal should show messages similar to:

```text
Server running...
MongoDB connected successfully
```

The backend should be available at:

```text
http://localhost:5000
```

Test the backend by opening:

```text
http://localhost:5000/courses
```

A successful response should display JSON.

### **Terminal 2: Start the React frontend**

Open a second terminal in the same project folder:

```bash
npm start
```

The frontend normally opens at:

```text
http://localhost:3000
```

Keep both terminals running while using the application.

If `package.json` contains a custom combined development script, such as npm run dev, that script may be used instead. The manual two-terminal method above clearly shows which process is the frontend and which is the backend.

## API Endpoints

### **Courses**

| Method | Endpoint | Purpose |
|---|:---:|:---:|
| `GET` | `/courses` | Retrieve all courses |
| `POST` | `/courses` | Create a course |
| `DELETE` | `/courses/:id` | Delete a course when it has no connected assignments |

### **Assignments**

| Method | Endpoint | Purpose |
|---|:---:|:---:|
| `GET` | `/assignments` | Retrieve assignments |
| `POST` | `/assignments` | Create an assignment |
| `PUT` | `/assignments/:id` | Update an assignment |
| `DELETE` | `/assignments/:id` | Delete one assignment |
| `DELETE` | `/assignments/:id` | Permanently delete all completed assignments |

The route for `/assignments/completed` should be declared before `/assignments/:id` so Express does not interpret "completed" as an assignment ID.

The `GET /assignments` route uses Mongoose `populate("course")` so each assignment response includes its associated course information.

## How to Use the Application

### Add a course

1. Click Add Course
2. Enter the course name
3. Enter the course code
4. Select a course color
5. Submit the form

### Add an assignment

1. Click Add Assignment
2. Select a course
3. Enter the assignment title
4. Select the assignment type
5. Select the assignment status
6. Choose the due date
7. Enter optional notes
8. Submit the form

### Search and filter

- Use the search box to search assignment titles
- Use the course dropdown to display assignments from one course
- Search and course filtering can work at the same time

### Edit an assignment

1. Click Edit
2. The Assignment form opens with the existing information
3. Change the desired fields
4. Submit the form to save the update

### Complete an assignment

1. Check the assignment's completion checkbox
2. The status changes to Completed
3. The assignment moves to the Completed tab
4. Uncheck it to restore it

### Clear completed assignments

1. Open the Completed tab
2. Click Clear Completed
3. Confirm the warning
4. All completed assignments are permanently removed

### Delete a course

A course cannot be deleted while assignments still reference it. Delete the connected assignments or complete and clear them first.

## Priority Logic

Priority is calculated on the frontend instead of being stored in MongoDB.

Conceptually:

```text
Priority Score = Assignment Type Weight + Urgency Score
```

The application:

1. Filters out completed assignments
2. Calculates each active assignment's score
3. Sorts a copied array from highest to lowest priority
4. Uses the due date as a tie-breaker when needed

This approach keeps the recommendation current as due dates get closer.
