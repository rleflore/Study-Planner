const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        assignmentType: {
            type: String,
            required: true,
            enum: [
                "Exam/Quiz",
                "Project",
                "Homework",
                "Discussion",
                "Reading"
            ]
        },

        status: {
            type: String,
            required: true,
            enum: [
                "Not Started",
                "In Progress",
                "Completed"
            ],
            default: "Not Started"
        },

        dueDate: {
            type: Date,
            required: true
        },

        notes: {
            type: String,
            trim: true,
            default: ""
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;