/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // Files to run before every test suite
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  testPathIgnorePatterns: ["<rootDir>/node_modules/"],

  transform: {
    "\\.[jt]sx?$": "babel-jest",
    // static assets become just their filename, emulating Vite
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/config/jestFileTransformer.js",
  },
};
