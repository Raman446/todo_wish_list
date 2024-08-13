import React, { useState } from "react";

import { Typography, Box, AppBar, Toolbar, Button, Grid, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions, FormControl, TextField } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

export const Home: React.FC = () => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
                            Hi, Ramandeep Singh
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
                <DialogContent>
                    <FormControl sx={{
                        margin: '10px'
                    }}>
                        <TextField
                            required
                            type="text"
                            label='TODO Heading' sx={{
                                margin: '10px'
                            }}/>
                        <TextField
                            required
                            type="text"
                            label='TODO Detail' sx={{
                                margin: '10px'
                            }} />
                        <TextField
                            required
                            type="date" sx={{
                                margin: '10px'
                            }}
                             />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="success">
                        Add
                    </Button>
                    <Button onClick={handleClose} autoFocus color="error">
                        Close
                    </Button>
                </DialogActions>
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

                <Grid container spacing={3} sx={{
                    marginTop: '30px',
                }}>
                    <Grid item md={4} sx={{
                        // border: '1px solid rgb(213, 213, 213)',
                    }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Todo</Typography>
                        <Box sx={{
                            border: '1px solid rgb(213, 213, 213)',
                            maxWidth: '90%',
                            borderRadius: '10px',
                            marginBottom: "12px",
                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                        }}>
                            <Typography variant="body1" sx={{
                                border: '1px solid rgb(213, 213, 213)',
                                margin: '10px',
                                borderRadius: '20px',
                                display: "inline-block",
                                padding: '3px 6px',
                                backgroundColor: 'rgb(164, 243, 128)'
                            }}>Low</Typography>
                            <Typography variant="h6" sx={{
                                marginLeft: '10px',
                                textDecorationLine: "underline"
                            }}>Build a todo Site</Typography>
                            <Typography variant="body2" sx={{
                                marginLeft: '10px',
                                marginRight: '9px'
                            }}>make a responsive site with login and register API. Wr have to build a todo list in three catagery; todo, in progress, complete. Important Point to note that every thing must be responsive.</Typography>
                            <Typography variant="body1" sx={{
                                marginLeft: '10px',
                            }}>Completing Date of Todo: 14/08/2024</Typography>
                        </Box>

                        <Box sx={{
                            border: '1px solid rgb(213, 213, 213)',
                            maxWidth: '90%',
                            borderRadius: '10px',
                            marginBottom: "12px",
                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                        }}>
                            <Typography variant="body1" sx={{
                                border: '1px solid rgb(213, 213, 213)',
                                margin: '10px',
                                borderRadius: '20px',
                                display: "inline-block",
                                padding: '3px 6px',
                                backgroundColor: 'rgb(164, 243, 128)'
                            }}>Low</Typography>
                            <Typography variant="h6" sx={{
                                marginLeft: '10px',
                                textDecorationLine: "underline"
                            }}>Build a todo Site</Typography>
                            <Typography variant="body2" sx={{
                                marginLeft: '10px',
                                marginRight: '9px'
                            }}>make a responsive site with login and register API. Wr have to build a todo list in three catagery; todo, in progress, complete. Important Point to note that every thing must be responsive.</Typography>
                            <Typography variant="body1" sx={{
                                marginLeft: '10px',
                            }}>Completing Date of Todo: 14/08/2024</Typography>
                        </Box>


                    </Grid>
                    <Grid item md={4} sx={{
                        // border: '1px solid rgb(213, 213, 213)'
                    }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>In-progress</Typography>
                        <Box sx={{
                            border: '1px solid rgb(213, 213, 213)',
                            maxWidth: '90%',
                            borderRadius: '10px',
                            marginBottom: "12px",
                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                        }}>
                            <Typography variant="body1" sx={{
                                border: '1px solid rgb(213, 213, 213)',
                                margin: '10px',
                                borderRadius: '20px',
                                display: "inline-block",
                                padding: '3px 6px',
                                backgroundColor: 'rgb(164, 243, 128)'
                            }}>Low</Typography>
                            <Typography variant="h6" sx={{
                                marginLeft: '10px',
                                textDecorationLine: "underline"
                            }}>Build a todo Site</Typography>
                            <Typography variant="body2" sx={{
                                marginLeft: '10px',
                                marginRight: '9px'
                            }}>make a responsive site with login and register API. Wr have to build a todo list in three catagery; todo, in progress, complete. Important Point to note that every thing must be responsive.</Typography>
                            <Typography variant="body1" sx={{
                                marginLeft: '10px',
                            }}>Completing Date of Todo: 14/08/2024</Typography>
                        </Box>


                        <Box sx={{
                            border: '1px solid rgb(213, 213, 213)',
                            maxWidth: '90%',
                            borderRadius: '10px',
                            marginBottom: "12px",
                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                        }}>
                            <Typography variant="body1" sx={{
                                border: '1px solid rgb(213, 213, 213)',
                                margin: '10px',
                                borderRadius: '20px',
                                display: "inline-block",
                                padding: '3px 6px',
                                backgroundColor: 'rgb(164, 243, 128)'
                            }}>Low</Typography>
                            <Typography variant="h6" sx={{
                                marginLeft: '10px',
                                textDecorationLine: "underline"
                            }}>Build a todo Site</Typography>
                            <Typography variant="body2" sx={{
                                marginLeft: '10px',
                                marginRight: '9px'
                            }}>make a responsive site with login and register API. Wr have to build a todo list in three catagery; todo, in progress, complete. Important Point to note that every thing must be responsive.</Typography>
                            <Typography variant="body1" sx={{
                                marginLeft: '10px',
                            }}>Completing Date of Todo: 14/08/2024</Typography>
                        </Box>


                        <Box sx={{
                            border: '1px solid rgb(213, 213, 213)',
                            maxWidth: '90%',
                            borderRadius: '10px',
                            marginBottom: "12px",
                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                        }}>
                            <Typography variant="body1" sx={{
                                border: '1px solid rgb(213, 213, 213)',
                                margin: '10px',
                                borderRadius: '20px',
                                display: "inline-block",
                                padding: '3px 6px',
                                backgroundColor: 'rgb(164, 243, 128)'
                            }}>Low</Typography>
                            <Typography variant="h6" sx={{
                                marginLeft: '10px',
                                textDecorationLine: "underline"
                            }}>Build a todo Site</Typography>
                            <Typography variant="body2" sx={{
                                marginLeft: '10px',
                                marginRight: '9px'
                            }}>make a responsive site with login and register API. Wr have to build a todo list in three catagery; todo, in progress, complete. Important Point to note that every thing must be responsive.</Typography>
                            <Typography variant="body1" sx={{
                                marginLeft: '10px',
                            }}>Completing Date of Todo: 14/08/2024</Typography>
                        </Box>


                    </Grid>
                    <Grid item md={4} sx={{
                        // border: '1px solid rgb(213, 213, 213)'
                    }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Completed</Typography>
                        <Box sx={{
                            border: '1px solid rgb(213, 213, 213)',
                            maxWidth: '90%',
                            borderRadius: '10px',
                            marginBottom: "12px",
                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',

                        }}>
                            <Typography variant="body1" sx={{
                                border: '1px solid rgb(213, 213, 213)',
                                margin: '10px',
                                borderRadius: '20px',
                                display: "inline-block",
                                padding: '3px 6px',
                                backgroundColor: 'rgb(164, 243, 128)'
                            }}>Low</Typography>
                            <Typography variant="h6" sx={{
                                marginLeft: '10px',
                                textDecorationLine: "underline"
                            }}>Build a todo Site</Typography>
                            <Typography variant="body2" sx={{
                                marginLeft: '10px',
                                marginRight: '9px'
                            }}>make a responsive site with login and register API. Wr have to build a todo list in three catagery; todo, in progress, complete. Important Point to note that every thing must be responsive.</Typography>
                            <Typography variant="body1" sx={{
                                marginLeft: '10px',
                            }}>Completing Date of Todo: 14/08/2024</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

        </>
    )
}