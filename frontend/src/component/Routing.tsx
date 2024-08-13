import React from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";

export const Routing: React.FC =()=>{
    return(
        <Routes>
            <Route element={<Layout />}>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/todo" element={<Home />} />

            </Route>
        </Routes>
    )
}