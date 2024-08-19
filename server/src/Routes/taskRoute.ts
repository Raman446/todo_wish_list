import { addTodo, deleteTodo, getAllTodo, getTodo, getTodoSelected, updateAssignTodo, updateStatusTodo, updateTodo } from "../Controller/taskController";

export const AuthTask = require("express").Router();

AuthTask.post("/add-todo", addTodo);
AuthTask.post('/get-todo', getTodo);
AuthTask.delete('/delete-todo', deleteTodo);
AuthTask.post('/update-status-todo', updateStatusTodo);
AuthTask.get('/get-all-todo', getAllTodo);
AuthTask.post('/get-todo-selected', getTodoSelected);
AuthTask.post('/update-assign-todo', updateAssignTodo);
AuthTask.post('/update-todo',updateTodo)