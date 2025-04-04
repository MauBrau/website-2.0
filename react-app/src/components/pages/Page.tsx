import { Typography, useMediaQuery } from "@mui/material";
import { ResumeText } from "../../interface/IText";
import { PRIMARY_COLOUR, SECONDARY_COLOUR, stylizedTextFont, textFont } from "../helper/Style";
import { PropsWithChildren } from "react";
import "./Pages.css";

interface PageProps extends PropsWithChildren<{}>{
    className: string; // Classname for main div
    minWidth: number; // Value in pixels
    desktopTranslateAmount: number; // Value as percent (0-100)
    mobileTranslateAmount: number; // Value as percent (0-100)
    title?: string;
    body?: string;
}

export default function Page(props: PageProps) {
    const { className, minWidth, desktopTranslateAmount, mobileTranslateAmount, title, body, children } = props;
    const isDesktop = useMediaQuery(`(min-width:${minWidth}px)`);

    return ( 
        <div 
            className={className}
            style={{
                transform: `translate(0%, ${
                    isDesktop ? `${desktopTranslateAmount}%` : `${mobileTranslateAmount}%`
                })`
            }}
        >
            { title && <Title title={title}/> }
            { body && <Body text={body} /> }
            { children }
        </div>
    );
}

export function Title({ title }: { title: string }) {
    return (
        <div className="title">
            <Typography
                variant="h4"
                sx={{
                    flexGrow: 1,
                    mr: 2,
                    fontFamily: stylizedTextFont,
                    textAlign: "left",
                    color: "secondary.main",
                    textDecoration: "none",
                }}
            >
                {title}
            </Typography>
        </div>
    );
}

export function Body({ text }: { text: string }) {
    return (
        <div className="text">
            <Typography
                sx={{
                    flexGrow: 1,
                    mr: 2,
                    fontFamily: textFont,
                    textAlign: { xs: "center", sm: "left" },
                    color: "primary.main",
                    textDecoration: "none",
                }}
            >
                {text}
            </Typography>
        </div>
    );
}