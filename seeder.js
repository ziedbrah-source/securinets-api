const fs= require('fs')
const mongoose=require('mongoose')
const dotenv = require('dotenv')

// Load ENV Variables
dotenv.config({path : './config/config.env'})

// Load models
const Bootcamp=require('./models/Bootcamp')

// Connect to DB
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

// Read JSON files

const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))

// Import into DB

const importData=async ()=>{
    try{
        await Bootcamp.create(bootcamps)
        console.log("DATA IMPORTED...")
        process.exit()
    }catch(err) {
        console.error(err)
    }
}

// Delete data 

const deleteData=async ()=>{
    try{
        await Bootcamp.deleteMany() // all of them
        console.log("DATA DESTROYED...")
        process.exit()
    }catch(err) {
        console.error(err)
    }
}
// node seeder <-i> #i means import , -d means delete

if(process.argv[2]==='-i'){
    importData();
}else if (process.argv[2]==='-d'){
    deleteData();
}
