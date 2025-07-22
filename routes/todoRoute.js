import express from 'express';
import { addTodo, deleteTodo, getByIdTodo, getTodo, updateByIdTodo } from '../controller/todoController.js';
import { hasToken } from '../middleWare/hasToken.js';
import { validateTodo } from '../validators/todoValidate.js';
import { userSchema } from '../validators/userValidate.js';

const todoRoute = express.Router();

todoRoute.post("/create", hasToken,validateTodo(userSchema), addTodo);
todoRoute.get("/getAll",hasToken, getTodo);
todoRoute.get("/getId/:id", hasToken, getByIdTodo);
todoRoute.put("/update/:id", hasToken, updateByIdTodo);
todoRoute.delete("/delete/:id",hasToken,deleteTodo);

export default todoRoute;