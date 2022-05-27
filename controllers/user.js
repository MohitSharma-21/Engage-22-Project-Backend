const { User } = require("../models");
const jwt = require("jsonwebtoken");

const tf = require("@tensorflow/tfjs-node"); // npm i @tensorflow/tfjs-node@1.0.2
const faceapi = require("face-api.js");

const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });


const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY_JWT, {
    expiresIn: maxAge,
  });
};


const signin = async (req, res) => {
  
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {

        const error = "User doesn't exist"

        res.status(403).send({error:error});

      } else {
        const token = createToken(user._id);

        const error = ""
        res.status(201).send({
          labeledFaceDescriptors: user.labeledFaceDescriptors,
          token: token,
          error:error
        });
      }
      
    })
    .catch((err) => {
      console.log(err)
      const error = "User doesn't exist"

      res.send({error:error});
    });
};

const getSignUpFaceDescriptors = async (username, images, faces) => {
  const descriptions = [];

  for (let i = 0; i < images.length; i++) {
    const img = await canvas.loadImage(images[i]);

    const detections = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();
      
    console.log(i)
    if (detections) {
      console.log("face ",i)
      faces.face_detcted = faces.face_detcted + 1;

      descriptions.push(detections.descriptor);
    }    
  }

  return new faceapi.LabeledFaceDescriptors(username, descriptions);

};

const signup = async (req, res) => {
  const images_to_validate = req.body.images_to_validate;
  const username = req.body.username;

  let faces = {
    face_detcted: 0,
  };

  const labeledFaceDescriptors = await getSignUpFaceDescriptors(
    username,
    images_to_validate,
    faces
  );

  // checking if any face is detected or not

  if (faces.face_detcted > 0) {
    // if face is detected than sign-up

    const labeledFaceDescriptorsJSON = labeledFaceDescriptors.toJSON();

    const labeledFaceDescriptorsORIGINAL =
      faceapi.LabeledFaceDescriptors.fromJSON(labeledFaceDescriptorsJSON);

    const dataToUpload = {
      username: username,
      images_to_validate: images_to_validate,
      labeledFaceDescriptors: labeledFaceDescriptorsJSON,
    };

    User.create(dataToUpload)
      .then((user) => {
        
        const token = createToken(user._id);
        const error = {
          face: "",
        };
        res
          .status(201)
          .send({ user: user.username, token: token, error: error });
      })
      .catch((err) => {
        
        const error = {
          unique: "User already exist",
          custom: "Some error occured at our end",
        };
        res.status(403).send(error);
      });
  } else {
    
    const error = {
      face: "No face detected, Please capture clear photo",
    };
    res.send({ error });
  }
};

const profile = async (req, res) => {
  
  User.findById(req.user) // id = req.user
    .then((user) => res.status(200).send(user))
    .catch((err) => 
    {
      console.log(err)
      res.status(500).send("some err occured at our end");
    }
    );
};

module.exports = { signup, signin, profile };
