const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required:true,
      unique: true,
    },

    images_to_validate: [
      {
        type: String,
      },
    ],

    labeledFaceDescriptors: [
      {
        type: Object,
      },
    ],

    images_upload: [
      {
        image_name: String,
        images: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
