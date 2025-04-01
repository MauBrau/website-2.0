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
} from "@mui/material";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { nameFont, stylizedTextFont } from "../helper/Style";
import { pages } from "../helper/Routes";

const drawerWidth = 240;

function Header() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
            <List>
                {pages.map((item) => (
                    <ListItem key={item.name} disablePadding>
                        <ListItemButton sx={{ textAlign: "center", color: "primary.main" }} href={item.link}>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            
        </Box>
    );

    
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                component="nav"
                position="fixed"
                color="transparent"
                elevation={0}
                sx={{ mt: 2 }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon color="primary"/>
                    </IconButton>
                    <Typography
                        variant="h3"
                        component='a'
                        aria-label="home page"
                        sx={{
                            flexGrow: 1,
                            mr: 2,
                            fontFamily: nameFont,
                            fontWeight: 500,
                            textAlign: { xs: "center", sm: "left" },
                            color: "primary.main",
                            "&::first-letter": {
                                fontSize: "4rem"
                            },
                            textDecoration: 'none'
                        }}
                        href={'/'}
                    >
                        Maude
                    </Typography>
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                        {pages.map((item) => (
                            <Button
                                key={item.name}
                                color="primary"
                                sx={{
                                    fontFamily: stylizedTextFont,
                                    textTransform: "lowercase",
                                    fontWeight: 400,
                                }}
                                href={item.link}
                            >
                                {item.name}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            backgroundColor: "#352e34",
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

export default Header;
