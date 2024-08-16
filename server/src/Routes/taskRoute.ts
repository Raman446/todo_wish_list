import { addTodo, deleteTodo, getTodo, updateTodo } from "../Controller/taskController";


export const AuthTask = require("express").Router();

AuthTask.post("/add-todo", addTodo);
AuthTask.post('/get-todo', getTodo);
AuthTask.delete('/delete-todo', deleteTodo);
AuthTask.post('/update-todo', updateTodo)