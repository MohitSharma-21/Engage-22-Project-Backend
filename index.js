const express = require("express");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { UserRoutes, PhotoRoutes, ToDoRoutes } = require("./routes");

const tf = require("@tensorflow/tfjs-node"); // npm i @tensorflow/tfjs-node@1.7.0
const faceapi = require("face-api.js");
const canvas = require("canvas");

require("dotenv").config();

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
const modelPathRoot = "./public/models";
console.log(tf.version);

const app = express();

// app.use(json());
app.use(
  json({
    limit: "50mb",
  })
);

app.use(
  urlencoded({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);

app.use(cors());

app.disable("x-powered-by");

const PORT = process.env.PORT || 5000;
// const mongoDB = "mongodb://127.0.0.1/node-face-recognition-app";
const mongoDB = process.env.DB_URL || "mongodb://127.0.0.1/node-face-recognition-app";

// mongoose.set("useFindAndModify", false);
// mongoose.set("useCreateIndex", true);

const LoadModels = () => {
  return Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromDisk(modelPathRoot),
    faceapi.nets.faceRecognitionNet.loadFromDisk(modelPathRoot),
    faceapi.nets.faceLandmark68Net.loadFromDisk(modelPathRoot),
    faceapi.nets.faceExpressionNet.loadFromDisk(modelPathRoot),
    faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPathRoot),
  ]);
};

mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    LoadModels().then(() => {
      console.log("loaded");
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} and connected to database`);
      });
    });
  })
  .catch((err) => console.log(err.message));

app.use("/api/auth", UserRoutes);
app.use("/api/gallery/", PhotoRoutes);
app.use("/api/todo/", ToDoRoutes);

app.get("/", (req, res) => {
  res.send("hello");
});

app.use((req, res, next) => {
  res.status(404).send("404 Not Found");
  next();
});
