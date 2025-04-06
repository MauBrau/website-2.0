import Grid from "@mui/material/Grid";
import CatWindow from "../catwindow/CatWindow";
import "./Pages.css";
import { HomeText } from "../../interface/IText";
import Page, { Body, Title } from "./Page";

export default function Home() {
    const pageText: HomeText = require("../../data/text/home.json");

    return (
        <Page
            minWidth={900}
            desktopTopMarginAmount={200}
            mobileTopMarginAmount={100}
        >
            <Grid
                container
                spacing={2}
                sx={{
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Grid size={{ sm: 12, md: 6, lg: 5 }}>
                    <CatWindow />
                </Grid>
                <Grid size={{ sm: 12, md: 6, lg: 6 }} className="card">
                    <Title title={pageText.title} />
                    <Body text={pageText.body} />
                    <Body text={pageText.body2} />
                </Grid>
                <Grid size={{ sm: 12, md: 0, lg: 1 }}>
                    <div style={{ height: "65px" }} />
                </Grid>
            </Grid>
        </Page>
    );
}
