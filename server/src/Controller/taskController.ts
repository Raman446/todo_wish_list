import { error } from "console";
import { Request, Response } from "express";
import Tasks from "../Models/Tasks";
import Users from "../Models/Users";

export const addTodo = async (req: Request, res: Response) => {
    try {
        const createTodo = await new Tasks({
            userID: req.body.user_id,
            todoHeading: req.body.heading,
            todoDetail: req.body.detail,
            endingdate: req.body.date,
            status: req.body.status
        })
        await createTodo.save();
        return (
            res.send({
                status: "successfully_add_todo",
            })
        )
    } catch (err) {
        res.send({
            error: err
        })
    }
}

export const getAllTodo = async (req: Request, res: Response) => {
    try {
        const getAllTodoTask = await Tasks.find();
        if (getAllTodoTask.length === 0) {
            return (
                res.send({
                    status: "no_task"
                })
            )
        } else {
            return (
                res.send({
                    status: "get_todo",
                    data: getAllTodoTask
                })
            )
        }
    } catch (err) {
        res.send({
            error: err,
        })
    }
}

export const getTodoSelected = async (req: Request, res: Response) => {
    try {
        const getTodoTask = await Tasks.find({ userID: req.body.userid });
        if (getTodoTask.length === 0) {
            return (
                res.send({
                    status: "no_task"
                })
            )
        } else {
            return (
                res.send({
                    status: "get_todo",
                    data: getTodoTask
                })
            )
        }

    } catch (err) {
        res.send({
            error: err,
        })
    }
}



export const getTodo = async (req: Request, res: Response) => {
    try {
        const getTodoTask = await Tasks.find({ userID: req.body.userid });
        if (getTodoTask.length === 0) {
            return (
                res.send({
                    status: "no_task"
                })
            )
        } else {
            return (
                res.send({
                    status: "get_todo",
                    data: getTodoTask
                })
            )
        }
    } catch (err) {
        res.send({
            error: err,
        })
    }
}

export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const deleteTask = await Tasks.deleteOne({ _id: req.body.taskID });
        if (deleteTask) {
            return (
                res.send({
                    status: "delete_todo",
                })
            )
        }
    } catch (err) {
        res.send({
            error: err
        })
    }
}


export const updateAssignTodo = async (req: Request, res: Response) => {
    try {
        const updateTodo = await Tasks.findOneAndUpdate({ _id: req.body.taskID }, { $set: { userID: req.body.userid } });
        if (updateTodo) {
            return (
                res.send({
                    status: "assigned",
                })
            )
        }
    } catch (err) {
        res.send({
            error: err
        })
    }
}


export const updateTodo = async (req: Request, res: Response) => {
    try {
        const updateTodo = await Tasks.findOneAndUpdate({ _id: req.body.taskid }, {
            $set: {
                userID: req.body.user_id,
                todoHeading: req.body.heading,
                todoDetail: req.body.detail,
                endingdate: req.body.date,
                status: req.body.status
            }
        })
        if (updateTodo) {
            return (
                res.send({
                    status: "successfully_update_todo",
                })
            )
        }
    } catch (err) {
        res.send({
            error: err
        })
    }
}


export const updateStatusTodo = async (req: Request, res: Response) => {
    try {
        const updateTodo = await Tasks.findOneAndUpdate({ _id: req.body.task_id }, { $set: { status: req.body.destination } });
        if (updateTodo) {
            return (
                res.send({
                    status: "status_changed",
                })
            )
        }
    } catch (err) {
        res.send({
            error: err
        })
    }

}