const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
// Load env vars
dotenv.config({ path: "./config/config.env" });
// Logger
const morgan = require("morgan");
const fileupload = require("express-fileupload");
// ErrorHandler
const errorHandler = require("./middleware/error");
// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");

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

// File upload middleware
app.use(fileupload());
// Sanitize data
app.use(mongoSanitize());
// Set security headers
app.use(helmet());
// Prevent XSS attacks
app.use(xss());
// Set static folder
app.use(express.static(path.join(__dirname, "public")));
// Mount Routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);

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
