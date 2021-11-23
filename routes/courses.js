const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams let us use the routers in bootcamps router
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
router.get("/", getCourses);
router.post("/", addCourse);
router.post("/", addCourse);
router.get("/:id", getCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;
