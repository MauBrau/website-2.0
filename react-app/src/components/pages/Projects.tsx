import { Typography, useMediaQuery } from "@mui/material";
import { ProjectsText } from "../../interface/IText";
import { stylizedTextFont, textFont } from "../helper/Style";

export default function Projects() {
    const isDesktop = useMediaQuery('(min-width:600px)');
    const pageText: ProjectsText = require("../../data/text/projects.json");
    return ( 
        <div 
            className="projects"
            style={{
                transform: `translate(0%, ${
                    isDesktop ? "30%" : "25%"
                })`
            }}
        >
            <div className="title">
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
                    {pageText.title}
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
            </div>
        </div>
    );
}