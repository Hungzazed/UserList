const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const cors = require('cors');

const app = express();
const port = 3000;

const MONGO_URI = 'mongodb://127.0.0.1:27017/users_db';
const PORT = 3000;

app.use(express.json());
app.use(cors());

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// find all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng', error: error.message });
  }
});

// create
app.post('/users', async (req, res) => {
  try {
    const userData = req.body.user;
    if (!userData.name || !userData.email) {
      return res.status(400).json({ message: 'Tên và Email là bắt buộc.' });
    }
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Lỗi server khi tạo người dùng', error: error.message });
  }
});

// update
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body.user;
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng với ID này.' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật người dùng', error: error.message });
  }
});

// delete
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng để xóa.' });
    }
    res.status(200).json({ message: 'Người dùng đã được xóa thành công.', user_id: deletedUser._id });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa người dùng', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:port`);
});