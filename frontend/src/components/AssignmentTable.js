function AssignmentTable({ assignments, onDelete, onEdit, onToggleComplete }) {
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Course</th>
                    <th>Title</th>
                    <th>Assignment</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                    <th>Completed</th>
                </tr>
            </thead>

            <tbody>
                {assignments.map((assignment) => (
                    <tr key={assignment._id}>
                            <td>{assignment.course?.courseCode || "Course Deleted"}</td>
                            <td>{assignment.title}</td>
                            <td>{assignment.assignmentType}</td>
                            <td>{assignment.status}</td>
                            <td>
                                {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                })}
                            </td>
                        
                        <td>
                            <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() => onEdit(assignment)}
                            >
                            Edit
                            </button>

                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => onDelete(assignment._id)}
                            >
                            Delete
                            </button>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                checked={assignment.status === "Completed"}
                                onChange={() => onToggleComplete(assignment)}
                                aria-label={`Mark ${assignment.title} complete`}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
export default AssignmentTable;