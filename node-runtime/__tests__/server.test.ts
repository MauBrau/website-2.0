describe('Backend test environment', () => {
    it('should run a basic test successfully', () => {
        expect(1 + 1).toBe(2);
    });

    it('should have access to Node.js APIs', () => {
        expect(typeof process.env).toBe('object');
    });
});

describe('Static file path regex (from index.ts middleware)', () => {
    // This regex is used in index.ts to decide whether to pass through or serve index.html
    const staticFileRegex = /(.ico|.js|.css|.jpg|.png|.map|\/api\/)$/i;

    it('should match .js files', () => {
        expect(staticFileRegex.test('/bundle.js')).toBe(true);
    });

    it('should match .css files', () => {
        expect(staticFileRegex.test('/styles.css')).toBe(true);
    });

    it('should match .ico files', () => {
        expect(staticFileRegex.test('/favicon.ico')).toBe(true);
    });

    it('should match .jpg files', () => {
        expect(staticFileRegex.test('/photo.jpg')).toBe(true);
    });

    it('should match .png files', () => {
        expect(staticFileRegex.test('/image.png')).toBe(true);
    });

    it('should match .map files', () => {
        expect(staticFileRegex.test('/bundle.js.map')).toBe(true);
    });

    it('should match /api/ routes', () => {
        expect(staticFileRegex.test('/api/')).toBe(true);
    });

    it('should NOT match regular page routes', () => {
        expect(staticFileRegex.test('/home')).toBe(false);
        expect(staticFileRegex.test('/resume')).toBe(false);
        expect(staticFileRegex.test('/contact')).toBe(false);
    });
});
