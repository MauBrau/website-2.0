import React from "react";
import "./Header.css";
import {
    AppBar,
    Box,
    Toolbar,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Drawer,
    IconButton,
    CssBaseline,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import MenuIcon from '@mui/icons-material/Menu';

const pages = ["resume", "projects", "contact"];
const drawerWidth = 240;

function Header() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }} >
            <List>
                {pages.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton sx={{ textAlign: "center" }}>
                            <ListItemText primary={item} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                component="nav"
                position="static"
                color="transparent"
                elevation={0}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h4"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            mr: 2,
                            display: {  sm: "flex" },
                            fontFamily: "bagel fat one",
                            fontWeight: 400,
                            color: "primary.main",
                            textDecoration: "none",
                        }}
                    >
                        Maude Braunstein
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {pages.map((item) => (
                            <Button color="primary">{item}</Button>
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


