import "./App.css";
import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { updateWindow } from "./redux/window/windowSlice";

import { Grid2, IconButton, styled } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";

const SocialsButton = styled(IconButton)({
    color: '#C7E6FC'
}) as typeof IconButton;

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
        <div className="App">
            <Grid2 container spacing={0.5} height={ windowState.height }>
                <Grid2 size={12}>
                    <div className="banner">This site is currently under construction.</div>
                </Grid2>
                <Grid2 size={3}></Grid2>
                <Grid2 size={3}>
                    <div>
                        <div className="header">Keep in touch!</div>
                        <div>
                            <SocialsButton
                                color="primary"
                                aria-label="LinkedIn"
                                href="https://www.linkedin.com/in/maudebraunstein/"
                                target="_blank"
                            >
                                <LinkedInIcon />
                            </SocialsButton>
                            <SocialsButton
                                color="primary"
                                aria-label="GitHub"
                                href="https://github.com/MauBrau/"
                                target="_blank"
                            >
                                <GitHubIcon />
                            </SocialsButton>
                            <SocialsButton
                                color="primary"
                                aria-label="Email"
                                href="mailto:maude.braunstein@gmail.com"
                            >
                                <EmailIcon />
                            </SocialsButton>
                        </div>
                    </div>
                </Grid2>
                <Grid2 size={3}>
                    <img
                        className="image-colour"
                        src={require("./data/images/cat-silhouette-blue.png")}
                        alt="Cat's silhouette"
                    />
                </Grid2>
                <Grid2 size={3}></Grid2>
            </Grid2>
        </div>
    );
}
