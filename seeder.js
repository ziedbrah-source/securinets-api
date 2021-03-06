const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load ENV Variables
dotenv.config({ path: "./config/config.env" });

// Load models
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const User = require("./models/User");

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Read JSON files

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

// Import into DB

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    console.log("DATA IMPORTED...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany(); // all of them
    await Course.deleteMany(); // all of them
    await User.deleteMany(); // all of them
    console.log("DATA DESTROYED...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
// node seeder <-i> #i means import , -d means delete

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
