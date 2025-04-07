import { GeneralText } from "../../interface/IText";
import Page from "./Page";

export default function Error() {
    const pageText: GeneralText = require("../../data/text/general.json");
    return ( 
        <Page
            className="card"
            minWidth={600}
            desktopTopMarginAmount={125}
            mobileTopMarginAmount={125}
            title={pageText.error.title}
            body={pageText.error.body}
        >
        </Page>
    );
}