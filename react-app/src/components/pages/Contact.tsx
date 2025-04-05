import React, { Component } from "react";
import { IconButton, SvgIconTypeMap, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import { ContactText, ResumeText } from "../../interface/IText";
import { PRIMARY_COLOUR, SECONDARY_COLOUR, stylizedTextFont, textFont } from "../helper/Style";
import Page from "./Page";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export default function Contact() {
    const pageText: ContactText = require("../../data/text/contact.json");

    type IconMap = {
        [key: string]: OverridableComponent<SvgIconTypeMap<{}, "svg">>
    };

    const icons : IconMap = {
        "Email": EmailIcon,
        "LinkedIn": LinkedInIcon,
        "GitHub": GitHubIcon
    };
    return (
        <Page
            className="contact"
            minWidth={600}
            desktopTranslateAmount={30}
            mobileTranslateAmount={25}
            title={pageText.title}
            body={pageText.body}
        >
            {
                pageText.socials.map(social => {
                    const component = icons[social.name];
                    return <IconButton
                        key={social.name}
                        color="primary"
                        aria-label={social.name}
                        href={social.link}
                        target="_blank"
                    >
                        {React.createElement(component)}
                    </IconButton>
                })
            }
        </Page>
    );
}