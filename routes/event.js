const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { advancedResults } = require("../middleware/advancedResults");
const Event = require("../models/Event");
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  eventPhotoUpload,
} = require("../controllers/events");

// -------------------------------
router.get("/", advancedResults(Event, "events"), getEvents);
router.post("/", protect, authorize("publisher", "admin"), createEvent);
router.get("/:id", getEvent);
router.put("/:id", protect, authorize("publisher", "admin"), updateEvent);
router.put("/:id/photo", authorize("publisher", "admin"), eventPhotoUpload);
router.delete("/:id", protect, authorize("publisher", "admin"), deleteEvent);

module.exports = router;
