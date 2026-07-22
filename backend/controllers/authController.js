import jwt from "jsonwebtoken";
import User from "../models/User.js";
// Signs a JWT containing the user's id.
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
const validateRegisterInput = ({ username, email, password }) => {
  const errors = {};
  if (!username || username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters";
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = "Please enter a valid email address";
  }
  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  return errors;
};
// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const errors = validateRegisterInput({ username, email, password });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.email === email
            ? "Email is already registered"
            : "Username is already taken",
      });
    }
    const user = await User.create({ username, email, password });

    return res.status(201).json({
      message: "Registration successful",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during registration", error: error.message });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user._id);
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        channels: user.channels,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during login", error: error.message });
  }
};
// GET /api/auth/me (protected)
export const getCurrentUser = async (req, res) => {
  return res.status(200).json({ user: req.user });
};
