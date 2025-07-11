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

//user login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email: email });
 
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      const passwordCheck = await bcrypt.compare(password, user.password);
      if (!passwordCheck) {
        return res.status(402).json({
          success: false,
          message: "Incorrect password",
        });
      } else if (passwordCheck && user.verified === true) {
        

        const accessToken = jwt.sign(
          {
            id: user._id,
          },
          process.env.secretKey,
          {
            expiresIn: "10days",
          }
        );

        const refreshToken = jwt.sign(
          {
            id: user._id,
          },
          process.env.secretKey,
          {
            expiresIn: "30days",
          }
        );

        user.isLoggedIn = true;
        await user.save();
        return res.status(200).json({
          success: true,
          message: "User Logged in Successfully",
          accessToken: accessToken,
          refreshToken: refreshToken,
          data: user,
        });
      } else {
        res.status(200).json({
          message: "Complete Email verification then Login..",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//mail verification
export const verification = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing or Invalid",
      });
    } else {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.secretKey, async (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(400).json({
              success: false,
              message: "The registration Token is Expired",
            });
          }
          return res.status(400).json({
            success: false,
            message: "Token verification failed, possibly expired",
          });
        } else {
          const { id } = decoded; //here id comes in the body
          const user = await userSchema.findById(id);
          if (!user) {
            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          } else {
            user.token = null;
            user.verified = true;
            await user.save();
            return res.status(200).json({
              success: true,
              message: "Email verified successfully",
            });
          }
        }
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Could not access",
    });
  }
};
