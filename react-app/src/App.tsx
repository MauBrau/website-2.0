import "./App.css";
import { ThemeProvider } from "@mui/material";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { theme } from "./components/helper/Style";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./components/pages/Home";
import Resume from "./components/pages/Resume";
import Projects from "./components/pages/Projects";
import Contact from "./components/pages/Contact";
import Error from "./components/pages/Error";

export const App = () => {
    return (
            <BrowserRouter>
                <div className="app">
                    <ThemeProvider theme={theme}>
                        <Header />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/resume" element={<Resume />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="*" element={<Error />} />
                        </Routes>
                        <Footer />
                    </ThemeProvider>
                </div>
            </BrowserRouter>
    );
    
};
