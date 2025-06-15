import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  vision: {
    type: String,
    required: true
  },
  mission: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('About', aboutSchema);
