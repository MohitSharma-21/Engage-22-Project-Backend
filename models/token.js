const { Schema, model } = require("mongoose");

const tokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    token: String,
  },
  { timestamps: true }
);

module.exports = model("Token", tokenSchema);
