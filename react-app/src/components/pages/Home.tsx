import Grid from "@mui/material/Grid";
import CatWindow from "../catwindow/CatWindow";
import "./Pages.css";
import { Typography, useMediaQuery } from "@mui/material";
import { stylizedTextFont, textFont } from "../helper/Style";
import { HomeText } from "../../interface/IText";


export default function Home() {
    const isDesktop = useMediaQuery('(min-width:900px)');
    const pageText: HomeText = require("../../data/text/home.json");
    return (
        <div
            className="home"
            style={{
                transform: `translate(0%, ${
                    isDesktop ? "50%" : "25%"
                })`
            }}
        >
            <Grid
                container
                spacing={2}
                sx={{
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Grid size={{ sm: 12, md: 6 }}>
                    <CatWindow />
                </Grid>
                <Grid size={{ sm: 12, md: 6 }}>
                    <div className="subtitle">
                        <Typography
                            variant="h4"
                            sx={{
                                flexGrow: 1,
                                mr: 2,
                                fontFamily: stylizedTextFont,
                                textAlign: "left",
                                color: "secondary.main",
                                textDecoration: "none",
                            }}
                        >
                            {pageText.subtitle}
                        </Typography>
                    </div>
                    <div className="text">
                        <Typography
                            sx={{
                                flexGrow: 1,
                                mr: 2,
                                fontFamily: textFont,
                                textAlign: { xs: "center", sm: "left" },
                                color: "primary.main",
                                textDecoration: "none",
                            }}
                        >
                            {pageText.body}
                        </Typography>
                        <br/>
                        <Typography
                            sx={{
                                flexGrow: 1,
                                mr: 2,
                                fontFamily: textFont,
                                textAlign: { xs: "center", sm: "left" },
                                color: "primary.main",
                                textDecoration: "none",
                            }}
                        >
                            {pageText.body2}
                        </Typography>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}
