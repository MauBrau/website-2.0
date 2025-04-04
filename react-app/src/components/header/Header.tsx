import React, { ElementType } from "react";
import "./Header.css";
import {
    AppBar,
    Box,
    Toolbar,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Drawer,
    IconButton,
    CssBaseline,
    useMediaQuery,
    Tooltip,
    Slide,
    useScrollTrigger,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import {
    BACKGROUND_BROWN,
    nameFont,
    SECONDARY_COLOUR,
    stylizedTextFont,
    TRANSPARENT,
} from "../helper/Style";
import { pages } from "../helper/Routes";

const drawerWidth = 240;

function Header() {
    const isDesktop = useMediaQuery("(min-width:600px)");
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
            <List>
                {pages.map((item) => (
                    <ListItem key={item.name} disablePadding>
                        <ListItemButton
                            sx={{ textAlign: "center", color: "primary.main" }}
                            href={item.disabled ? "" : item.link}
                        >
                            {item.disabled ? (
                                <ListItemText
                                    primary={`${item.name} - ${item.message}`}
                                />
                            ) : (
                                <ListItemText primary={item.name} />
                            )}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const color = isDesktop ? TRANSPARENT : BACKGROUND_BROWN;
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <HideOnScroll>
                <AppBar
                    component="nav"
                    position="fixed"
                    elevation={0}
                    sx={{
                        mt: 2,
                        backgroundColor: color,
                        marginTop: 0,
                        paddingTop: "16px",
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: "none" } }}
                        >
                            <MenuIcon color="primary" />
                        </IconButton>
                        <Typography
                            variant="h3"
                            component="a"
                            aria-label="home page"
                            sx={{
                                flexGrow: 1,
                                mr: 2,
                                fontFamily: nameFont,
                                fontWeight: 500,
                                textAlign: { xs: "center", sm: "left" },
                                color: "primary.main",
                                "&::first-letter": {
                                    fontSize: "4rem",
                                },
                                textDecoration: "none",
                            }}
                            href={"/"}
                        >
                            Maude
                        </Typography>
                        <Box sx={{ display: { xs: "none", sm: "block" } }}>
                            {pages.map((item) => (
                                <Tooltip title={item.message} key={item.name}>
                                    <Button
                                        color="primary"
                                        sx={{
                                            fontFamily: stylizedTextFont,
                                            textTransform: "lowercase",
                                            fontWeight: 400,
                                            "&:hover": {
                                                color: SECONDARY_COLOUR,
                                            },
                                        }}
                                        href={item.disabled ? "" : item.link}
                                    >
                                        {item.name}
                                    </Button>
                                </Tooltip>
                            ))}
                        </Box>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            <nav>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    color="secondary"
                    slotProps={{
                        root: {
                            keepMounted: true, // Better open performance on mobile.
                        },
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            backgroundColor: `${BACKGROUND_BROWN} !important`,
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </Box>
    );
}

interface Props {
    children: React.ReactElement<unknown>;
}
function HideOnScroll ({ children }: Props) {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children ?? <div />}
        </Slide>
    );
}
export default Header;
