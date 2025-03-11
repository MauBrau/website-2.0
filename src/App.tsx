import "./App.css";
import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { updateWindow } from "./redux/window/windowSlice";

import { ThemeProvider } from "@mui/material";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { theme } from "./components/styling/Style";
import CatWindow from "./components/catwindow/CatWindow";

export const App = () => {
    const windowState = useAppSelector((state) => state.window);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const resizeListener = () => {
            dispatch(
                updateWindow({
                    height: window.innerHeight + "px",
                    width: window.innerWidth + "px",
                })
            );
        };
        window.addEventListener("resize", resizeListener);
        resizeListener();

        return () => {
            window.removeEventListener("resize", resizeListener);
        };
    });

    return (
        <div className="app">
            <ThemeProvider theme={theme}>
                <Header></Header>
                <div className="home">
                    <CatWindow />
                </div>
                <Footer></Footer>
            </ThemeProvider>
        </div>
    );
}
