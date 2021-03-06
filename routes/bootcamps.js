const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { advancedResults } = require("../middleware/advancedResults");
const Bootcamp = require("../models/Bootcamp");
const {
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");
// Include other resource routers

const courseRouter = require("./courses");

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
// -------------------------------
router.get("/", advancedResults(Bootcamp, "courses"), getBootcamps);
router.post("/", protect, authorize("publisher", "admin"), createBootcamp);
router.get("/:id", getBootcamp);
router.put("/:id", protect, authorize("publisher", "admin"), updateBootcamp);
router.put("/:id/photo", authorize("publisher", "admin"), bootcampPhotoUpload);
router.delete("/:id", protect, authorize("publisher", "admin"), deleteBootcamp);
router.get("/radius/:zipcode/:distance", getBootcampsInRadius);

module.exports = router;
