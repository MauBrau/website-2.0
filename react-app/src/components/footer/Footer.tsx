import "./Footer.css";
import { Typography, useMediaQuery } from "@mui/material";
import { GeneralText } from "../../interface/IText";
import { BACKGROUND_BROWN, formalFont, SECONDARY_COLOUR } from "../helper/Style";

function Footer() {
    const isDesktop = useMediaQuery('(min-width:600px)');
    const pageText: GeneralText = require("../../data/text/general.json");
    return (
        <div className="footer" style={{ 
            backgroundColor: BACKGROUND_BROWN,
            padding: `${isDesktop ? '10px 40px' : '5px'}`,
            display: `${isDesktop ? 'flex' : ''}`,
            justifyContent: `${isDesktop ? 'space-between' : ''}`
        }}>
            <div className={isDesktop ? 'copyright' : ''}>
                <Typography
                    fontSize={14}
                    sx={{
                        fontFamily: formalFont,
                        color: "primary.main",
                        textDecoration: "none",
                        textAlign: { xs: "center", sm: "left" }
                    }}
                >
                    {pageText.copyright}
                </Typography>
            </div>
            {isDesktop && <div className="footer-item">
                {<Typography
                    fontSize={14}
                    sx={{
                        fontFamily: formalFont,
                        color: "primary.main",
                        paddingRight: '5px',
                        textAlign: "left"
                    }}
                >
                    {"Contact— "}
                </Typography> }
                <Typography
                    component="a"
                    href={pageText.contact.link} 
                    target="_blank"
                    fontSize={14}
                    sx={{
                        fontFamily: formalFont,
                        color: "primary.main",
                        textDecoration: "none",
                        "&:hover": {
                            color: SECONDARY_COLOUR,
                        },
                    }}
                >
                    {pageText.contact.name}
                </Typography>
            </div>}
            {isDesktop && <div className="footer-item">
                <Typography
                    fontSize={14}
                    sx={{
                        fontFamily: formalFont,
                        color: "primary.main",
                        paddingRight: '5px',
                        textAlign: "left"
                    }}
                >
                    {"Socials— "}
                </Typography> 
                {
                    pageText.socials.map((social, index) => {
                        const isLast = index === pageText.socials.length-1;
                        return (
                            <Typography 
                                key={index}
                                component="a"
                                href={social.link} 
                                target="_blank"
                                fontSize={14}
                                sx={{
                                    fontFamily: formalFont,
                                    color: "primary.main",
                                    textDecoration: "none",
                                    "&:hover": {
                                        color: SECONDARY_COLOUR,
                                    },
                                }}
                            >
                                {isLast ? social.name : `${social.name}, `}
                            </Typography>
                        )
                    })
                }   
            </div>}      
        </div>
    )
}

export default Footer;