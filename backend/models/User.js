const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['student', 'department_admin', 'super_admin'],
    default: 'student',
    required: true,
  },
  department: { type: String, enum: ['cafeteria', 'library', 'it', 'academic', null], default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
