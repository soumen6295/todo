import express from 'express';
import { login, register, verification } from '../controller/userController.js';
import { userSchema, validateUser } from '../validators/userValidate.js';

const route = express.Router();

route.post("/register",validateUser(userSchema),register);
route.post("/login",login);
route.post("/verify", verification);



export default route;