import React, {useEffect, useState } from "react";

import { Typography, Box, AppBar, Toolbar, Button, Grid, Dialog, DialogContent, DialogTitle, FormControl, TextField, InputLabel, Select, MenuItem, SelectChangeEvent, DialogActions } from "@mui/material";
import { SubmitHandler, useForm } from 'react-hook-form'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { logout } from "../store/slices/LoginSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';





interface taskData {
    taskHeading: string,
    taskDetail: string,
    endingDate: string,
    UserId: string
}

interface taskAssignData {
    UserId: string
}






export const Home: React.FC = () => {

    const user: any = useSelector((state: RootState) => state.userSlice);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userList, setUsers] = useState([{
        userName: "",
        _id: ""
    }])
    console.log(userList)
    const [selectedValue, setSelectedvalue] = useState('');
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [updateTask, setUpdateTask] = useState(false);


    const [taskList, setTaskList] = useState([{
        todoHeading: "",
        todoDetail: "",
        endingdate: "",
        status: "",
        userID: "",
        _id: ""
    }]);

    const [edittaskList, setEditTaskList] = useState({
        todoHeading: "",
        todoDetail: "",
        endingdate: "",
        status: "",

        _id: ""
    });
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
                endingDate: "",
                UserId: ""
            }
        }
    )

    const handleAddTodo: SubmitHandler<taskData> = (data) => {
        let dataa = {
            user_id: data.UserId, //now here value come from form
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
                    getAllTodo();
                    setSelectedvalue("");
                }
            });
        } catch (error) {
            console.error("Error:", error);
        }
    };


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
                    if (user.type === "admin") {
                        getAllTodo();
                        setSelectedvalue("");
                    } else {
                        getTodo();
                    }
                }
            });
        } catch (error) {
            console.error("Error:", error);
        }

    };

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
            const response = fetch("http://localhost:8000/todo/update-status-todo", {
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
                    if(user.type !== 'admin'){
                    getTodo();
                    }else{
                        getAllTodo();
                        setSelectedvalue("")
                    }
                }
            });

        } catch (err) {
            console.error("Error:", err);
        }

    };


    const handleChange = (e: SelectChangeEvent) => {
        const newValue = e.target.value as string;
        setSelectedvalue((prevState) => {
            console.log('Previous State:', prevState);
            console.log('New Value:', newValue);
            return newValue;
        });
        if (newValue === "all") {
            getAllTodo();
        } else {
            console.log("wwwwwwwww", newValue)
            let data = {
                userid: newValue
            }
            try {
                const response = fetch("http://localhost:8000/todo/get-todo-selected", {
                    method: "POST", // or 'PUT'
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                }).then(async (res) => {
                    let result = await res.json();

                    console.log("eeee", result.data)

                    if (result.status === "no_task") {
                        toast.info("Curruntly no task Assigned");
                        getAllTodo();
                        setSelectedvalue("");
                    } else if (result.status === "get_todo") {
                        setTaskList(result.data)
                    }
                });
            } catch (error) {
                console.error("Error:", error);
            }
        }
    }

    useEffect(() => {
        if (user.type === 'admin') {
            getAllTodo();
            getAlluser();
        } else {
            getTodo();
            getAlluser();
        }
    }, [
        // handleAddTodo, handleDeletetask, onDragEnd
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


    const getAllTodo = () => {
        try {
            const response = fetch("http://localhost:8000/todo/get-all-todo", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
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


    const getAlluser = () => {
        try {
            const response = fetch("http://localhost:8000/get-all-user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(async (res) => {
                let result = await res.json();

                console.log("zzzzzz", result.data)

                if (result.status === "no_task") {
                    toast.info("Curruntly no task added");
                } else if (result.status === "get_todo") {
                    setUsers(result.data)
                }
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const [taskIId, setTaskIId] = useState('')

    const handleEdittask = (todo: any) => {
        setUpdateTask(true)
        console.log("gggggg", todo._id)
        setTaskIId(todo._id)
        const d = new Date(todo.endingDate)
        reset({
            taskHeading: todo.todoHeading,
            taskDetail: todo.todoDetail,
            endingDate: todo.endingDate
        })
        setOpen(true)
    }

    const handleUpdateTodo: SubmitHandler<taskData> = (data) => {
            let dataa = {
                user_id: data.UserId, //now here value come from form
                heading: data.taskHeading,
                detail: data.taskDetail,
                date: data.endingDate,
                status: "todo",
                taskid: taskIId
            }
            try {
                const response = fetch("http://localhost:8000/todo/update-todo", {
                    method: "POST", // or 'PUT'
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataa)
                }).then(async (res) => {
                    let result = await res.json();
    
                    console.log("ress", result)
    
                    if (result.status === "successfully_update_todo") {
                        toast.success("Successfully update todo task");
                        reset();
                        setOpen(false);
                        setUpdateTask(false);
                        if(user.type==='admin'){
                            getAllTodo();
                            setSelectedvalue("");
                        }else{
                            getTodo();
                        }
                    }
                });
            } catch (error) {
                console.error("Error:", error);
            }
    }












    const handleClose1 = () => {
        setOpen1(false);
    };

    const handleOpen1 = () => {
        setOpen1(true);
    };


    const [assgintaskId, setAssgintaskId] = useState('');
    const { register: register1, formState: { errors: error1 }, reset: reset1, handleSubmit: handleSubmit1 } = useForm<taskAssignData>(
        {
            defaultValues: {
                UserId: ""
            }
        }
    )

    const handleAssign = (id: string) => {
        console.log("hhhhhhh", id)
        setAssgintaskId(id)
        setOpen1(true)
    }

    const handleUpdateAssign: SubmitHandler<taskAssignData> = (data) => {
        console.log("ooooo", data)
        handleClose1();
        let dataa = {
            taskID: assgintaskId,
            userid: data.UserId
        }
        console.log("vvvvvv", dataa)
        try {
            const response = fetch("http://localhost:8000/todo/update-assign-todo", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataa)
            }).then(async (res) => {
                let result = await res.json();

                console.log("eeee", result.data)

                if (result.status === "assigned") {
                    toast.info("Task assign to new user Successfully");
                    reset1();
                    getAllTodo();
                    setSelectedvalue("");
                }
            });

        } catch (err) {
            console.log(err)
        }
    }





    return (
        <>


            {user.type === "user" ? <Box sx={{ flexGrow: 1 }}>

                <AppBar position="fixed">
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
                :

                <>
                    <Box sx={{ flexGrow: 1 }}>

                        <AppBar position="fixed">
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
                </>
            }



            {/* Dialog for add the task */}
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    Add your TODO
                </DialogTitle>
                <form onSubmit={updateTask ? handleSubmit(handleUpdateTodo) : handleSubmit(handleAddTodo)}>
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
                                // value={taskHeading}
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
                                // value={taskList?.todoDetail || ""}
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
                                type="date"
                                // value={taskList?.endingdate || ""}
                                sx={{
                                    margin: '10px'
                                }}
                            />
                            {errors.endingDate && (
                                <p style={{ color: "orangered" }}>{errors.endingDate.message}</p>
                            )}
                            <>
                                <label id="dropdown-label">Assign to user</label>
                                <select
                                    // value={taskList?._id || ""}
                                    {...register("UserId", {
                                        required: "assign to someone is requirded"
                                    })}
                                    style={{ margin: '10px', height: "50px" }}
                                >
                                    {userList.map((option) => (
                                        <option key={option._id} value={option._id}>
                                            {option.userName}
                                        </option>
                                    ))}
                                </select>
                            </>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        {updateTask ? <Button type="submit" autoFocus color="success">
                            UPDATE
                        </Button> : <Button type="submit" autoFocus color="success">
                            Add
                        </Button>}

                        <Button onClick={handleClose} autoFocus color="error">
                            Close
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>







            {/* Dialog for update the assign user */}
            <Dialog
                fullScreen={fullScreen}
                open={open1}
                onClose={handleClose1}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    Assign the task to New user
                </DialogTitle>
                <form onSubmit={handleSubmit1(handleUpdateAssign)}>
                    <DialogContent>
                        <FormControl sx={{
                            margin: '10px'
                        }}>
                            <>
                                <label id="dropdown-label">Assign to user</label>
                                <select
                                    // value={taskList?._id || ""}
                                    {...register1("UserId", {
                                        required: "assign to someone is requirded"
                                    })}
                                    style={{ margin: '10px', height: "50px" }}
                                >
                                    {userList.map((option) => (
                                        <option key={option._id} value={option._id}>
                                            {option.userName}
                                        </option>
                                    ))}
                                </select>
                            </>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" autoFocus color="success">
                            UPDATE
                        </Button>
                        <Button onClick={handleClose1} autoFocus color="error">
                            Close
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>



            <Box sx={{
                maxWidth: '80%',
                margin: 'auto',
                marginTop: '90px'
            }}>



                {user.type === "admin" ?
                    <>
                        <Typography variant="h4" gutterBottom sx={{
                            fontWeight: 'bold'
                        }}>
                            TODO wish list....
                        </Typography>
                        {/* <Typography variant="h3">filter here</Typography> */}
                        <InputLabel id="dropdown-label">Filter the To-Do according to users</InputLabel>
                        <Select
                            labelId="dropdown-label"
                            value={selectedValue}
                            onChange={handleChange}
                            label="Select an Option"
                            sx={{
                                width: "20%"
                            }}
                        >
                            <MenuItem key="all" value="all">
                                All
                            </MenuItem>
                            {userList.map((option) => (
                                <MenuItem key={option._id} value={option._id}>
                                    {option.userName}
                                </MenuItem>
                            ))}
                        </Select>
                    </>
                    : <Typography variant="h4" gutterBottom sx={{
                        fontWeight: 'bold'
                    }}>
                        Yours TODO wish list....
                    </Typography>}




                <DragDropContext onDragEnd={onDragEnd}>
                    <Grid container spacing={0} sx={{
                        marginTop: '30px',
                        display: 'flex'
                    }}>

                        <Droppable droppableId='todo' type="group">
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
                                                                <Typography variant="body1" sx={{
                                                                    border: '1px solid rgb(213, 213, 213)',
                                                                    margin: '10px',
                                                                    borderRadius: '10px',
                                                                    display: "inline-block",
                                                                    padding: '4px 6px',
                                                                    backgroundColor: 'rgb(156, 175, 150)',
                                                                    textAlign: 'right',
                                                                    cursor: "pointer"
                                                                }} onClick={() => handleEdittask(task)}><EditIcon sx={{ color: 'rgb(255, 255, 255)' }} /></Typography>
                                                                <Typography variant="body1" sx={{
                                                                    border: '1px solid rgb(213, 213, 213)',
                                                                    margin: '10px',
                                                                    borderRadius: '10px',
                                                                    display: "inline-block",
                                                                    padding: '4px 6px',
                                                                    backgroundColor: 'rgb(96, 210, 248)',
                                                                    float: "right",
                                                                    textAlign: 'right',
                                                                    cursor: "pointer",
                                                                    color: 'rgb(255,255,255)'
                                                                }} onClick={() => handleAssign(task._id)} ><AssignmentIndIcon sx={{ color: 'rgb(255, 255, 255)', paddingTop: '4px' }} />
                                                                    {userList.map((user) => {
                                                                        if (user._id === task.userID) {
                                                                            return (
                                                                                <>
                                                                                    {user.userName}
                                                                                </>
                                                                            )

                                                                        }
                                                                    })}
                                                                </Typography>
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

                        <Droppable droppableId='in_progress' type="group">
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
                                                            <Typography variant="body1" sx={{
                                                                border: '1px solid rgb(213, 213, 213)',
                                                                margin: '10px',
                                                                borderRadius: '10px',
                                                                display: "inline-block",
                                                                padding: '4px 6px',
                                                                backgroundColor: 'rgb(156, 175, 150)',
                                                                textAlign: 'right',
                                                                cursor: "pointer"
                                                            }} onClick={() => handleEdittask(task)}><EditIcon sx={{ color: 'rgb(255, 255, 255)' }} /></Typography>
                                                            <Typography variant="body1" sx={{
                                                                border: '1px solid rgb(213, 213, 213)',
                                                                margin: '10px',
                                                                borderRadius: '10px',
                                                                display: "inline-block",
                                                                padding: '4px 6px',
                                                                backgroundColor: 'rgb(96, 210, 248)',
                                                                float: "right",
                                                                textAlign: 'right',
                                                                cursor: "pointer",
                                                                color: 'rgb(255,255,255)'
                                                            }} onClick={() => handleAssign(task._id)} ><AssignmentIndIcon sx={{ color: 'rgb(255, 255, 255)', paddingTop: '4px' }} />
                                                                {userList.map((user) => {
                                                                    if (user._id === task.userID) {
                                                                        return (
                                                                            <>
                                                                                {user.userName}
                                                                            </>
                                                                        )

                                                                    }
                                                                })}
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                </Draggable>
                                            )
                                    })}
                                    {provided.placeholder}

                                </Grid>
                            )}

                        </Droppable>


                        <Droppable droppableId="completed" type="group">
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
                                                            <Typography variant="body1" sx={{
                                                                border: '1px solid rgb(213, 213, 213)',
                                                                margin: '10px',
                                                                borderRadius: '10px',
                                                                display: "inline-block",
                                                                padding: '4px 6px',
                                                                backgroundColor: 'rgb(156, 175, 150)',
                                                                textAlign: 'right',
                                                                cursor: "pointer"
                                                            }} onClick={() => handleEdittask(task)}><EditIcon sx={{ color: 'rgb(255, 255, 255)' }} /></Typography>
                                                            <Typography variant="body1" sx={{
                                                                border: '1px solid rgb(213, 213, 213)',
                                                                margin: '10px',
                                                                borderRadius: '10px',
                                                                display: "inline-block",
                                                                padding: '4px 6px',
                                                                backgroundColor: 'rgb(96, 210, 248)',
                                                                float: "right",
                                                                textAlign: 'right',
                                                                cursor: "pointer",
                                                                color: 'rgb(255,255,255)'
                                                            }} onClick={() => handleAssign(task._id)} ><AssignmentIndIcon sx={{ color: 'rgb(255, 255, 255)', paddingTop: '4px' }} />
                                                                {userList.map((user) => {
                                                                    if (user._id === task.userID) {
                                                                        return (
                                                                            <>
                                                                                {user.userName}
                                                                            </>
                                                                        )

                                                                    }
                                                                })}
                                                            </Typography>
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