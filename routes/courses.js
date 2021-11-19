const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams let us use the routers in bootcamps router
const { getCourses } = require("../controllers/courses");
router.get("/", getCourses);

module.exports = router;
