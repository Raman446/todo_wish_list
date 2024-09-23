import { Request, Response } from "express";
import Users from "../Models/Users";

export const RegisterUser = async (req: Request, res: Response) => {
    try {
        const checkMailExist = await Users.findOne({ userEmail: req.body.email });
        if (checkMailExist) {
            return (
                res.send({
                    status: "already_exist",
                })
            )
        } else {
            const createUser = new Users({
                userName: req.body.name,
                userEmail: req.body.email,
                password: req.body.password,
                type: req.body.type
            })
            createUser.save();
            return (
                res.send({
                    status: "successfully_registered",
                })
            )
        }
    } catch (err) {
        res.send({
            error: err
        })
    }
}

export const LoginUser = async (req: Request, res: Response) => {
    try {
        const checkEmailExist = await Users.findOne({ userEmail: req.body.email });
        if (checkEmailExist) {
            const checkPasswordExist = await Users.findOne({ password: req.body.password });
            if (checkPasswordExist) {
                return (
                    res.send({
                        status: "Login_successfully",
                        data: checkPasswordExist
                    })
                )
            } else {
                return (
                    res.send({
                        status: "invalid_password",
                    })
                )
            }
        } else {
            return (
                res.send({
                    status: "not_registered_email",
                })
            )
        }

    } catch (err) {
        console.error(err)
    }
}


export const getAllUser = async (req: Request, res: Response) => {
    try {
        const getAllusers = await Users.find();

        if (getAllusers.length === 0) {
            return (
                res.send({
                    status: "no_task"
                })
            )
        } else {
            return (
                res.send({
                    status: "get_todo",
                    data: getAllusers
                })
            )
        }
    } catch (err) {
        res.send({
            error: err,
        })
    }
}