// @desc Get all bootcamps
// @route Get /api/v1/bootcamps
// @access Public
exports.getBootcamps=(req,res,next)=>{
    res.status(200).json({success: true, msg:"Show all bootcamps" })
}

// @desc Get single bootcamps
// @route Get /api/v1/bootcamps/:id
// @access Private
exports.getBootcamp=(req,res,next)=>{
    res.status(200).json({success: true, msg:`Getting bootcamp number ${req.params.id}` })
}

// @desc create bootcamps
// @route Post /api/v1/bootcamps/
// @access Private
exports.createBootcamp=(req,res,next)=>{
    res.status(200).json({success: true, msg:"A bootcamp is added" })
}

// @desc update bootcamp
// @route Put /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp=(req,res,next)=>{
    res.status(200).json({success: true, msg:`updating bootcamp number ${req.params.id}` })

}

// @desc delete bootcamp
// @route Delete /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp=(req,res,next)=>{
    res.status(200).json({success: true, msg:`deleting bootcamp number ${req.params.id}` })
}