const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memberSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: [true, "Event is required"]
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"]
  },
  location: {
    name: String,
    lat: Number,
    lon: Number
  },
  role: {
    type: String,
    enum: ["host", "guest"]
  },
  time: {
    type: String
  },
  statusKey: {
    type: Boolean
  },
  statusInvited: {
    type: String,
    enum: ["pending", "received", "refused", "canceled"]
  }
});

const Member = mongoose.model("Member", memberSchema);
module.exports = Member;
