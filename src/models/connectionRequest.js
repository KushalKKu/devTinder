const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:"User"
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:"User"
  },
  status: {
    type: String,
    enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
      message: "{VALUE} is not a valid status",
    },
    default: "pending",
    required: true,
  },
},{
    timestamps: true,
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });
connectionRequestSchema.index({ toUserId: 1, fromUserId: 1 }, { unique: true });

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId == connectionRequest.toUserId) {
        return new Error("You cannot send a connection request to yourself!");
    }
    next(); 
})

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
