var express = require("express");
var router = express.Router();

const Assignment = require("../schema/Assignment");

router.get("/assignments", async (req, res) => {
    try {
        const filter = {};

        if (req.query.course) {
            filter.course = req.query.course;
        }

        if (req.query.assignmentType) {
            filter.assignmentType = req.query.assignmentType;
        }

        const assignments = await Assignment.find(filter)
            .populate("course");

        return res.json({
            success: true,
            assignments: assignments
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.post("/assignments", async (req, res) => {
    try {
        const newAssignment = new Assignment({
            title: req.body.title,
            assignmentType: req.body.assignmentType,
            status: req.body.status,
            dueDate: req.body.dueDate,
            notes: req.body.notes,
            course: req.body.course
        });

        await newAssignment.save();

        const populatedAssignment = await Assignment.findById(
            newAssignment._id
        ).populate("course");

        return res.status(201).json({
            success: true,
            assignment: populatedAssignment
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.put("/assignments/:id", async (req, res) => {
    try {
        const updatedAssignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                assignmentType: req.body.assignmentType,
                status: req.body.status,
                dueDate: req.body.dueDate,
                notes: req.body.notes,
                course: req.body.course
            },
            {
                new: true,
                runValidators: true
            }
        ).populate("course");

        if (!updatedAssignment) {
            return res.status(404).json({
                success: false,
                error: "Assignment not found"
            });
        }

        return res.json({
            success: true,
            assignment: updatedAssignment
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.delete("/assignments/completed", async (req, res) => {
  try {
    const result = await Assignment.deleteMany({
      status: "Completed"
    });

    return res.json({
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

router.delete("/assignments/:id", async (req, res) => {
    try {
        const deletedAssignment =
            await Assignment.findByIdAndDelete(req.params.id);

        if (!deletedAssignment) {
            return res.status(404).json({
                success: false,
                error: "Assignment not found"
            });
        }

        return res.json({
            success: true,
            assignment: deletedAssignment
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;