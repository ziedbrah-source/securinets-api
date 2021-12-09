const path = require("path");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
// @desc Get all Events
// @route Get /api/v1/events
// @access Public
exports.getEvents = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get single Event
// @route Get /api/v1/events/:id
// @access Private
exports.getEvetn = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: event });
});
// @desc create event
// @route Post /api/v1/events/
// @access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  //Check if the creator is a publisher
  if (req.user.role != "publisher") {
    return next(
      new ErrorResponse(
        `the user with ID ${req.user.id} is not elligible to create an event.`,
        400
      )
    );
  }
  // Add user to req.body
  req.body.user = req.user.id;

  const event = await Event.create(req.body);
  res.status(201).json({ success: true, data: event });
});

// @desc update event
// @route Put /api/v1/event/:id
// @access Private
exports.updateEvent = asyncHandler(async (req, res, next) => {
  let event = await Event.findById(req.params.id);
  if (!event) {
    next(
      new ErrorResponse(`Event not found with id  of ${req.params.id}`, 404)
    );
  }
  //Make sure user is event owner
  if (event.user.toString() !== req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        `user with id: ${req.user.id} is not authorized to update this event.`,
        401
      )
    );
  }
  event = await Event.findOneAndUpdate(req.params.id, req.body, {
    new: true, // get the updated data when returning it here
    runValidators: true,
  });
  res.status(200).json({ success: true, data: event });
});

// @desc delete event
// @route Delete /api/v1/events/:id
// @access Private
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }
  //Make sure user is bootcamp owner
  if (event.user.toString() !== req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        `user with id: ${req.user.id} is not authorized to delete this event.`,
        401
      )
    );
  }
  event.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc Upload bootcamp photo
// @route Put /api/v1/events/:id/photo
// @access Private
exports.eventPhotoUpload = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  //Make sure user is bootcamp owner
  if (event.user.toString() !== req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        `user with id: ${req.user.id} is not authorized to upload photo to this event.`,
        401
      )
    );
  }
  if (!req.files) {
    next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;
  // Make sure that the image is a photo
  if (!file.mimetype.startsWith("image")) {
    next(new ErrorResponse(`Please upload an image file`, 400));
  }
  // Check filesize (<1mb)
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
  });
  await event.findByIdAndUpdate(req.params.id, { photo: file.name });
  res.status(200).json({ success: true, data: file.name });
});
