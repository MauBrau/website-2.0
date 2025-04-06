import { Navigation } from "../../interface/INavigation";

export const pages : Navigation[] = [
    { name : 'home', link: '/', disabled: false },
    { name : 'resume', link: '/resume', disabled: false },
    { name : 'projects', link: '/projects', disabled: true, message: "Coming Soon!" },
    { name : 'contact', link: '/contact', disabled: false },
]