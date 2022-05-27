const { Photo } = require("../models");

const tf = require("@tensorflow/tfjs-node"); // npm i @tensorflow/tfjs-node@1.0.2
const faceapi = require("face-api.js");

const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const getPhotoLabels = async (req, res) => {

  Photo.find({ createdBy: req.user }, { _id: 1, image_label: 1 })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("some err occured at our end");
    });

};

const getAllPhotoByLabel = async (req, res) => {
  // to get photos of folder name

  Photo.findOne(
    { $and: [{ createdBy: req.user }, { _id: req.params.id }] },
    {
      id: 1,
      images: 1,
      image_label: 1,
    }
  )
    .then((photos) => {
      res.status(200).send(photos);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("some err occured at our end");
    });

};

const deletePhoto = async (req, res) => {

  const index = parseInt(req.params.index);

  Photo.findOne({
    $and: [{ createdBy: req.user }, { _id: req.params.id }],
  })
  .then((data) => {

    const isLFD = data.labeledFaceDescriptors.length;
    const isImages = data.images.length;

    // checking whether the photo has a label or not

    if (isImages == 1) {
      // if there is only one image left then dlt the folder too

      Photo.findOneAndDelete({
        $and: [{ createdBy: req.user }, { _id: req.params.id }],
      })
        .then((dlt) => {
          res.status(200).send("DELETED SUCESSFULLY");
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("some err occured at our end");
        });

    } else if (isLFD == isImages) {
      // for images having label or which are used for image classification
      // deleting using index

      Photo.findOneAndUpdate(
        { $and: [{ createdBy: req.user }, { _id: req.params.id }] },
        [
          {
            $set: {
              images: {
                $concatArrays: [
                  { $slice: ["$images", index] },
                  {
                    $slice: [
                      "$images",
                      { $add: [1, index] },
                      { $size: "$images" },
                    ],
                  },
                ],
              },
              labeledFaceDescriptors: {
                $concatArrays: [
                  { $slice: ["$labeledFaceDescriptors", index] },
                  {
                    $slice: [
                      "$labeledFaceDescriptors",
                      { $add: [1, index] },
                      { $size: "$labeledFaceDescriptors" },
                    ],
                  },
                ],
              },
            },
          },
        ]
      )
        .then((data) => {
          res.status(200).send("REMOVED FROM SINGLE");
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("some err occured at our end");
        });
        
    } else {
      // for images which dont have label descriptor

      Photo.findOneAndUpdate(
        { $and: [{ createdBy: req.user }, { _id: req.params.id }] },
        [
          {
            $set: {
              images: {
                $concatArrays: [
                  { $slice: ["$images", index] },
                  {
                    $slice: [
                      "$images",
                      { $add: [1, index] },
                      { $size: "$images" },
                    ],
                  },
                ],
              },
            },
          },
        ]
      )
        .then((data) => {
          res.status(200).send("FROM GRP");
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("some err occured at our end");
        });

    }
  });

};

const getGalleryFaceDescriptors = async (data) => {
  // getting the label descriptor of images saved in the database

  return Promise.all(
    data.map(async ({ labeledFaceDescriptors, image_label }) => {
      const descriptions = [];

      for (let i = 0; i < labeledFaceDescriptors.length; i++) {
        const labeledFaceDescriptor = faceapi.LabeledFaceDescriptors.fromJSON(
          labeledFaceDescriptors[i]
        );

        descriptions.push(labeledFaceDescriptor._descriptors[0]);
      }
      return new faceapi.LabeledFaceDescriptors(image_label, descriptions);
    })
  );

};

const addPhotoToFolder = async (images, image_label, req, res) => {

  const dataToUpload = {
    image_label: image_label,
    images: images,
    createdBy: req.user,
  };

  Photo.find({
    $and: [{ createdBy: req.user, image_label: image_label }],
  })
  .then((photos) => {
    if (photos.length > 0) {
      // if there is already a folder we have to just update it

      Photo.findOneAndUpdate(
        { $and: [{ createdBy: req.user, image_label: image_label }] },

        {
          $push: {
            images: images,
          },
        }
      )
        .then((result) => {
          res.status(200).send(image_label);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("some err occured at our end");
        });

    } else {

      const dataToUpload = {
        image_label: image_label,
        images: images,
        createdBy: req.user,
      };

      Photo.create(dataToUpload)
        .then((photo) => {
          res.status(200).send(image_label);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("some err occured at our end");
        });
    }
  });

};

