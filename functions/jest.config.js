// jest.config.js
module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [
        '/node_modules/'
    ],
    testMatch: [
        '**/__tests__/**/*.test.js'
    ],
    setupFilesAfterEnv: [
        '<rootDir>/__tests__/setup.js'
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
    },
    // Prevent Jest from treating setup.js and helpers.js as test files
    testPathIgnorePatterns: [
        '<rootDir>/__tests__/setup.js',
        '<rootDir>/__tests__/helpers.js'
    ]
};