const mongoose = require("mongoose");

const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    gameType: {
      type: String,
      required: true,
    },
    betType: {
      type: String,
      required: true,
    },
    digitType: {
      type: String,
      required: true,
    },
    numbers: {
      type: String,
      required: true,
    },
    multiple: {
      type: Number,
      required: true,
    },
    processed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "pending",
    },
    betAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.set("toJSON", {
  virtuals: true,
});

module.exports = Order = mongoose.model("order", OrderSchema);
