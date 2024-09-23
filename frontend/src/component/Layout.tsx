import { Box } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

export const Layout: React.FC = () => {
    return (
        <>
            <Box sx={{ paddingTop: "90px" }}>
                <Outlet />
            </Box>
        </>
    )
}