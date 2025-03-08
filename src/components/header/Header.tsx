import "./Header.css";
import Typography from "@mui/material/Typography";


function Header() {
    return (
        <header id="Navigation" className="">
            <div className="header">
                <div className="name">
                    <Typography
                        variant="h6"
                        component="a"
                        sx={{
                            mr: 2,
                            display: { md: "flex" }, // xs: "none",
                            fontFamily: "bagel fat one",
                            fontWeight: 700,
                            color: "primary",
                            textDecoration: "none",
                        }}
                    >
                        Maude Braunstein
                    </Typography>
                </div>
                <nav className="pages">
                    <a className="item">home</a>
                    <a className="item">resume</a>
                    <a className="item">contact</a>
                </nav>
            </div>
        </header>
        
    );
}

export default Header;
