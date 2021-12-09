const express = require("express");
const Course = require("../models/Course");
const { advancedResults } = require("../middleware/advancedResults");
const router = express.Router({ mergeParams: true }); // mergeParams let us use the routers in bootcamps router
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
const { protect, authorize } = require("../middleware/auth");
router.get(
  "/",
  advancedResults(Course, {
    path: "bootcamp",
    select: "name description",
  }),
  getCourses
);
router.post("/", protect, authorize("publisher", "admin"), addCourse);
router.get("/:id", getCourse);
router.put("/:id", protect, authorize("publisher", "admin"), updateCourse);
router.delete("/:id", protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
