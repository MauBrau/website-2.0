import {
    nameFont,
    stylizedTextFont,
    textFont,
    formalFont,
    TRANSPARENT,
    BACKGROUND_BROWN,
    PRIMARY_COLOUR,
    SECONDARY_COLOUR,
    theme,
} from './Style';

describe('Style constants', () => {
    it('should export all font names as non-empty strings', () => {
        expect(nameFont).toBeTruthy();
        expect(stylizedTextFont).toBeTruthy();
        expect(textFont).toBeTruthy();
        expect(formalFont).toBeTruthy();
    });

    it('should export valid hex colour constants', () => {
        const hexRegex = /^#[0-9a-fA-F]{6,8}$/;
        expect(TRANSPARENT).toMatch(hexRegex);
        expect(BACKGROUND_BROWN).toMatch(hexRegex);
        expect(PRIMARY_COLOUR).toMatch(hexRegex);
        expect(SECONDARY_COLOUR).toMatch(hexRegex);
    });

    it('TRANSPARENT should be fully transparent', () => {
        // 8-digit hex with 00 alpha
        expect(TRANSPARENT).toBe('#00000000');
    });
});

describe('MUI Theme', () => {
    it('should be defined', () => {
        expect(theme).toBeDefined();
    });

    it('should have a primary palette colour matching PRIMARY_COLOUR', () => {
        expect(theme.palette.primary.main).toBe(PRIMARY_COLOUR);
    });

    it('should have a secondary palette colour matching SECONDARY_COLOUR', () => {
        expect(theme.palette.secondary.main).toBe(SECONDARY_COLOUR);
    });
});
