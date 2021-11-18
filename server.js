const express = require('express');
const dotenv = require('dotenv')
const connectDB=require("./config/db")
// Logger 
const morgan=require("morgan")
// ErrorHandler
const errorHandler= require('./middleware/error')
// Route files
const bootcamps = require("./routes/bootcamps")
// Load env vars
dotenv.config({path : './config/config.env'})
// Connect to DB
connectDB()
const app=express();
app.use(express.json())
// Log in Dev mode
if(process.env.NODE_ENV=="development"){
    app.use(morgan('dev'))
}
// Mount Routers
app.use("/api/v1/bootcamps",bootcamps)

app.use(errorHandler)
const PORT= process.env.PORT || 5000;


const server=app.listen(PORT, () => {
    console.log(`App listening on port ${PORT} in ${process.env.NODE_ENV} `);
});

//Handle unhandled promise rejections

process.on('unhandledRejection',(err,promise)=>{
    console.log(`error: ${err.message}`)
    // Close server && exit process 
    server.close(()=>{
        process.exit(1)
    })
})