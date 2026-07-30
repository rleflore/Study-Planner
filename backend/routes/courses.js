var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Assignment = require("../schema/Assignment");
const Course = require("../schema/Course");

const dbRoute =
    "mongodb+srv://rleflore_db_user:metJHgK8i4cmCAq4@cluster0.ezl8xjb.mongodb.net/?appName=Cluster0";
    
mongoose.connect(dbRoute, {
    dbName: "studyPlanner"
});

let db = mongoose.connection;

db.once("open", () => console.log("Connected to the database"));

db.on(
    "error",
    console.error.bind(console, "MongoDB connection error:")
);

router.get("/courses", async (req, res) => {
    try {
        const data = await Course.find({});

        return res.json({
            success: true,
            info: data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            error: err.message
        });

    }
});
router.post("/courses", async (req, res) => {
    try {
        const existingCourse = await Course.findOne({
            courseCode: req.body.courseCode
        });

        if (existingCourse) {
            return res.status(400).json({
                success: false,
                error: "A course with that course code already exists."
            });
        }

        const newCourse = new Course({
            courseName: req.body.courseName,
            courseCode: req.body.courseCode,
            color: req.body.color
        });

        await newCourse.save();

        return res.status(201).json({
            success: true,
            course: newCourse
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.delete("/courses/:id", async (req, res) => {
    try {
        const assignmentsUsingCourse = await Assignment.countDocuments({
            course: req.params.id
        });

        if (assignmentsUsingCourse > 0) {
            return res.status(400).json({
                success: false,
                error: "Delete the assignments for this course first."
            });
        }

        const deletedCourse = await Course.findByIdAndDelete(req.params.id);

        if (!deletedCourse) {
            return res.status(404).json({
                success: false,
                error: "Course not found."
            });
        }

        return res.json({
            success: true
        });
    } catch (error) {
        console.error("Course DELETE error:", error);

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;