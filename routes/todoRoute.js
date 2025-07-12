import express from 'express';
import { addTodo } from '../controller/todoController.js';
import { hasToken } from '../middleWare/hasToken.js';

const todoRoute = express.Router();

todoRoute.post("/create", hasToken, addTodo);

export default todoRoute;