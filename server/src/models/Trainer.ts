import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  education: [{
    type: String
  }],
  certifications: [{
    type: String
  }],
  achievements: [{
    type: String
  }],
  profileImage: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Trainer', trainerSchema);
