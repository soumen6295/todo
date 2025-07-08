import userSchema from "../model/userSchema.js";
import dotenv from 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {verifyEmail} from '../emailVerify/verifyEmail.js';

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const existing = await userSchema.findOne({ email: email });
    if (existing) {
      return res.status(401).json({
        success: false,
        message: "User Already Exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userSchema.create({
      userName,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: user._id }, process.env.secretKey, {
      expiresIn: "5m",
    });
    verifyEmail(token, email);
    user.token = token;
    await user.save();
    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      data: { userName: userName },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};