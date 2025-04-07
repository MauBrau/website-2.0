import { Grid, Typography, useMediaQuery } from "@mui/material";
import { ResumeEntry, ResumeText, RoleTitle } from "../../interface/IText";
import {
    PRIMARY_COLOUR,
    SECONDARY_COLOUR,
    stylizedTextFont,
    textFont,
} from "../helper/Style";
import Page from "./Page";

export default function Resume() {
    const pageText: ResumeText = require("../../data/text/resume.json");
    const isDesktop = useMediaQuery("(min-width:600px)");
    return (
        <div>
            <Page
                className="card"
                minWidth={600}
                desktopTopMarginAmount={125}
                mobileTopMarginAmount={125}
                title={pageText.title}
                body={pageText.body}
            >
                <Grid
                    container
                    spacing={2}
                    sx={{
                        textAlign: "left",
                    }}
                >
                    <Grid size={{ xs: 12 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: stylizedTextFont,
                                color: "primary.main",
                            }}
                        >
                            Skills and Qualifications
                        </Typography>
                        {pageText.skillset.map((skillset) => (
                            <div
                                key={skillset.categoryName}
                                style={{ fontFamily: textFont }}
                            >
                                <span
                                    className="entry-header"
                                    style={{ color: SECONDARY_COLOUR }}
                                >
                                    {skillset.categoryName}
                                </span>
                                :{" "}
                                {skillset.skills.map((s, index) => {
                                    const isLast =
                                        index === skillset.skills.length - 1;
                                    return (
                                        <span
                                            key={index}
                                            style={{ color: PRIMARY_COLOUR }}
                                        >
                                            {isLast ? `${s}` : `${s}, `}
                                        </span>
                                    );
                                })}
                            </div>
                        ))}
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: stylizedTextFont,
                                color: "primary.main",
                            }}
                        >
                            Work Experience
                        </Typography>
                        {pageText.workExperience.map((experience) => (
                            <div key={experience.subtitle}>
                                <div style={{ fontFamily: textFont }}>
                                    {isDesktop
                                        ? desktopRoleEntry(experience)
                                        : mobileRoleEntry(experience)}
                                    <div style={{ color: PRIMARY_COLOUR }}>
                                        {experience.subtitle}
                                    </div>
                                    {experience.accomplishments.map(
                                        (accomplishment, index) => (
                                            <ul
                                                key={index}
                                                className="accomplishment"
                                                style={{
                                                    color: PRIMARY_COLOUR,
                                                }}
                                            >
                                                <li>{accomplishment}</li>
                                            </ul>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: stylizedTextFont,
                                color: "primary.main",
                            }}
                        >
                            Education
                        </Typography>
                        {pageText.education.map((experience) => (
                            <div key={experience.subtitle}>
                                <div style={{ fontFamily: textFont }}>
                                    {isDesktop
                                        ? desktopRoleEntry(experience)
                                        : mobileRoleEntry(experience)}
                                    <div style={{ color: PRIMARY_COLOUR }}>
                                        {experience.subtitle}
                                    </div>
                                    {experience.accomplishments.map(
                                        (accomplishment, index) => (
                                            <ul
                                                key={index}
                                                className="accomplishment"
                                                style={{
                                                    color: PRIMARY_COLOUR,
                                                }}
                                            >
                                                <li>{accomplishment}</li>
                                            </ul>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </Grid>
                </Grid>
            </Page>
            <Grid size={{ xs: 12 }}>
                <div style={{ height: "105px" }} />
            </Grid>
        </div>
    );

    function desktopRoleEntry(experience: ResumeEntry) {
        return experience.titles.map((title: RoleTitle) => (
            <div
                key={title.role}
                className="experience entry-header"
                style={{ color: SECONDARY_COLOUR }}
            >
                <span>{title.role}</span>
                <span style={{ textAlign: "right" }}>{title.yearRange}</span>
            </div>
        ));
    }

    function mobileRoleEntry(experience: ResumeEntry) {
        return experience.titles.map((title: RoleTitle) => (
            <div
                key={title.role}
                className="experience entry-header"
                style={{ color: SECONDARY_COLOUR }}
            >
                <span>
                    {title.role},{" "}
                    <span style={{ color: PRIMARY_COLOUR, fontWeight: 200 }}>
                        {title.yearRange}
                    </span>
                </span>
            </div>
        ));
    }
}
