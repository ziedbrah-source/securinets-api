const path = require("path");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const ErrorResponse = require("../utils/errorResponse");
// @desc Get all bootcamps
// @route Get /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get single bootcamps
// @route Get /api/v1/bootcamps/:id
// @access Private
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});
// @desc create bootcamps
// @route Post /api/v1/bootcamps/
// @access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  //Check if the creator is a publisher
  if (req.user.role != "publisher") {
    return next(
      new ErrorResponse(
        `the user with ID ${req.user.id} is not elligible to create a bootcamp.`,
        400
      )
    );
  }
  // Add user to req.body
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc update bootcamp
// @route Put /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    next(
      new ErrorResponse(`Bootcamp not found with id  of ${req.params.id}`, 404)
    );
  }
  //Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        `user with id: ${req.user.id} is not authorized to update this bootcamp.`,
        401
      )
    );
  }
  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true, // get the updated data when returning it here
    runValidators: true,
  });
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc delete bootcamp
// @route Delete /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  //Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        `user with id: ${req.user.id} is not authorized to delete this bootcamp.`,
        401
      )
    );
  }
  bootcamp.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc Get bootcamps within a radius
// @route Get /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide distance by radius of Earth (3,963 miles)
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: {
      $within: { $centerSphere: [[lng, lat], radius] },
    },
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc Upload bootcamp photo
// @route Put /api/v1/bootcamps/:id/photo
// @access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  //Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        `user with id: ${req.user.id} is not authorized to upload photo to this bootcamp.`,
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
  await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
  res.status(200).json({ success: true, data: file.name });
});
