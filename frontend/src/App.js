import React, { useEffect, useState } from "react";
import "./App.css";
import API_URL from "../api";
import AssignmentTable from "./components/AssignmentTable";
import CourseForm from "./components/CourseForm";
import AssignmentForm from "./components/AssignmentForm";
import examIcon from "./assets/assignment-icons/exam.png";
import projectIcon from "./assets/assignment-icons/project.png";
import homeworkIcon from "./assets/assignment-icons/homework.png";
import discussionIcon from "./assets/assignment-icons/discussion.png";
import readingIcon from "./assets/assignment-icons/reading.png";

function App() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignmentToEdit, setAssignmentToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [rightPanelTab, setRightPanelTab] = useState("recommended");
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);


  useEffect(() => {
    fetch(`${API_URL}/courses`)
      .then(response => response.json())
      .then(data => {
        console.log("Courses from backend:", data);
        setCourses(data.info || []);
      })
      .catch(error => {
        console.error("Course fetch error:", error);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/assignments`)
      .then(response => response.json())
      .then(data => {
        console.log("assignments from backend:", data);
        setAssignments(data.assignments || []);
      })
      .catch(error => {
        console.error("Course fetch error:", error);
      });
  }, []);

  const assignmentTypeIcons = {
    "Exam/Quiz": examIcon,
    "Project": projectIcon,
    "Homework": homeworkIcon,
    "Discussion": discussionIcon,
    "Reading": readingIcon
  };

  const handleAssignmentUpdated = (updatedAssignment) => {
    setAssignments(previousAssignments =>
      previousAssignments.map(assignment =>
        assignment._id === updatedAssignment._id
          ? updatedAssignment
          : assignment
      )
    );

    setAssignmentToEdit(null);
    setShowAssignmentForm(false);
  };


  const handleCourseAdded = (course) => {
    setCourses(previousCourses => [
      ...previousCourses,
      course
    ]);
    setShowCourseForm(false);
  };


  const handleAssignmentAdded = (assignment) => {
    setAssignments(previousAssignments => [
      ...previousAssignments,
      assignment
    ]);

    setShowAssignmentForm(false);
  };

  const handleEdit = (assignment) => {
    setAssignmentToEdit(assignment);
    setShowAssignmentForm(true);
    setShowCourseForm(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/assignments/${id}`,
        {
          method: "DELETE"
        });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setAssignments(previousAssignments =>
        previousAssignments.filter(
          assignment => assignment._id !== id
        ));

    }
    catch (error) {
        console.error(error);
    }
  };

  const handleCourseDelete = async (id) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this course?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/courses/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Could not delete course.");
            return;
        }

        setCourses(previousCourses =>
            previousCourses.filter(course => course._id !== id)
        );
    } catch (error) {
        console.error("Course delete error:", error);
    }
};

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch =
      assignment.title
        .toUpperCase()
        .includes(searchTerm.toUpperCase());

    const matchesCourse =
      selectedCourse === "" ||
      assignment.course?._id === selectedCourse;

    return matchesSearch && matchesCourse;
  });

  const activeAssignments = filteredAssignments.filter(
    assignment => assignment.status !== "Completed"
  );

  const completedAssignments = assignments.filter(
    assignment => assignment.status === "Completed"
  );

  const assignmentWeights = {
    "Exam/Quiz": 5,
    "Project": 4,
    "Homework": 3,
    "Discussion Post": 2,
    "Reading": 1
  };

  const getUrgencyScore = dueDate => {
    const today = new Date();
    const due = new Date(dueDate);

    const daysRemaining = Math.ceil(
      (due - today) / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining < 0) return 6;
    if (daysRemaining <= 1) return 5;
    if (daysRemaining <= 3) return 4;
    if (daysRemaining <= 7) return 3;
    if (daysRemaining <= 14) return 2;

    return 1;
  };

  const getPriorityScore = assignment => {
  if (assignment.status === "Completed") {
    return 0;
  }

  const typeWeight =
    assignmentWeights[assignment.assignmentType] || 0;

  return typeWeight + getUrgencyScore(assignment.dueDate);
  };

  const priorityAssignments = [...activeAssignments].sort(
    (a, b) => getPriorityScore(b) - getPriorityScore(a)
  );


  const handleToggleComplete = async assignment => {
    const newStatus =
      assignment.status === "Completed"
        ? "Not Started"
        : "Completed";

    try {
      const response = await fetch(
        `${API_URL}/assignments/${assignment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...assignment,
            course: assignment.course?._id,
            status: newStatus
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      handleAssignmentUpdated(
        data.assignment || data.info
      );
    } catch (error) {
      console.error("Completion update error:", error);
    }
  };

  const handleClearCompleted = async () => {
    const confirmed = window.confirm(
      "Permanently delete all completed assignments?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/assignments/completed`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setAssignments(previousAssignments =>
        previousAssignments.filter(
          assignment => assignment.status !== "Completed"
        )
      );
    } catch (error) {
      console.error("Clear completed error:", error);
    }
  };


  const handleShowCourseForm = () => {
    setShowCourseForm(previous => !previous);
    setShowAssignmentForm(false);
  };

  const handleShowAssignmentForm = () => {
    setAssignmentToEdit(null);
    setShowAssignmentForm(previous => !previous);
    setShowCourseForm(false);
  };

  const getDueDateMessage = dueDate => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const savedDate = new Date(dueDate);

    const due = new Date(
      savedDate.getUTCFullYear(),
      savedDate.getUTCMonth(),
      savedDate.getUTCDate()
    );

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const daysRemaining = Math.round(
      (due - today) / millisecondsPerDay
    );

    if (daysRemaining < 0) {
      const daysOverdue = Math.abs(daysRemaining);

      return `Overdue by ${daysOverdue} ${
        daysOverdue === 1 ? "day" : "days"
      }`;
    }

    if (daysRemaining === 0) {
      return "Due today";
    }

    if (daysRemaining === 1) {
      return "Due tomorrow";
    }

    return `Due in ${daysRemaining} days`;
  };

