const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        courseName: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        courseCode: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
            unique: true
        },

        color: {
            type: String,
            required: true,
            default: "#0d6efd"
        }
    },
    {
        timestamps: true
    }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;