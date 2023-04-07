module.exports = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  collectCoverageFrom: [
    "scripts/**/*.{js,mjs,cjs,jsx,ts,tsx}",
    "!scripts/**/tmp-tests/**",
  ],

  // The directory where Jest should output its coverage files
  // coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    // "json",
    // "json-summary",
    "text",
    "lcov",
    // "clover"
  ],

  // A list of paths to directories that Jest should use to search for files in
  roots: [
    "<rootDir>/scripts"
  ],
  
  // An array of file extensions your modules use
  moduleFileExtensions: [
    "js",
    "mjs",
    // "cjs",
    // "jsx",
    // "ts",
    // "tsx",
    // "json",
    // "node"
  ],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/?(*.)+(spec|test).(js|mjs|cjs|jsx|ts|tsx|json|node)",
  ],
  
  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.m?js$': 'babel-jest',
  },
};
