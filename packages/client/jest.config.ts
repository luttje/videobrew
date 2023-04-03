export default {
  preset: "ts-jest",
  resolver: "ts-jest-resolver",

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    "!src/**/interfaces/*.ts",
  ],

  // The directory where Jest should output its coverage files
  // coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    // "json",
    "text",
    // "lcov",
    // "clover"
  ],

  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      lines: 90,
    },
  },

  // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
  modulePathIgnorePatterns: [
    "<rootDir>/dist/",
  ],

  // The test environment that will be used for testing
  testEnvironment: "jsdom",
};
