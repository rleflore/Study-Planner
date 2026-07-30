import { useState } from "react";
import API_URL from "../api";

function CourseForm({ courses, onCourseAdded }) {
    const [courseName, setCourseName] = useState("");
    const [courseCode, setCourseCode] = useState("");
    const [color, setColor] = useState("#0d6efd");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const duplicate = courses.some(c => c.courseCode.toUpperCase() === courseCode.toUpperCase());

        if (duplicate) {
            alert("That course already exists.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/courses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    courseName,
                    courseCode,
                    color
                })
            });

            const data = await response.json();

            console.log("Status:", response.status);
            console.log("Course response:", data);

            if (!response.ok) {
                throw new Error(data.error || "Unable to add course");
            }

            if (data.success && data.course) {
                onCourseAdded(data.course);

                setCourseName("");
                setCourseCode("");
                setColor("#0d6efd");
            }
        } catch (error) {
            console.error("Course error:", error);
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h3>Add Course</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">
                            Course Name
                        </label>

                        <input
                            required
                            className="form-control"
                            value={courseName}
                            onChange={(event) =>
                                setCourseName(event.target.value)
                            }
                            unique
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Course Code
                        </label>

                        <input
                            required
                            className="form-control"
                            value={courseCode}
                            onChange={(event) =>
                                setCourseCode(event.target.value)
                            }
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Color
                        </label>

                        <input
                            type="color"
                            className="form-control form-control-color"
                            value={color}
                            onChange={(event) =>
                                setColor(event.target.value)
                            }
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Add Course
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CourseForm;