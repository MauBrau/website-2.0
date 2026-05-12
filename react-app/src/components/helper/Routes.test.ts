import { pages } from './Routes';

describe('Routes', () => {
    it('should contain all expected page entries', () => {
        const pageNames = pages.map(p => p.name);
        expect(pageNames).toContain('home');
        expect(pageNames).toContain('resume');
        expect(pageNames).toContain('projects');
        expect(pageNames).toContain('contact');
    });

    it('should have valid link paths starting with /', () => {
        pages.forEach(page => {
            expect(page.link).toMatch(/^\//);
        });
    });

    it('should have home linking to /', () => {
        const home = pages.find(p => p.name === 'home');
        expect(home).toBeDefined();
        expect(home!.link).toBe('/');
    });

    it('should have disabled pages with a message', () => {
        pages.forEach(page => {
            if (page.disabled) {
                expect(page.message).toBeDefined();
                expect(page.message!.length).toBeGreaterThan(0);
            }
        });
    });

    it('should have unique page names', () => {
        const names = pages.map(p => p.name);
        const uniqueNames = new Set(names);
        expect(uniqueNames.size).toBe(names.length);
    });

    it('should have unique page links', () => {
        const links = pages.map(p => p.link);
        const uniqueLinks = new Set(links);
        expect(uniqueLinks.size).toBe(links.length);
    });
});
