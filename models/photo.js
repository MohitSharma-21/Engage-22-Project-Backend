const { Schema, model } = require("mongoose");

const photoSchema = new Schema({
  image_label: {
    type: String,
  },

  images: [
    {
      type: String,
    },
  ],

  labeledFaceDescriptors: [],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Photo", photoSchema);
