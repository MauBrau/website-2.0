import React from "react";
import { IconButton, SvgIconTypeMap } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import { ContactText } from "../../interface/IText";
import Page from "./Page";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SECONDARY_COLOUR } from "../helper/Style";

export default function Contact() {
    const pageText: ContactText = require("../../data/text/contact.json");

    type IconMap = {
        [key: string]: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    };

    const icons: IconMap = {
        Email: EmailIcon,
        LinkedIn: LinkedInIcon,
        GitHub: GitHubIcon,
    };
    return (
        <Page
            className="card"
            minWidth={600}
            desktopTopMarginAmount={125}
            mobileTopMarginAmount={125}
            title={pageText.title}
            body={pageText.body}
        >
            <div>
                {pageText.socials.map((social) => {
                    const component = icons[social.name];
                    return (
                        <IconButton
                            key={social.name}
                            color="primary"
                            aria-label={social.name}
                            href={social.link}
                            target="_blank"
                            sx={{
                                "&:hover": {
                                    color: SECONDARY_COLOUR,
                                }
                            }}
                        >
                            {React.createElement(component)}
                        </IconButton>
                    );
                })}
            </div>
        </Page>
    );
}
