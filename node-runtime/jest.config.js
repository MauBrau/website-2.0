/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
    collectCoverageFrom: [
        '**/*.ts',
        '!**/__tests__/**',
        '!**/node_modules/**',
        '!**/dist/**',
        '!**/webpack*.ts',
        '!**/jest.config.*',
    ],
};
