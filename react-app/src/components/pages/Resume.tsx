import { Typography, useMediaQuery } from "@mui/material";
import { ResumeText } from "../../interface/IText";
import { PRIMARY_COLOUR, SECONDARY_COLOUR, stylizedTextFont, textFont } from "../helper/Style";

export default function Resume() {
    const isDesktop = useMediaQuery('(min-width:600px)');
    const pageText: ResumeText = require("../../data/text/resume.json");

    return ( 
        <div 
            className="resume"
            style={{
                transform: `translate(0%, ${
                    isDesktop ? "30%" : "25%"
                })`
            }}
        >
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
                    {pageText.title}
                </Typography>
            </div>
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
                    {pageText.body}
                </Typography>
            </div>
            <div className="resume-body">
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: stylizedTextFont,
                        color: "primary.main",
                    }}
                >
                    Skills and Qualifications
                </Typography>
                {
                    pageText.skillset.map(skillset => 
                        <div key={skillset.categoryName} style={{ fontFamily: textFont}}>
                            <span className="entry-header" style={{ color: SECONDARY_COLOUR}}>
                                {skillset.categoryName}
                            </span>: {
                                skillset.skills.map((s, index) => 
                                    <span key={index} style={{ color: PRIMARY_COLOUR}}>
                                        {index === skillset.skills.length-1 ? `${s}` : `${s}, `}
                                    </span>
                                )
                            }
                        </div>
                    )
                }
                <hr style={{ borderColor: SECONDARY_COLOUR }}/>
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: stylizedTextFont,
                        color: "primary.main",
                    }}
                >
                    Work Experience
                </Typography>
                {
                    pageText.workExperience.map(experience => 
                        <div key={experience.subtitle}>
                            <div style={{ fontFamily: textFont}}>
                                {
                                    experience.titles.map(title => 
                                        <div key={title.role} className="experience entry-header" style={{ color: SECONDARY_COLOUR}}>
                                            <span >{title.role}</span><span style={{textAlign: "right"}}>{title.yearRange}</span>
                                        </div>
                                    )
                                }
                                <div style={{ color: PRIMARY_COLOUR}}>{experience.subtitle}</div>
                                {
                                    experience.accomplishments.map((accomplishment, index) => 
                                        <ul key={index} className='accomplishment' style={{ color: PRIMARY_COLOUR}}>
                                            <li>{accomplishment}</li>
                                        </ul>
                                    )
                                }
                            </div>
                            <br/>
                        </div>
                    )
                }
                <hr/>
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: stylizedTextFont,
                        color: "primary.main",
                    }}
                >
                    Education
                </Typography>
                {
                    pageText.education.map(experience => 
                        <div key={experience.subtitle}>
                            <div style={{ fontFamily: textFont}}>
                                {
                                    experience.titles.map(title => 
                                        <div key={title.role} className="experience entry-header" style={{ color: SECONDARY_COLOUR}}>
                                            <span >{title.role}</span><span style={{textAlign: "right"}}>{title.yearRange}</span>
                                        </div>
                                    )
                                }
                                <div style={{ color: PRIMARY_COLOUR}}>{experience.subtitle}</div>
                                {
                                    experience.accomplishments.map((accomplishment, index) => 
                                        <ul key={index} className='accomplishment' style={{ color: PRIMARY_COLOUR}}>
                                            <li>{accomplishment}</li>
                                        </ul>
                                    )
                                }
                            </div>
                            <br/>
                        </div>
                    )
                }
            </div>
        </div>
    );
}