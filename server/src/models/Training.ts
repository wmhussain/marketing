import mongoose from 'mongoose';

const trainingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  prerequisites: [{
    type: String
  }],
  objectives: [{
    type: String
  }],
  curriculum: [{
    type: String
  }],
  price: {
    type: Number,
    required: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer'
  },
  imageUrl: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Training', trainingSchema);
