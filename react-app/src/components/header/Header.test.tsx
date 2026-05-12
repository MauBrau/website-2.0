import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import Header from './Header';
import { ThemeProvider } from '@mui/material';
import { theme } from '../helper/Style';
import { pages } from '../helper/Routes';

// Helper to render Header with required providers
const renderHeader = () => {
    return render(
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <Header />
            </ThemeProvider>
        </BrowserRouter>
    );
};

describe('Header', () => {
    it('renders the site name "Maude"', () => {
        renderHeader();
        expect(screen.getByText('John')).toBeInTheDocument();
    });

    it('renders navigation buttons for all pages (desktop view)', () => {
        // MUI hides the desktop nav at xs breakpoint, but buttons are still in the DOM
        renderHeader();
        pages.forEach(page => {
            const buttons = screen.getAllByText(new RegExp(`^${page.name}$`, 'i'));
            expect(buttons.length).toBeGreaterThan(0);
        });
    });

    it('renders a hamburger menu button for mobile', () => {
        renderHeader();
        const menuButton = screen.getByLabelText('open drawer');
        expect(menuButton).toBeInTheDocument();
    });

    it('can navigate to home page through site name', () => {
        renderHeader();
        const nameLink = screen.getByText('Maude');
        expect(nameLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('can navigate to each enabled page through nav buttons', () => {
        renderHeader();
        pages.filter(p => !p.disabled).forEach(page => {
            // MUI Tooltip can override the accessible name, so we query by href
            const allLinks = screen.getAllByRole('link');
            const matchingLink = allLinks.find(link => link.getAttribute('href') === page.link);
            expect(matchingLink).toBeDefined();
        });
    });
});
