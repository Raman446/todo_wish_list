import React, { useState } from "react";
import { Box, Typography, TextField, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { makeStyles } from "@mui/styles";


const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex !important',
        flexDirection: 'column',
        alignItems: 'center !important',
        justifyContent: 'center !important',
        minHeight: 'calc(100vh - 120px) !important',
    },
    Box: {
        display: "flex !important",
        flexDirection: "column",
        alignItems: "center !important",
        height: "100% !important",
        width: "100% !important",
        maxWidth: "410px !important"
    },
    WelcomeTypography: {
        fontSize: "45px !important",
        fontWeight: "700 !important",
        lineHeight: "45px !important",
        fontFamily: "catamaran !important",
        display: "inline-block !important",
    },
    slogoTypography: {
        fontSize: "20px !important",
        fontWeight: "400 !important",
        lineHeight: "32px !important",
        fontFamily: "catamaran !important",
        display: "inline-block !important",
    },
    loginButton: {
        mt: 3,
        width: "100% !important",
        borderRadius: "12px !important",
        padding: "16px 0px !important",
        backgroundColor: "#066166 !important",
        "&:hover": {
            backgroundColor: "#044b4a !important"
        }
    },
    navigateTypography: {
        fontSize: "16px !important",
        fontFamily: "400 !important",
        color: "grey !important"
    }
}))

export const Register: React.FC = () => {
    const styles = useStyles();
    const [name, setName] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');


    const navigate = useNavigate();
    const gotoLogin = () => {
        navigate(`/`);
    }


    const registerUser = (e: any) => {
        e.preventDefault();
        let data = {
            name: name,
            email: mail,
            password: password,
            type: "user"
        }
        try {
            fetch("http://192.168.1.6:8000/user-register", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            }).then(async (res) => {
                let result = await res.json();

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
            <Container component="main" maxWidth="xs" className={styles.container}>
                <Box className={styles.Box}>
                    <Typography className={styles.WelcomeTypography}>Welcome back</Typography>
                    <Typography className={styles.slogoTypography}>Kindly Register with mentioned Credentials</Typography>
                    <form onSubmit={registerUser} style={{
                        width: "100%",
                        textAlign: "center",
                        alignItems: "center",
                        margin: "5px",
                    }}>
                        <TextField sx={{
                            width: '100%',
                            display: 'block',
                            marginBottom: '10px'
                        }}
                            fullWidth
                            onChange={(e: any) => setName(e.target.value)}
                            required
                            label='Your Name' />

                        <TextField sx={{
                            width: '100%',
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
                            width: '100%',
                            display: 'block',
                            marginBottom: '10px'
                        }}
                            fullWidth
                            onChange={(e: any) => setPassword(e.target.value)}
                            value={password}
                            required
                            type="password"
                            label='Password' />

                        <Button type="submit" variant="contained" size="large" className={styles.loginButton}>Register</Button>
                    </form>
                    <Typography className={styles.navigateTypography} gutterBottom>Already a Member, <span onClick={gotoLogin} style={{ cursor: "pointer" }}>Login Now</span></Typography>
                </Box>
            </Container>
        </>
    )
}