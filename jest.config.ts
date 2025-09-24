module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/app"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testRegex: ".*\\.test\\.(ts|tsx)$",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/app/$1",
    "^src/(.*)$": "<rootDir>/src/$1",
  },
};
