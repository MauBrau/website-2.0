import { ProjectsText } from "../../interface/IText";
import Page from "./Page";

export default function Projects() {
    const pageText: ProjectsText = require("../../data/text/projects.json");
    return ( 
        <Page
            className="card"
            minWidth={600}
            desktopTopMarginAmount={125}
            mobileTopMarginAmount={125}
            title={pageText.title}
            body={pageText.body}
        >
        </Page>
    );
}