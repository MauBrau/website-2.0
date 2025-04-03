import "./Footer.css";
import { IconButton, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import { GeneralText } from "../../interface/IText";
import { BACKGROUND_BROWN, textFont } from "../helper/Style";

function Footer() {
    const pageText: GeneralText = require("../../data/text/general.json");
    return (
        <div className="footer" style={{ backgroundColor: BACKGROUND_BROWN }}>
            <Typography
                sx={{
                    flexGrow: 1,
                    mr: 2,
                    fontFamily: textFont,
                    color: "primary.main",
                    textDecoration: "none",
                }}
            >
                {pageText.copyright}
            </Typography>
            {/* <IconButton
                color="primary"
                aria-label="LinkedIn"
                href="https://www.linkedin.com/in/maudebraunstein/"
                target="_blank"
            >
                <LinkedInIcon />
            </IconButton>
            <IconButton
                color="primary"
                aria-label="GitHub"
                href="https://github.com/MauBrau/"
                target="_blank"
            >
                <GitHubIcon />
            </IconButton>
            <IconButton
                color="primary"
                aria-label="Email"
                href="mailto:maude.braunstein@gmail.com"
            >
                <EmailIcon />
            </IconButton> */}
        </div>
    )
}

export default Footer;