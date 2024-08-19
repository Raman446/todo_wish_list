import { error } from "console";
import { Request, Response } from "express";
import Tasks from "../Models/Tasks";

export const addTodo = async (req: Request, res: Response) => {
    console.log("yyyy", req.body)
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

export const getAllTodo = async (req: Request, res: Response) =>{
    try {
        const getAllTodoTask = await Tasks.find();
        console.log("tttt", getAllTodoTask)

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
    console.log("iiiii", req.body)
    try {
        const getTodoTask = await Tasks.find({ userID: req.body.userid });
        console.log("ggggggg", getTodoTask)
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
    // console.log("iiiii", req.body)
    try {
        const getTodoTask = await Tasks.find({ userID: req.body.userid });
        // console.log("tttt", getTodoTask)
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

export const deleteTodo =async (req: Request, res:Response)=>{
    console.log("rrrrrr", req.body)
    try{
        const deleteTask =await Tasks.deleteOne({_id: req.body.taskID});
        if(deleteTask){
            return(
                res.send({
                    status: "delete_todo",
                })
            )
        }
    }catch(err){
        res.send({
            error: err
        })
    }
}


export const updateTodo = async (req: Request, res: Response)=>{
    console.log("bbbbb", req.body)
    try{
        const updateTodo =await Tasks.findOneAndUpdate({_id: req.body.task_id}, {$set: {status: req.body.destination}});
        console.log("nnnnn", updateTodo)
        if(updateTodo){
            return(
                res.send({
                    status: "status_changed",
                })
            )
        }
    }catch(err){
        res.send({
            error: err
        })
    }

}