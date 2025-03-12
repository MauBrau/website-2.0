import "./Footer.css";
import { Grid2, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";

function Footer() {
    return (
        <div className="footer">
            {/* © 2025 Maude Braunstein  */}
            <IconButton
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
            </IconButton>
        </div>
    )
}

export default Footer;