export interface GeneralText {
    copyright: string;
    contact: Social; // reuse it
    socials: Social[];
}

export interface PageText {
    title: string;
    body: string;
}

export interface HomeText extends PageText {
    body2: string; // mostly a "I am looking for work or I am not" section
}

export interface ContactText extends PageText {
    socials: Social[];
}

interface Social {
    name: string;
    link: string;
}

export interface ProjectsText extends PageText {
    projects: Projects[];
}

interface Projects {
    title: string;
    description: string;
    dateRange: string;
    images: string[];
}

export interface ResumeText extends PageText {
    skillset: Skill[];
    workExperience: ResumeEntry[];
    education: ResumeEntry[];
}

interface ResumeEntry {
    titles: RoleTitle[];
    subtitle: string;
    accomplishments: string[];
}

interface RoleTitle {
    role: string;
    yearRange: string;
}

interface Skill {
    categoryName: string;
    skills: string[];
}