import { LoginUser, RegisterUser } from "../Controller/loginController";


export const AuthUser = require("express").Router();

AuthUser.post('/user-register', RegisterUser);
AuthUser.post('/user-login', LoginUser);