const mongoose = require("mongoose");

const { Schema } = mongoose;

const ResultSchema = new Schema(
  {
    numbers: {
      type: Object,
      required: true,
    },
    gameType: {
      type: String,
      required: true,
    },
    restrictTime: {
      type: Date,
      default: Date.now(),
    },
    endTime: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

ResultSchema.set("toJSON", {
  virtuals: true,
});

module.exports = Result = mongoose.model("result", ResultSchema);
