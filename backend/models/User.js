const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  company: {
    name: {
      type: String,
      required: true,
    },
  },
  address: {
    city: {
      type: String,
      required: true,
    },
  },
});

const User = mongoose.model('UserSchema', UserSchema);

module.exports = User;