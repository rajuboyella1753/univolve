const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true }, // admin, owner, student, government
  subrole: { type: String },
  gender: { type: String, enum: ['male', 'female'], required: function() { return this.role === 'student'; } }, // ⭐ Add this line
  approved:{
    type:Boolean,
    default:false,
  },
  rejected: {
  type: Boolean,
  default: false,
},
 points: {
   type: Number, default: 0 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);