const addPhoto = async (req, res) => {

  const images = req.body.images;
  const image_label = req.body.image_label;

  const img = await canvas.loadImage(images);

  const detections = await faceapi.detectAllFaces(
    img,
    new faceapi.TinyFaceDetectorOptions()
  );

  if (detections == 0) {
    // if no face is detected add it to "No face detected" folder
    addPhotoToFolder(images, "No face detected", req, res);

  } else if (detections.length == 1) {
    // if only single face is detected
    // 1.face matched with the database
    // 2. not matches
    // 3.user has put the photo with name
    // 4.user has not photo name

    // in each subpart check whether folder corresponding to image is already made or not

    const descriptions = [];
    const detections = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detections) {
      descriptions.push(detections.descriptor);
    }

    Photo.find(
      {
        $and: [
          { image_label: { $ne: "Group Photo" } },
          { image_label: { $ne: "No face detected" } },
          { image_label: { $ne: "Unknown" } },
          { createdBy: req.user },
        ],
      },
      {
        _id: 0,
        image_label: 1,
        labeledFaceDescriptors: 1,
      }
    )
      .then(async (photos) => {
        // here photos = folders of photos

        if (photos.length > 0) {
          const labeledFaceDescriptors = await getGalleryFaceDescriptors(
            photos
          );

          const faceMatcher = new faceapi.FaceMatcher(
            labeledFaceDescriptors,
            0.6
          );

          if (detections) {

            const result = faceMatcher.findBestMatch(detections.descriptor);

            const label = result.toString().split(" ");
            var labelName = label[0];
            var labelProbString = label[1];
            labelProbString = labelProbString.replace("(", "");
            var labelProb = parseFloat(labelProbString);

            if (labelName !== "unknown" && labelName.length > 0) {
              // photo matched with one fo the data

              const FaceDescriptorOfQueryImage =
                new faceapi.LabeledFaceDescriptors(labelName, descriptions);

              const FaceDescriptorOfQueryImageJSON =
                FaceDescriptorOfQueryImage.toJSON();

              Photo.findOneAndUpdate(
                { $and: [{ createdBy: req.user, image_label: labelName }] },
                {
                  $push: {
                    labeledFaceDescriptors: FaceDescriptorOfQueryImageJSON,
                    images: images,
                  },
                }
              )
                .then((result) => {
                  res.status(200).send(labelName);
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).send("some err occured at our end");
                });

            } else {
              // if not matches with database
              // 1. user has given image label
              // 2. user has NOT given image label

              const image_label = req.body.image_label;

              const FaceDescriptorOfQueryImage =
                new faceapi.LabeledFaceDescriptors(image_label, descriptions);

              const FaceDescriptorOfQueryImageJSON =
                FaceDescriptorOfQueryImage.toJSON();

              if (image_label.length > 0) {
                const dataToUpload = {
                  image_label: image_label,
                  images: images,
                  labeledFaceDescriptors: FaceDescriptorOfQueryImageJSON,
                  createdBy: req.user,
                };

                Photo.create(dataToUpload)
                  .then((photo) => {
                    res.status(200).send(image_label);
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).send("some err occured at our end");
                  });

              } else {

                const image_label = "Unknown";
                addPhotoToFolder(images, image_label, req, res);
              }
            }
          }
        } else {
          // if no folder not already exists

          if (image_label.length > 0) {
            // if user enetered image label
            const FaceDescriptorOfQueryImage =
              new faceapi.LabeledFaceDescriptors(image_label, descriptions);

            const FaceDescriptorOfQueryImageJSON =
              FaceDescriptorOfQueryImage.toJSON();

            const dataToUpload = {
              image_label: image_label,
              images: images,
              labeledFaceDescriptors: FaceDescriptorOfQueryImageJSON,
              createdBy: req.user,
            };

            Photo.create(dataToUpload)
              .then((photo) => {
                res.status(200).send(image_label);
              })
              .catch((err) => {
                console.log(err);
                res.status(500).send("some err occured at our end");
              });

          } else {

            const image_label = "Unknown";
            addPhotoToFolder(images, image_label, req, res);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("some err occured at our end");
      });

  } else {

    const image_label = "Group Photo";
    addPhotoToFolder(images, image_label, req, res);
  }
  
};

module.exports = {
  addPhoto,
  getAllPhotoByLabel,
  getPhotoLabels,
  deletePhoto,
};
