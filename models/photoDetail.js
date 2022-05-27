const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const photoDetailSchema = new Schema({
  image_label: {
    type: String,
  },
  image: {
    type: String,
  },

  labeledFaceDescriptor: Object,

//   createdBy :{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
});

module.exports = model("PhotoDetail", photoDetailSchema);
