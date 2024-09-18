const express = require("express");
const body_parser = require("body-parser");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const postsRoutes = require("./routes/posts");
const invitationRoutes = require("./routes/invitation");

mongoose
  .connect(
    "mongodb+srv://kiran_pj:MyMango123@social-orbit.5dpdg.mongodb.net/social_orbit_db?retryWrites=true&w=majority&appName=Social-Orbit"
  )
  .then(() => {
    console.log("Connected to database!!");
  })
  .catch((error) => {
    console.log(error);
  });

// This is the parse request body
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("./images")));

// This is to solve CORS issue
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, X-Requested-With, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/invitation", invitationRoutes);

module.exports = app;
