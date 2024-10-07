import React, { useState } from "react";
import { TextField, Box, Button, Typography, Container, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../store/slices/LoginSlice";
import { useDispatch } from "react-redux";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles({
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
})

export const Login: React.FC = () => {
    const styles = useStyles();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword((show) => !show);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const gotoRegister = () => {
        navigate(`/register`);
    };

    const loginHandler = (e: any) => {
        e.preventDefault();
        let data = {
            email: email,
            password: password
        }
        try {
            fetch("http://192.168.1.133:8000/user-login", {
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
                    navigate(`/todo`);
                    toast.success("Login Successfully");
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
                    <Typography className={styles.slogoTypography}>Kindly Login with your Credentials</Typography>
                    <form onSubmit={loginHandler} style={{
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
                            required
                            onChange={(e: any) => setEmail(e.target.value)}
                            type="email"
                            label='Your email' />

                        <TextField sx={{
                            width: '100%',
                            display: 'block',
                            marginBottom: '10px'
                        }}
                            fullWidth
                            required
                            onChange={(e: any) => setPassword(e.target.value)}
                            type={showPassword ? "text" : "password"}
                            label='Password'
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }} />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            className={styles.loginButton}
                        >
                            Login
                        </Button>
                    </form>
                    <Typography className={styles.navigateTypography} gutterBottom>Become a Member, <span onClick={gotoRegister} style={{ cursor: "pointer" }}>Register Now</span></Typography>
                </Box>
            </Container>
        </>
    )
}
