import { Typography } from "@mui/material";
import { ProjectsText } from "../../interface/IText";
import Page, { Body } from "./Page";
import { textFont } from "../helper/Style";

export default function Projects() {
    const pageText: ProjectsText = require("../../data/text/projects.json");
    return ( 
        <div>
            <Page
                className="card"
                minWidth={600}
                desktopTopMarginAmount={125}
                mobileTopMarginAmount={125}
                title={pageText.title}
                body={pageText.body}
            >
                <div>
                    <Body text={`On top of this, I just released an unofficial, in-development, re-creation of Habs Bingo! The page might take a few seconds to load on first visit (free hosting :) ), but feel free to play along during a game. You can find it below:`} />
                    <Typography
                        component="a"
                        href={"https://habs-bingo-dev-9861c9e4e14c.herokuapp.com/"} 
                        sx={{
                            flexGrow: 1,
                            mr: 2,
                            fontFamily: textFont,
                            textAlign: { xs: "center", sm: "left" },
                            color: "primary.main",
                        }}
                    >
                        Habs Bingo
                    </Typography>
                </div>
            </Page>
        </div>
    );
}