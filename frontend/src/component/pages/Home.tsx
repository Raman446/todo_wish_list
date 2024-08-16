import React, { useEffect, useState } from "react";

import { Typography, Box, AppBar, Toolbar, Button, Grid, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions, FormControl, TextField } from "@mui/material";
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { logout } from "../store/slices/LoginSlice";
import { useDispatch } from "react-redux";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";
// import Draggable from "react-draggable";
// import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
// import { Draggable, Droppable } from 'react-drag-and-drop';




interface taskData {
    taskHeading: string,
    taskDetail: string,
    endingDate: string
}

export const Home: React.FC = () => {

    const user: any = useSelector((state: RootState) => state.userSlice);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [taskList, setTaskList] = useState([{
        todoHeading: "",
        todoDetail: "",
        endingdate: "",
        status: "",
        _id: ""
    }]);
    console.log("jjjjj", taskList)
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate(`/`);
    }

    const { register, formState: { errors, isSubmitting }, control, reset, handleSubmit } = useForm<taskData>(
        {
            defaultValues: {
                taskHeading: "",
                taskDetail: "",
                endingDate: ""
            }
        }
    )

    const handleAddTodo: SubmitHandler<taskData> = (data) => {
        let dataa = {
            user_id: user._id,
            heading: data.taskHeading,
            detail: data.taskDetail,
            date: data.endingDate,
            status: "todo"
        }
        try {
            const response = fetch("http://localhost:8000/todo/add-todo", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataa)
            }).then(async (res) => {
                let result = await res.json();

                console.log("ress", result)

                if (result.status === "successfully_add_todo") {
                    toast.success("Successfully add todo task");
                    reset();
                    setOpen(false);
                }
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }


    const handleDeletetask = (id: string) => {
        console.log("click delete with id", id)
        let data = {
            taskID: id,
        }
        try {
            const response = fetch("http://localhost:8000/todo/delete-todo", {
                method: "DELETE", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            }).then(async (res) => {
                let result = await res.json();

                console.log("eeee", result)

                if (result.status === "delete_todo") {
                    toast.error("Task deleted succussfully");
                }
            });
        } catch (error) {
            console.error("Error:", error);
        }

    }

    const onDragEnd = (result: DropResult) => {
        console.log("resut: ", result)
        const { source, destination, draggableId } = result;
        if (!destination) {
            return;
          }
      
          if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
          ) {
            return;
          }





       
        let data = {
            destination: destination?.droppableId,
            task_id: draggableId
        }
        try {
            const response = fetch("http://localhost:8000/todo/update-todo", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            }).then(async (res) => {
                let result = await res.json();

                console.log("eeee", result.data)

                if (result.status === "status_changed") {
                    toast.info("Status of Task changed Successfully");
                }
            });

        } catch (err) {
            console.error("Error:", err);
        }

    }

    useEffect(() => {
        getTodo();
    }, [
        handleAddTodo, handleDeletetask, onDragEnd
    ]);

    const getTodo = () => {
        let data = {
            userid: user._id
        }
        try {
            const response = fetch("http://localhost:8000/todo/get-todo", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            }).then(async (res) => {
                let result = await res.json();

                console.log("eeee", result.data)

                if (result.status === "no_task") {
                    toast.info("Curruntly no task added");
                } else if (result.status === "get_todo") {
                    setTaskList(result.data)
                }
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }







    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography
                            variant="h5"
                            noWrap
                            component="div"
                            sx={{
                                flexGrow: 1,
                                display: { xs: 'none', sm: 'block' },
                                fontWeight: 'bolder'
                            }}
                        >
                            TODO Wish List
                        </Typography>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                flexGrow: 1,
                                display: { xs: 'none', sm: 'block' },
                                textAlign: 'right',
                                marginRight: '15px'
                            }}
                        >
                            Hi, {user.userName}
                        </Typography>
                        <Button variant="contained" color="success" onClick={handleClickOpen} sx={{
                            marginLeft: '15px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}><PlaylistAddIcon sx={{
                            margin: '5px'
                        }} />
                            Add TODO
                        </Button>

                        <Button variant="contained" color="error" onClick={handleLogout} sx={{
                            marginLeft: '15px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}><LogoutIcon sx={{
                            margin: '5px'
                        }} />
                            LogOut
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box>



            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    Add your TODO
                </DialogTitle>
                <form onSubmit={handleSubmit(handleAddTodo)}>
                    <DialogContent>
                        <FormControl sx={{
                            margin: '10px'
                        }}>
                            <TextField
                                required
                                {...register("taskHeading", {
                                    required: "Heading is required"
                                })}

                                type="text"
                                label='TODO Heading' sx={{
                                    margin: '10px'
                                }} />
                            {errors.taskHeading && (
                                <p style={{ color: "orangered" }}>{errors.taskHeading.message}</p>
                            )}
                            <TextField
                                required
                                {...register("taskDetail", {
                                    required: "Detail is required"
                                })}
                                type="text"
                                label='TODO Detail' sx={{
                                    margin: '10px'
                                }} />
                            {errors.taskDetail && (
                                <p style={{ color: "orangered" }}>{errors.taskDetail.message}</p>
                            )}
                            <TextField
                                required
                                {...register("endingDate", {
                                    required: "date is required"
                                })}
                                type="date" sx={{
                                    margin: '10px'
                                }}
                            />
                            {errors.endingDate && (
                                <p style={{ color: "orangered" }}>{errors.endingDate.message}</p>
                            )}
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" autoFocus color="success">
                            Add
                        </Button>
                        <Button onClick={handleClose} autoFocus color="error">
                            Close
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>



            <Box sx={{
                maxWidth: '80%',
                margin: 'auto',
                marginTop: '30px'
            }}>
                <Typography variant="h4" gutterBottom sx={{
                    fontWeight: 'bold'
                }}>
                    Yours TODO wish list....
                </Typography>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Grid container spacing={0} sx={{
                        marginTop: '30px',
                        display: 'flex'
                    }}>

                        <Droppable key={''} droppableId='todo' >
                            {(provided) => {
                                console.log('Droppable rendered with ID: todo');
                                return (
                                    <Grid
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        item md={4}>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Todo</Typography>

                                        {taskList?.map((task, index) => {
                                            if (task.status == 'todo')
                                                return (
                                                    <Draggable key={task._id} draggableId={task._id.toString()} index={index}>
                                                        {(provided) => (
                                                            <Box
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                ref={provided.innerRef}
                                                                sx={{
                                                                    border: '1px solid rgb(213, 213, 213)',
                                                                    maxWidth: '90%',
                                                                    borderRadius: '10px',
                                                                    marginBottom: "12px",
                                                                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                                                                }}>

                                                                <Typography variant="h6" sx={{
                                                                    marginLeft: '10px',
                                                                    textDecorationLine: "underline"
                                                                }}>{task.todoHeading}</Typography>
                                                                <Typography variant="body2" sx={{
                                                                    marginLeft: '10px',
                                                                    marginRight: '9px'
                                                                }}>{task.todoDetail}</Typography>
                                                                <Typography variant="body1" sx={{
                                                                    marginLeft: '10px',
                                                                }}>Completing Date of Todo: {task.endingdate}</Typography>
                                                                <Typography variant="body1" sx={{
                                                                    border: '1px solid rgb(213, 213, 213)',
                                                                    margin: '10px',
                                                                    borderRadius: '10px',
                                                                    display: "inline-block",
                                                                    padding: '4px 6px',
                                                                    backgroundColor: 'rgb(239, 63, 50)',
                                                                    textAlign: 'right',
                                                                    cursor: "pointer"
                                                                }} onClick={() => handleDeletetask(task._id)}><DeleteIcon sx={{ color: 'rgb(255, 255, 255)' }} /></Typography>
                                                            </Box>
                                                        )}

                                                    </Draggable>
                                                )
                                        })}
                                        {provided.placeholder}
                                    </Grid>
                                )
                            }}

                        </Droppable>

                        <Droppable key={''} droppableId='in_progress' >
                            {(provided) => (
                                <Grid ref={provided.innerRef} {...provided.droppableProps} item md={4} sx={{
                                    //  backgroundColor: "rgb(185, 242, 142)"
                                    // border: '1px solid rgb(213, 213, 213)'
                                }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>In-progress</Typography>


                                    {taskList?.map((task, index) => {
                                        if (task.status == "in_progress")
                                            return (
                                                <Draggable draggableId={task._id} index={index}>
                                                    {(provided) => (
                                                        <Box
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            ref={provided.innerRef}
                                                            sx={{
                                                                border: '1px solid rgb(213, 213, 213)',
                                                                maxWidth: '90%',
                                                                borderRadius: '10px',
                                                                marginBottom: "12px",
                                                                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                                                            }}>

                                                            <Typography variant="h6" sx={{
                                                                marginLeft: '10px',
                                                                textDecorationLine: "underline"
                                                            }}>{task.todoHeading}</Typography>
                                                            <Typography variant="body2" sx={{
                                                                marginLeft: '10px',
                                                                marginRight: '9px'
                                                            }}>{task.todoDetail}</Typography>
                                                            <Typography variant="body1" sx={{
                                                                marginLeft: '10px',
                                                            }}>Completing Date of Todo: {task.endingdate}</Typography>
                                                            <Typography variant="body1" sx={{
                                                                border: '1px solid rgb(213, 213, 213)',
                                                                margin: '10px',
                                                                borderRadius: '10px',
                                                                display: "inline-block",
                                                                padding: '4px 6px',
                                                                backgroundColor: 'rgb(239, 63, 50)',
                                                                textAlign: 'right',
                                                                cursor: "pointer"
                                                            }} onClick={() => handleDeletetask(task._id)}><DeleteIcon sx={{ color: 'rgb(255, 255, 255)' }} /></Typography>
                                                        </Box>
                                                    )}

                                                </Draggable>
                                            )
                                    })}
                                    {provided.placeholder}

                                </Grid>
                            )}

                        </Droppable>


                        <Droppable key={''} droppableId="completed" >
                            {(provided) => (
                                <Grid ref={provided.innerRef} {...provided.droppableProps} item md={4} sx={{
                                    // border: '1px solid rgb(213, 213, 213)'
                                }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Completed</Typography>


                                    {taskList?.map((task, index) => {
                                        if (task.status == "completed")
                                            return (
                                                <Draggable draggableId={task._id} index={index}>
                                                    {(provided) => (
                                                        <Box
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            ref={provided.innerRef}
                                                            sx={{
                                                                border: '1px solid rgb(213, 213, 213)',
                                                                maxWidth: '90%',
                                                                borderRadius: '10px',
                                                                marginBottom: "12px",
                                                                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                                                            }}>

                                                            <Typography variant="h6" sx={{
                                                                marginLeft: '10px',
                                                                textDecorationLine: "underline"
                                                            }}>{task.todoHeading}</Typography>
                                                            <Typography variant="body2" sx={{
                                                                marginLeft: '10px',
                                                                marginRight: '9px'
                                                            }}>{task.todoDetail}</Typography>
                                                            <Typography variant="body1" sx={{
                                                                marginLeft: '10px',
                                                            }}>Completing Date of Todo: {task.endingdate}</Typography>
                                                            <Typography variant="body1" sx={{
                                                                border: '1px solid rgb(213, 213, 213)',
                                                                margin: '10px',
                                                                borderRadius: '10px',
                                                                display: "inline-block",
                                                                padding: '4px 6px',
                                                                backgroundColor: 'rgb(239, 63, 50)',
                                                                textAlign: 'right',
                                                                cursor: "pointer"
                                                            }} onClick={() => handleDeletetask(task._id)}><DeleteIcon sx={{ color: 'rgb(255, 255, 255)' }} /></Typography>
                                                        </Box>
                                                    )}
                                                </Draggable>
                                            )
                                    })}

                                    {provided.placeholder}
                                </Grid>
                            )}

                        </Droppable>

                    </Grid>
                </DragDropContext>
            </Box>

        </>
    )
}