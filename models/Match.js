const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  players: [
    {
        profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
        score: { type: Number, required: false }
    }
  ],
  winners: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: false }
});

MatchSchema.methods.endMatch = async function (players, winnerId) {
  this.endTime = new Date();
  this.duration = Math.floor((this.endTime - this.startTime) / 60000);
  this.players = players;
  this.winners = winnerId;
  return this.save();
};

module.exports = mongoose.model("Match", MatchSchema);