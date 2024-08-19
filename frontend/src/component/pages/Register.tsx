import React, { useState } from "react";
import { Grid, Box, Typography, Stack, TextField, Button, FormControl } from "@mui/material";

import loginPic from '../images/4609476.jpg'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export const Register: React.FC = () => {

    const [name, setName] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');


    const navigate = useNavigate();
    const gotoLogin = () => {
        navigate(`/`);
    }


    const registerUser = (e:any) => {
        e.preventDefault();
        let data = {
            name: name,
            email: mail,
            password: password,
            type: "user"
        }
        try {
            const response =  fetch("http://localhost:8000/user-register", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            }).then(async (res) => {
                let result = await res.json();

                console.log("ress", result)

                if (result.status === "successfully_registered") {
                    toast.success("Successfully Registered");
                    navigate('/');
                }
                else if (result.status === "already_exist") {
                    toast.error("Email already exist");
                }
            });
        } catch (error) {
            console.error("Error:", error);
        }
    
    }
    return (
        <>
            <Grid container spacing={0} sx={{
                textAlign: 'center',
                // margin: '2px'
            }}>


                <Grid item md={5}>
                    <Box sx={{
                        maxWidth: '100%',
                        margin: "0px"
                    }}>
                        <img src={loginPic} />
                    </Box>
                </Grid>


                <Grid item md={7} sx={{
                    width: '100%',
                    marginTop: '50px',
                    textAlign: 'left',
                    paddingLeft: '6px'
                }}>
                    <Typography variant="h4" gutterBottom sx={{
                        textDecoration: 'underline',
                        marginBottom: '20px'
                    }}>Welcome,<br></br> Become a Member for Build your TODO List
                    </Typography>

                    <form onSubmit={registerUser}>

                        <TextField sx={{
                            width: '70%',
                            display: 'block',
                            marginBottom: '10px'
                            }}
                            fullWidth
                            onChange={(e:any)=> setName(e.target.value)}
                            required
                            label='Your Name' />

                        <TextField sx={{
                            width: '70%',
                            display: 'block',
                            marginBottom: '10px'
                            }}
                            fullWidth
                            required
                            onChange={(e: any) => setMail(e.target.value)}
                            value={mail}
                            type="email"
                            label='Your email' />

                        <TextField sx={{
                            width: '70%',
                            display: 'block',
                            marginBottom: '10px'
                            }}
                            fullWidth
                            onChange={(e: any) => setPassword(e.target.value)}
                            value={password}
                            required
                            type="password"
                            label='Password' />

                        <Button type="submit" variant="contained" size="large" sx={{
                            width: '70%',
                            display: 'block'
                        }}>Register</Button>
                    </form>
                    <Typography variant="body2" onClick={gotoLogin} gutterBottom sx={{
                        textAlign: 'center',
                        cursor: 'pointer'
                    }}>Already Member, Login Now</Typography>

                </Grid>
            </Grid>
        </>
    )
}