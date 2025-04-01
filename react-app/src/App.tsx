import "./App.css";
import React, { StrictMode, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { updateWindow } from "./redux/window/windowSlice";

import { ThemeProvider } from "@mui/material";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { theme } from "./components/helper/Style";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./components/pages/Home";
import Resume from "./components/pages/Resume";
import Projects from "./components/pages/Projects";
import Contact from "./components/pages/Contact";

export const App = () => {
    // const windowState = useAppSelector((state) => state.window);
    //const dispatch = useAppDispatch();

    // useEffect(() => {
    //     const resizeListener = () => {
    //         dispatch(
    //             updateWindow({
    //                 height: window.innerHeight + "px",
    //                 width: window.innerWidth + "px",
    //             })
    //         );
    //     };
    //     window.addEventListener("resize", resizeListener);
    //     resizeListener();

    //     return () => {
    //         window.removeEventListener("resize", resizeListener);
    //     };
    // });

    return (
        <StrictMode>
            <BrowserRouter>
                <div className="app">
                    <ThemeProvider theme={theme}>
                        <Header/>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/resume" element={<Resume />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="*" element={<div>Bad page</div>} />
                        </Routes>
                        <Footer/>
                    </ThemeProvider>
                </div>
            </BrowserRouter>
        </StrictMode>
        
    );
}
