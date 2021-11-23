const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
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
router.get("/", getBootcamps);
router.post("/", protect, authorize("publisher", "admin"), createBootcamp);
router.get("/:id", getBootcamp);
router.put("/:id", protect, authorize("publisher", "admin"), updateBootcamp);
router.put("/:id/photo", bootcampPhotoUpload);
router.delete("/:id", protect, authorize("publisher", "admin"), deleteBootcamp);
router.get("/radius/:zipcode/:distance", getBootcampsInRadius);

module.exports = router;
