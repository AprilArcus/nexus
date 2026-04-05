module.exports = (dir) => {
  const package = require(`${dir}/package.json`);

  return {
    testEnvironment: "node",
    transform: {
      "^.+\\.tsx?$": "babel-jest",
    },
    testMatch: ["<rootDir>/**/__tests__/**/*.test.[jt]s?(x)"],
    moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
    roots: [`<rootDir>`],

    rootDir: dir,
    displayName: package.name,
    // Prettier 3 removed sync APIs; Jest 29 uses them for inline snapshot
    // formatting. Disable Prettier formatting until Jest is upgraded.
    prettierPath: null,
  };
};
