const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    logIndex: Number,
    transactionIndex: Number,
    transactionHash: String,
    blockHash: String,
    blockNumber: Number,
    address: String,
    type: String,
    id: String,
    returnValues: Object,
    event: String,
    signature: String,
    raw: Object
  },
  { timestamps: true }
);
exports.EventModel = mongoose.model('Event', EventSchema);
