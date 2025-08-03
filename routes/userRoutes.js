import express from 'express';
import { login, logout, register, verification } from '../controller/userController.js';
import { userSchema, validateUser } from '../validators/userValidate.js';
import { hasToken } from '../middleWare/hasToken.js';

const route = express.Router();

route.post("/register",validateUser(userSchema),register);
route.post("/login",login);
route.post("/verify", verification);
route.post("/logout",hasToken,logout);


export default route;