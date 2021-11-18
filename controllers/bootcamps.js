const Bootcamp=require('../models/Bootcamp')
const ErrorResponse= require('../utils/errorResponse')
// @desc Get all bootcamps
// @route Get /api/v1/bootcamps
// @access Public
exports.getBootcamps=async(req,res,next)=>{
    try {
        const bootcamps= await Bootcamp.find()
        res.status(200).json({success: true, count: bootcamps.length, data:bootcamps })
       }catch(err){
           next(err)
       }
}

// @desc Get single bootcamps
// @route Get /api/v1/bootcamps/:id
// @access Private
exports.getBootcamp=async(req,res,next)=>{
    try {
        const bootcamp= await Bootcamp.findById(req.params.id)
        if(!bootcamp){
           return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
        }
        res.status(200).json({success: true, data:bootcamp })
       }catch(err){
        next(err)
       }
}

// @desc create bootcamps
// @route Post /api/v1/bootcamps/
// @access Private
exports.createBootcamp=async(req,res,next)=>{
   try {
    const bootcamp= await Bootcamp.create(req.body)
    res.status(201).json({success: true, data:bootcamp })
   }catch(err){
       next(err)
   }
}

// @desc update bootcamp
// @route Put /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp=async(req,res,next)=>{
    try{
    const bootcamp=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
        new: true, // get the updated data when returning it here
        runValidators:true
    })
    if(!bootcamp){
        next(new ErrorResponse(`Bootcamp not found with id  of ${req.params.id}`,404))
    }
    res.status(200).json({success: true, data: bootcamp})
    }catch(err){
        next(err)
    }

}

// @desc delete bootcamp
// @route Delete /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp=async(req,res,next)=>{
    try{
        const bootcamp=await Bootcamp.findByIdAndDelete(req.params.id)
        if(!bootcamp){
            next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
        }
        res.status(200).json({success: true, data: {}})
        }catch(err){
            next(err)
        }
}