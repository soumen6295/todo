import express from 'express';
import { login, register, verification } from '../controller/userController.js';

const route = express.Router();

route.post("/register",register);
route.post("/login",login);
route.post("/verify", verification);



export default route;