import { getAllUser, LoginUser, RegisterUser } from "../Controller/loginController";


export const AuthUser = require("express").Router();

AuthUser.post('/user-register', RegisterUser);
AuthUser.post('/user-login', LoginUser);
AuthUser.get('/get-all-user', getAllUser);