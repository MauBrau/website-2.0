import Grid from "@mui/material/Grid";
import CatWindow from "../catwindow/CatWindow";
import "./Pages.css";
import { HomeText } from "../../interface/IText";
import Page, { Body, Title } from "./Page";


export default function Home() {
    const pageText: HomeText = require("../../data/text/home.json");
    return (
        <Page
            className="home"
            minWidth={900}
            desktopTranslateAmount={50}
            mobileTranslateAmount={25}
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
                    <Title title={pageText.title}/>
                    <Body text={pageText.body} />
                    <Body text={pageText.body2} />
                </Grid>
            </Grid>
        </Page>
    );
}