return (
  <div className="container-fluid px-4 py-4">
      {/* Header */}
      <header className="mb-4">
        <h1 className="mb-1">Study Planner</h1>

        <p className="text-muted mb-0">
          Stay Organized And Don't Procrastinate :D
        </p>
      </header>

      {/* Add buttons */}
      <div className="form-actions">
        <button
          type="button"
          className="form-action-button"
          onClick={handleShowCourseForm}
          aria-expanded={showCourseForm}
          aria-controls="course-form-section"
        >
          {showCourseForm
            ? "Close Course Form"
            : "+ Add Course"}
        </button>

        <button
          type="button"
          className="form-action-button assignment-button"
          onClick={handleShowAssignmentForm}
          aria-expanded={showAssignmentForm}
          aria-controls="assignment-form-section"
        >
          {showAssignmentForm
            ? "Close Assignment Form"
            : "+ Add Assignment"}
        </button>
      </div>

      {/* Collapsible forms */}
      {showCourseForm && (
        <div
          id="course-form-section"
          className="collapsible-form"
        >
          <CourseForm
            courses={courses}
            onCourseAdded={handleCourseAdded}
          />
        </div>
      )}

      {showAssignmentForm && (
        <div
          id="assignment-form-section"
          className="collapsible-form"
        >
          <AssignmentForm
            courses={courses}
            onAssignmentAdded={handleAssignmentAdded}
            assignmentToEdit={assignmentToEdit}
            onAssignmentUpdated={handleAssignmentUpdated}
          />
        </div>
      )}

      {/* Dashboard columns */}
      <div className="row g-4 align-items-start">
        {/* Left side */}
        <div className="col-lg-8">
          {/* Assignment management */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0">Assignments</h2>

                <span className="text-muted">
                  {activeAssignments.length} active
                </span>
              </div>

              {/* Search and filter */}
              <div className="row g-3 mb-4">
                <div className="col-md-7">
                  <label
                    htmlFor="assignmentSearch"
                    className="form-label"
                  >
                    Search Assignments
                  </label>

                  <input
                    id="assignmentSearch"
                    type="text"
                    className="form-control"
                    placeholder="Search by assignment title"
                    value={searchTerm}
                    onChange={event =>
                      setSearchTerm(event.target.value)
                    }
                  />
                </div>

                <div className="col-md-5">
                  <label
                    htmlFor="courseFilter"
                    className="form-label"
                  >
                    Filter by Course
                  </label>

                  <select
                    id="courseFilter"
                    className="form-select"
                    value={selectedCourse}
                    onChange={event =>
                      setSelectedCourse(event.target.value)
                    }
                  >
                    <option value="">All Courses</option>

                    {courses.map(course => (
                      <option
                        key={course._id}
                        value={course._id}
                      >
                        {course.courseCode}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                <AssignmentTable
                  assignments={activeAssignments}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onToggleComplete={handleToggleComplete}
                />
              </div>
            </div>
          </div>

          {/* Course management */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0">Courses</h2>

                <span className="text-muted">
                  {courses.length} total
                </span>
              </div>

              {courses.length > 0 ? (
                courses.map(course => (
                  <div
                    key={course._id}
                    className="course-list-item"
                  >
                    <div className="course-list-information">
                      <span
                        className="course-color-dot"
                        style={{
                          "--course-color":
                            course.color || "#6c757d"
                        }}
                      />

                      <div>
                        <strong>{course.courseCode}</strong>

                        <div className="text-muted small">
                          {course.courseName}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() =>
                        handleCourseDelete(course._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-muted mb-0">
                  No courses have been added.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="col-lg-4">
          <div className="card priority-panel">
            <div className="card-header pb-0">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button
                    type="button"
                    className={
                      rightPanelTab === "recommended" ? "nav-link active" : "nav-link"
                    }
                    onClick={() =>
                      setRightPanelTab("recommended")
                    }
                  >
                    Recommended ({priorityAssignments.length})
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    type="button"
                    className={
                      rightPanelTab === "completed" ? "nav-link active" : "nav-link"
                    }
                    onClick={() =>
                      setRightPanelTab("completed")
                    }
                  >
                    Completed ({completedAssignments.length})
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-body">
              {rightPanelTab === "recommended" ? (
                <>
                  <h2 className="panel-heading">
                    Recommended Next
                  </h2>

                  {priorityAssignments.length > 0 ? (
                    <div className="priority-card-list">
                      {priorityAssignments.map(assignment => (
                        <div
                          key={assignment._id}
                          className="priority-task-card"
                          style={{
                            "--course-color":
                              assignment.course?.color ||
                              "#6c757d"
                          }}
                        >
                          <img
                            className="assignment-type-icon"
                            src={assignmentTypeIcons[assignment.assignmentType]}
                            alt={`${assignment.assignmentType} icon`}
                          />

                          <div className="priority-card-top">
                            <span className="priority-course-code">
                              {assignment.course?.courseCode ||
                                "Course Deleted"}
                            </span>

                            <input
                              type="checkbox"
                              className="priority-checkbox"
                              checked={
                                assignment.status === "Completed"
                              }
                              onChange={() =>
                                handleToggleComplete(assignment)
                              }
                              aria-label={`Mark ${assignment.title} complete`}
                            />
                          </div>

                          <h3 className="priority-assignment-title">
                            {assignment.title}
                          </h3>

                          {assignment.notes && (
                            <p className="priority-notes">
                              {assignment.notes}
                            </p>
                          )}

                          <p className="priority-due-date">
                            {getDueDateMessage(
                              assignment.dueDate
                            )}
                          </p>

                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-panel-message">
                      No active assignments.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <h2 className="panel-heading">
                    Completed Assignments
                  </h2>

                  {completedAssignments.length > 0 ? (
                    <>
                      <div className="priority-card-list">
                        {completedAssignments.map(
                          assignment => (
                            <div
                              key={assignment._id}
                              className="priority-task-card completed-task-card"
                              style={{
                                "--course-color":
                                  assignment.course?.color ||
                                  "#6c757d"
                              }}
                            >
                              <div className="priority-card-top">
                                <span className="priority-course-code">
                                  {assignment.course
                                    ?.courseCode ||
                                    "Course Deleted"}
                                </span>

                                <input
                                  type="checkbox"
                                  className="priority-checkbox"
                                  checked={
                                    assignment.status ===
                                    "Completed"
                                  }
                                  onChange={() =>
                                    handleToggleComplete(
                                      assignment
                                    )
                                  }
                                  aria-label={`Restore ${assignment.title}`}
                                />
                              </div>

                              <h3 className="priority-assignment-title">
                                {assignment.title}
                              </h3>

                              <p className="priority-due-date">
                                Completed
                              </p>
                            </div>
                          )
                        )}
                      </div>

                      <button
                        type="button"
                        className="btn btn-outline-danger w-100 mt-3"
                        onClick={handleClearCompleted}
                      >
                        Clear Completed
                      </button>
                    </>
                  ) : (
                    <p className="empty-panel-message">
                      No completed assignments.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;