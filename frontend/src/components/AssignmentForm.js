import { useEffect, useState } from "react";

function AssignmentForm({ courses, onAssignmentAdded, assignmentToEdit, onAssignmentUpdated }) {
    console.log("Courses received:", courses.length);

    const [title, setTitle] = useState("");
    const [course, setCourse] = useState("");
    const [assignmentType, setAssignmentType] = useState("Homework");
    const [status, setStatus] = useState("Not Started");
    const [dueDate, setDueDate] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (assignmentToEdit) {
            setTitle(assignmentToEdit.title);
            setCourse(assignmentToEdit.course?._id || "");
            setAssignmentType(assignmentToEdit.assignmentType);
            setStatus(assignmentToEdit.status);

            setDueDate(
                assignmentToEdit.dueDate
                    ? assignmentToEdit.dueDate.substring(0, 10)
                    : ""
            );

            setNotes(assignmentToEdit.notes || "");
        }
    }, [assignmentToEdit]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const assignmentData = {
            title,
            assignmentType,
            status,
            dueDate,
            notes,
            course
        };

        try {
            const editing = Boolean(assignmentToEdit);

            const url = editing
                ? `${API_URL}/assignments/${assignmentToEdit._id}`
                : `${API_URL}/assignments`;

            const response = await fetch(url, {
                method: editing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(assignmentData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Unable to save assignment"
                );
            }

            if (editing) {
                onAssignmentUpdated(data.assignment);
            } else {
                onAssignmentAdded(data.assignment);
            }

            setTitle("");
            setCourse("");
            setAssignmentType("Homework");
            setStatus("Not Started");
            setDueDate("");
            setNotes("");
        } catch (error) {
            console.error("Assignment error:", error);
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <h3>{assignmentToEdit ? "Edit Assignment" : "Add Assignment"}</h3>
                    <div className="mb-3">
                        <label className="form-label">Title</label>

                        <input className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Course</label>

                        <select className="form-select"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            required
                        >
                            <option value="">Select Course</option>
                            {courses.map((courseItem) => (
                                <option
                                    key={courseItem._id}
                                    value={courseItem._id}
                                >
                                    {courseItem.courseCode}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Assignment Type</label>

                        <select className="form-select"
                            value={assignmentType}
                            onChange={(e) => setAssignmentType(e.target.value)}
                            required
                        >
                            <option>Homework</option>
                            <option>Project</option>
                            <option>Exam/Quiz</option>
                            <option>Discussion</option>
                            <option>Reading</option>

                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Status</label>

                        <select className="form-select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                        >
                            <option>Not Started</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Due Date</label>

                        <input
                            type="date" 
                            className="form-select"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Notes</label>

                        <input
                            className="form-control"
                            rows="3"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        {assignmentToEdit ? "Update Assignment" : "Add Assignment"}
                    </button>

                    {assignmentToEdit && (
                        <button
                            type="button"
                            className="btn btn-secondary ms-2"
                            onClick={() => {
                                setTitle("");
                                setCourse("");
                                setAssignmentType("Homework");
                                setStatus("Not Started");
                                setDueDate("");
                                setNotes("");
                            }}
                        >
                            Clear
                        </button>
                    )}

                </form>
            </div>
        </div>
    )
}

export default AssignmentForm;