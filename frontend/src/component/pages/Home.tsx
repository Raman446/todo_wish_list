import React, { useCallback, useEffect, useState } from "react";

import { Typography, Box, AppBar, Toolbar, Button, Grid, Dialog, DialogContent, DialogTitle, FormControl, TextField, InputLabel, Select, MenuItem, SelectChangeEvent, DialogActions, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
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
import { FloatingWhatsApp } from 'react-floating-whatsapp';
import MenuIcon from '@mui/icons-material/Menu';

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

    const { register, formState: { errors }, reset, handleSubmit } = useForm<taskData>(
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
            user_id: data.UserId,
            heading: data.taskHeading,
            detail: data.taskDetail,
            date: data.endingDate,
            status: "todo"
        }
        try {
            fetch("http://192.168.1.133:8000/todo/add-todo", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataa)
            }).then(async (res) => {
                let result = await res.json();



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
        let data = {
            taskID: id,
        }
        try {
            fetch("http://192.168.1.133:8000/todo/delete-todo", {
                method: "DELETE", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            }).then(async (res) => {
                let result = await res.json();


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
            fetch("http://192.168.1.133:8000/todo/update-status-todo", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            }).then(async (res) => {
                let result = await res.json();

                if (result.status === "status_changed") {
                    toast.info("Status of Task changed Successfully");
                    if (user.type !== 'admin') {
                        getTodo();
                    } else {
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
            return newValue;
        });
        if (newValue === "all") {
            getAllTodo();
        } else {
            let data = {
                userid: newValue
            }
            try {
                fetch("http://192.168.1.133:8000/todo/get-todo-selected", {
                    method: "POST", // or 'PUT'
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                }).then(async (res) => {
                    let result = await res.json();

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

    const getTodo = useCallback(() => {
        let data = {
            userid: user._id
        }
        try {
            fetch("http://192.168.1.133:8000/todo/get-todo", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            }).then(async (res) => {
                let result = await res.json();

                if (result.status === "no_task") {
                    toast.info("Curruntly no task added");
                } else if (result.status === "get_todo") {
                    setTaskList(result.data)
                }
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }, [user._id]);


    const getAllTodo = () => {
        try {
            fetch("http://192.168.1.133:8000/todo/get-all-todo", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(async (res) => {
                let result = await res.json();

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


    useEffect(() => {
        if (user.type === 'admin') {
            getAllTodo();
            getAlluser();
        } else {
            getTodo();
            getAlluser();
        }
    }, [user.type, getTodo]);

    const getAlluser = () => {
        try {
            fetch("http://192.168.1.133:8000/get-all-user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(async (res) => {
                let result = await res.json();

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
        setTaskIId(todo._id)
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
            fetch("http://192.168.1.133:8000/todo/update-todo", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataa)
            }).then(async (res) => {
                let result = await res.json();

                if (result.status === "successfully_update_todo") {
                    toast.success("Successfully update todo task");
                    reset();
                    setOpen(false);
                    setUpdateTask(false);
                    if (user.type === 'admin') {
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
    }



    const handleClose1 = () => {
        setOpen1(false);
    };



    const [assgintaskId, setAssgintaskId] = useState('');
    const { register: register1, reset: reset1, handleSubmit: handleSubmit1 } = useForm<taskAssignData>(
        {
            defaultValues: {
                UserId: ""
            }
        }
    )

    const handleAssign = (id: string) => {
        setAssgintaskId(id)
        setOpen1(true)
    }

    const handleUpdateAssign: SubmitHandler<taskAssignData> = (data) => {
        handleClose1();
        let dataa = {
            taskID: assgintaskId,
            userid: data.UserId
        }
        try {
            fetch("http://192.168.1.133:8000/todo/update-assign-todo", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataa)
            }).then(async (res) => {
                let result = await res.json();

                if (result.status === "assigned") {
                    toast.info("Task assign to new user Successfully");
                    reset1();
                    getAllTodo();
                    setSelectedvalue("");
                }
            });

        } catch (err) {
            console.error(err)
        }
    }

    const validateDate = (value: string) => {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today || "Date must be today or in the future";
    };


    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open: any) => (event: any) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const drawerContent = (
        <List>
            <ListItem>
                <ListItemText primary={`Hi, ${user.userName}`} />
            </ListItem>
            {user.type !== 'user' && (
                <ListItem button onClick={handleClickOpen}>
                    <PlaylistAddIcon sx={{ marginRight: '5px' }} />
                    <ListItemText primary="Add TODO" />
                </ListItem>
            )}
            <ListItem button onClick={handleLogout}>
                <LogoutIcon sx={{ marginRight: '5px' }} />
                <ListItemText primary="LogOut" />
            </ListItem>
        </List>
    );

    return (
        <>
            <div>
                {user.type === "user" && (
                    <FloatingWhatsApp
                        phoneNumber='+91 9914176950'
                        accountName="Ramandeep Singh"
                        avatar="https://via.placeholder.com/150"
                        darkMode={false}
                        chatMessage='Hello, how can we help you?'
                        placeholder="Type a message..."
                        statusMessage="Replies within a few minutes"
                        allowClickAway={true}
                        allowEsc={true}
                        styles={{
                            zIndex: 1000,
                        }}
                    />
                )}

                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="fixed" sx={{ backgroundColor: '#066166 !important' }}>
                        <Toolbar>
                            <Typography
                                variant="h5"
                                noWrap
                                component="div"
                                sx={{
                                    flexGrow: 1,
                                    fontWeight: 'bolder',
                                    display: { xs: 'block', sm: 'block' },
                                }}
                            >
                                TODO Wish List
                            </Typography>
                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexGrow: 1, justifyContent: 'flex-end' }}>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                    sx={{
                                        textAlign: 'right',
                                        marginRight: '15px',
                                    }}
                                >
                                    Hi, {user.userName}
                                </Typography>
                                {user.type !== 'user' && (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleClickOpen}
                                        sx={{
                                            marginLeft: '15px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <PlaylistAddIcon sx={{ marginRight: '5px' }} />
                                        Add TODO
                                    </Button>
                                )}
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleLogout}
                                    sx={{
                                        marginLeft: '15px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <LogoutIcon sx={{ marginRight: '5px' }} />
                                    LogOut
                                </Button>
                            </Box>
                            <IconButton
                                edge="end"
                                color="inherit"
                                aria-label="menu"
                                sx={{ display: { xs: 'block', sm: 'none' } }}
                                onClick={toggleDrawer(true)}
                            >
                                <MenuIcon sx={{ fontSize: 30, paddingTop: "8px" }} />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                        {drawerContent}
                    </Drawer>
                </Box>
            </div>



            {/* Dialog for add the task */}
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle id="responsive-dialog-title" sx={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>
                    {updateTask ? "Update your TODO" : "Add your TODO"}
                </DialogTitle>
                <form onSubmit={updateTask ? handleSubmit(handleUpdateTodo) : handleSubmit(handleAddTodo)}>
                    <DialogContent>
                        <FormControl sx={{ width: "100%" }}>
                            <TextField
                                {...register("taskHeading", { required: "Heading is required" })}
                                fullWidth
                                type="text"
                                label="TODO Heading"
                                sx={{ margin: '10px 0 0' }}
                            />
                            {errors.taskHeading && (
                                <p style={{ color: "orangered" }}>{errors.taskHeading.message}</p>
                            )}
                            <TextField
                                {...register("taskDetail", { required: "Detail is required" })}
                                fullWidth
                                type="text"
                                label="TODO Detail"
                                sx={{ margin: '10px 0 0' }}
                            />
                            {errors.taskDetail && (
                                <p style={{ color: "orangered" }}>{errors.taskDetail.message}</p>
                            )}
                            <TextField
                                {...register("endingDate", { required: "Date is required", validate: validateDate })}
                                fullWidth
                                type="date"
                                sx={{ margin: '10px 0 0' }}
                            />
                            {errors.endingDate && (
                                <p style={{ color: "orangered" }}>{errors.endingDate.message}</p>
                            )}
                            <FormControl fullWidth sx={{ margin: '10px 0 0' }}>
                                <InputLabel id="dropdown-label">Assign to user</InputLabel>
                                <Select
                                    labelId="dropdown-label"
                                    {...register("UserId", { required: "Assigning to someone is required" })}
                                    label="Assign to user"
                                >
                                    {userList.map((option) => (
                                        <MenuItem key={option._id} value={option._id}>
                                            {option.userName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.UserId && (
                                    <p style={{ color: "red" }}>{errors.UserId.message}</p>
                                )}
                            </FormControl>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" autoFocus color="success">
                            {updateTask ? "UPDATE" : "ADD"}
                        </Button>
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
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle id="responsive-dialog-title" sx={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>
                    Assign the task to New user
                </DialogTitle>
                <form onSubmit={handleSubmit1(handleUpdateAssign)}>
                    <DialogContent>
                        <FormControl fullWidth sx={{
                            width: "100% "
                        }}>
                            <InputLabel id="dropdown-label">Assign to user</InputLabel>
                            <Select
                                labelId="dropdown-label"
                                {...register1("UserId", {
                                    required: "Assigning to someone is required"
                                })}
                                label="Assign to user"
                            >
                                {userList.map((option) => (
                                    <MenuItem key={option._id} value={option._id}>
                                        {option.userName}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.UserId && (
                                <p style={{ color: "red" }}>{errors.UserId.message}</p>
                            )}
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
                maxWidth: '90%',
                margin: 'auto',
            }}>
                {user.type === "admin" ?
                    <>
                        <Typography variant="h4" gutterBottom sx={{
                            fontWeight: 'bold'
                        }}>
                            TODO wish list....
                        </Typography>
                        <FormControl sx={{ margin: '10px', width: '100%' }}>
                            <InputLabel id="dropdown-label">Filter the To-Do according to users</InputLabel>
                            <Select
                                labelId="dropdown-label"
                                value={selectedValue}
                                onChange={handleChange}
                                label="Filter the To-Do according to users"
                                sx={{
                                    width: {
                                        xs: "90%",
                                        sm: "75%",
                                        md: "50%",
                                        lg: "30%",
                                        xl: "20%",
                                    }
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
                        </FormControl>
                    </>
                    : <Typography variant="h4" gutterBottom sx={{
                        fontWeight: 'bold'
                    }}>
                        Yours TODO wish list....
                    </Typography>}




                <DragDropContext onDragEnd={onDragEnd}>
                    <Grid container spacing={2} sx={{
                        marginTop: '30px',
                        display: 'flex'
                    }}>

                        <Droppable droppableId='todo' type="group">
                            {(provided) => {
                                return (
                                    <Grid
                                        xs={12} sm={12} md={6} lg={6} xl={4}
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        item >
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Todo</Typography>

                                        {taskList?.map((task, index) => {
                                            if (String(task.status) === 'todo')
                                                return (
                                                    <Draggable key={task._id} draggableId={task._id.toString()} index={index}>
                                                        {(provided) => (

                                                            <Box
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                ref={provided.innerRef}
                                                                sx={{
                                                                    border: '1px solid rgb(213, 213, 213)',
                                                                    maxWidth: '99%',
                                                                    margin: "auto",
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
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Typography
                                                                        variant="body1"
                                                                        sx={{
                                                                            margin: '10px',
                                                                            borderRadius: '10px',
                                                                            display: 'flex',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            backgroundColor: 'rgb(239, 63, 50)',
                                                                            cursor: 'pointer',
                                                                            height: '40px',
                                                                            width: '40px',
                                                                            textAlign: 'center',
                                                                        }}
                                                                        onClick={() => handleDeletetask(task._id)}
                                                                    >
                                                                        <DeleteIcon sx={{ color: 'rgb(255, 255, 255)' }} />
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="body1"
                                                                        sx={{
                                                                            border: '1px solid rgb(213, 213, 213)',
                                                                            margin: '10px',
                                                                            borderRadius: '10px',
                                                                            display: 'flex',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            // padding: '4px 6px',
                                                                            backgroundColor: '#066166',
                                                                            cursor: 'pointer',
                                                                            height: '40px',
                                                                            width: '40px',
                                                                            textAlign: 'center',
                                                                        }}
                                                                        onClick={() => handleEdittask(task)}
                                                                    >
                                                                        <EditIcon sx={{ color: 'rgb(255, 255, 255)' }} />
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="body1"
                                                                        sx={{
                                                                            border: '1px solid rgb(213, 213, 213)',
                                                                            margin: '10px 10px 10px 0px',
                                                                            borderRadius: '10px',
                                                                            height: '40px',
                                                                            display: 'flex',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            padding: '4px 6px',
                                                                            backgroundColor: 'rgb(32, 67, 55)',
                                                                            cursor: 'pointer',
                                                                            color: 'rgb(255, 255, 255)',
                                                                            marginLeft: "auto"
                                                                        }}
                                                                        onClick={() => handleAssign(task._id)}
                                                                    >
                                                                        <AssignmentIndIcon sx={{ color: 'rgb(255, 255, 255)' }} />
                                                                        {userList.map((user) => {
                                                                            if (user._id === task.userID) {
                                                                                return (
                                                                                    <React.Fragment key={user._id}>
                                                                                        {user.userName}
                                                                                    </React.Fragment>
                                                                                );
                                                                            }
                                                                            return null;
                                                                        })}
                                                                    </Typography>
                                                                </div>
                                                            </Box>
                                                        )}

                                                    </Draggable>
                                                )
                                            return null;
                                        })}
                                        {provided.placeholder}
                                    </Grid>
                                )
                            }}

                        </Droppable>

                        <Droppable droppableId='in_progress' type="group">
                            {(provided) => (
                                <Grid
                                    xs={12} sm={12} md={6} lg={6} xl={4}
                                    ref={provided.innerRef} {...provided.droppableProps} item sx={{
                                        //  backgroundColor: "rgb(185, 242, 142)"
                                        // border: '1px solid rgb(213, 213, 213)'
                                    }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>In-progress</Typography>


                                    {taskList?.map((task, index) => {
                                        if (String(task.status) === "in_progress")
                                            return (
                                                <Draggable draggableId={task._id} index={index}>
                                                    {(provided) => (
                                                        <Box
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            ref={provided.innerRef}
                                                            sx={{
                                                                border: '1px solid rgb(213, 213, 213)',
                                                                maxWidth: '99%',
                                                                margin: "auto",
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
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <Typography
                                                                    variant="body1"
                                                                    sx={{
                                                                        margin: '10px',
                                                                        borderRadius: '10px',
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        backgroundColor: 'rgb(239, 63, 50)',
                                                                        cursor: 'pointer',
                                                                        height: '40px',
                                                                        width: '40px',
                                                                        textAlign: 'center',
                                                                    }}
                                                                    onClick={() => handleDeletetask(task._id)}
                                                                >
                                                                    <DeleteIcon sx={{ color: 'rgb(255, 255, 255)' }} />
                                                                </Typography>
                                                                <Typography
                                                                    variant="body1"
                                                                    sx={{
                                                                        border: '1px solid rgb(213, 213, 213)',
                                                                        margin: '10px',
                                                                        borderRadius: '10px',
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        // padding: '4px 6px',
                                                                        backgroundColor: '#066166',
                                                                        cursor: 'pointer',
                                                                        height: '40px',
                                                                        width: '40px',
                                                                        textAlign: 'center',
                                                                    }}
                                                                    onClick={() => handleEdittask(task)}
                                                                >
                                                                    <EditIcon sx={{ color: 'rgb(255, 255, 255)' }} />
                                                                </Typography>
                                                                <Typography
                                                                    variant="body1"
                                                                    sx={{
                                                                        border: '1px solid rgb(213, 213, 213)',
                                                                        margin: '10px 10px 10px 0px',
                                                                        borderRadius: '10px',
                                                                        height: '40px',
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        padding: '4px 6px',
                                                                        backgroundColor: 'rgb(32, 67, 55)',
                                                                        cursor: 'pointer',
                                                                        color: 'rgb(255, 255, 255)',
                                                                        marginLeft: "auto"
                                                                    }}
                                                                    onClick={() => handleAssign(task._id)}
                                                                >
                                                                    <AssignmentIndIcon sx={{ color: 'rgb(255, 255, 255)' }} />
                                                                    {userList.map((user) => {
                                                                        if (user._id === task.userID) {
                                                                            return (
                                                                                <React.Fragment key={user._id}>
                                                                                    {user.userName}
                                                                                </React.Fragment>
                                                                            );
                                                                        }
                                                                        return null;
                                                                    })}
                                                                </Typography>
                                                            </div>
                                                        </Box>
                                                    )}

                                                </Draggable>
                                            )
                                        return null;
                                    })}
                                    {provided.placeholder}

                                </Grid>
                            )}

                        </Droppable>


                        <Droppable droppableId="completed" type="group">
                            {(provided) => (
                                <Grid
                                    xs={12} sm={12} md={6} lg={6} xl={4}
                                    ref={provided.innerRef} {...provided.droppableProps} item>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Completed</Typography>


                                    {taskList?.map((task, index) => {
                                        if (String(task.status) === "completed")
                                            return (
                                                <Draggable draggableId={task._id} index={index}>
                                                    {(provided) => (
                                                        <Box
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            ref={provided.innerRef}
                                                            sx={{
                                                                border: '1px solid rgb(213, 213, 213)',
                                                                maxWidth: '99%',
                                                                margin: "auto",
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
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <Typography
                                                                    variant="body1"
                                                                    sx={{
                                                                        margin: '10px',
                                                                        borderRadius: '10px',
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        backgroundColor: 'rgb(239, 63, 50)',
                                                                        cursor: 'pointer',
                                                                        height: '40px',
                                                                        width: '40px',
                                                                        textAlign: 'center',
                                                                    }}
                                                                    onClick={() => handleDeletetask(task._id)}
                                                                >
                                                                    <DeleteIcon sx={{ color: 'rgb(255, 255, 255)' }} />
                                                                </Typography>
                                                                <Typography
                                                                    variant="body1"
                                                                    sx={{
                                                                        border: '1px solid rgb(213, 213, 213)',
                                                                        margin: '10px',
                                                                        borderRadius: '10px',
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        // padding: '4px 6px',
                                                                        backgroundColor: '#066166',
                                                                        cursor: 'pointer',
                                                                        height: '40px',
                                                                        width: '40px',
                                                                        textAlign: 'center',
                                                                    }}
                                                                    onClick={() => handleEdittask(task)}
                                                                >
                                                                    <EditIcon sx={{ color: 'rgb(255, 255, 255)' }} />
                                                                </Typography>
                                                                <Typography
                                                                    variant="body1"
                                                                    sx={{
                                                                        border: '1px solid rgb(213, 213, 213)',
                                                                        margin: '10px 10px 10px 0px',
                                                                        borderRadius: '10px',
                                                                        height: '40px',
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        padding: '4px 6px',
                                                                        backgroundColor: 'rgb(32, 67, 55)',
                                                                        cursor: 'pointer',
                                                                        color: 'rgb(255, 255, 255)',
                                                                        marginLeft: "auto"
                                                                    }}
                                                                    onClick={() => handleAssign(task._id)}
                                                                >
                                                                    <AssignmentIndIcon sx={{ color: 'rgb(255, 255, 255)' }} />
                                                                    {userList.map((user) => {
                                                                        if (user._id === task.userID) {
                                                                            return (
                                                                                <React.Fragment key={user._id}>
                                                                                    {user.userName}
                                                                                </React.Fragment>
                                                                            );
                                                                        }
                                                                        return null;
                                                                    })}
                                                                </Typography>
                                                            </div>
                                                        </Box>
                                                    )}
                                                </Draggable>
                                            )
                                        return null;
                                    })}

                                    {provided.placeholder}
                                </Grid>
                            )}

                        </Droppable>

                    </Grid>
                </DragDropContext>
            </Box >

        </>
    )
}