import React, { useState } from "react";
import { TextField, Box, Button, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import loginPic from '../images/4609476.jpg'
import { toast } from "react-toastify";
import { login } from "../store/slices/LoginSlice";
import { useDispatch } from "react-redux";

export const Login: React.FC = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const gotoRegister = () => {
        navigate(`/register`);
    }

    const loginHandler = (e: any) => {
        e.preventDefault();
        let data = {
            email: email,
            password: password
        }
        try {
            fetch("http://192.168.1.6:8000/user-login", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            }).then(async (res) => {
                let result = await res.json();
                if (result.status === "not_registered_email") {
                    toast.error("email is not registered");
                } else if (result.status === "invalid_password") {
                    toast.error("invalid password");
                }
                else if (result.status === "Login_successfully") {
                    dispatch(login(result.data));
                    toast.success("Login Successfully");
                    navigate(`/todo`);
                }
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }


    return (
        <>
            <Grid container spacing={5} sx={{
                textAlign: 'center',
                // margin: '2px'
            }}>


                <Grid item component='div' md={5}>
                    <Box sx={{
                        maxWidth: '100%',
                        margin: "0px"
                    }}>
                        <img src={loginPic} alt="img" />
                    </Box>
                </Grid>


                <Grid item md={7} component='div' sx={{
                    width: '100%',
                    marginTop: '50px',
                    textAlign: 'left',
                    paddingLeft: '6px'
                }}>
                    <Typography variant="h4" gutterBottom sx={{
                        textDecoration: 'underline',
                        marginBottom: '20px'
                    }}>Login for Build your TODO List
                    </Typography>

                    <form onSubmit={loginHandler}>

                        <TextField sx={{
                            width: '70%',
                            display: 'block',
                            marginBottom: '10px'
                        }}
                            fullWidth
                            required
                            onChange={(e: any) => setEmail(e.target.value)}
                            type="email"
                            label='Your email' />

                        <TextField sx={{
                            width: '70%',
                            display: 'block',
                            marginBottom: '10px'
                        }}
                            fullWidth
                            required
                            onChange={(e: any) => setPassword(e.target.value)}
                            type="password"
                            label='Password' />

                        <Button type="submit" variant="contained" size="large" sx={{
                            width: '70%',
                            display: 'block'
                        }}>Login</Button>
                    </form>
                    <Typography variant="body2" onClick={gotoRegister} gutterBottom sx={{
                        textAlign: 'center',
                        cursor: 'pointer'
                    }}>Become a Member, Register Now</Typography>

                </Grid>
            </Grid>
        </>
    )
}