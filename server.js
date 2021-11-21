const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
// Load env vars
dotenv.config({ path: "./config/config.env" });
// Logger
const morgan = require("morgan");
// ErrorHandler
const errorHandler = require("./middleware/error");
// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");

// Connect to DB
connectDB();
const app = express();
// Body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());

// Log in Dev mode
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}
// Mount Routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT} in ${process.env.NODE_ENV} `);
});

//Handle unhandled promise rejections

process.on("unhandledRejection", (err, promise) => {
  console.log(`error: ${err.message}`);
  // Close server && exit process
  server.close(() => {
    process.exit(1);
  });
});
