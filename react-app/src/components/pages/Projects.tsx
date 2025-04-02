import { store } from "../../redux/store";

export default function Projects() {
    const isDesktop = store.getState().window.isDesktop;
    return (
        <div className="projects"
            style={{
                transform: `translate(0%, ${
                    isDesktop ? "50%" : "25%"
                })`
            }}
        >
            Coming Soon!
        </div>
    );
}
