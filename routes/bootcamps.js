const express = require("express");
const router = express.Router();
const {
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcamp,
  getBootcampsInRadius,
} = require("../controllers/bootcamps");
// Include other resource routers

const courseRouter = require("./courses");

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.get("/", getBootcamps);
router.post("/", createBootcamp);
router.get("/:id", getBootcamp);
router.put("/:id", updateBootcamp);
router.delete("/:id", deleteBootcamp);
router.get("/radius/:zipcode/:distance", getBootcampsInRadius);

module.exports = router;
