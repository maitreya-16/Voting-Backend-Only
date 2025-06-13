import express from 'express';
import User from '../models/user.js';
import { JwtAuthMiddleware, generateToken } from '../jwt.js';

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const newUser = new User(data);
    const response = await newUser.save();
    
    const payload = { id: response.id };
    const token = generateToken(payload);

    res.status(201).json({ response, token });
  } catch (err) {
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { addharCardNumber, password } = req.body;
    const user = await User.findOne({ addharCardNumber });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid Aadhaar Number or Password" });
    }

    const token = generateToken({ id: user.id });
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

router.get('/profile', JwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile", details: err.message });
  }
});

router.put('/profile/password', JwtAuthMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password successfully updated" });
  } catch (err) {
    res.status(500).json({ error: "Password update failed", details: err.message });
  }
});

export default router;
