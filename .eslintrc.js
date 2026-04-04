module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/typescript",
    "prettier",
  ],
  plugins: [
    "jest",
    "@typescript-eslint",
    "react",
    "@graphql-eslint",
    "simple-import-sort",
    "import",
  ],
  overrides: [
    {
      files: ["@app/e2e/cypress/**"],
      plugins: ["cypress"],
      env: {
        "cypress/globals": true,
      },
    },
    {
      files: ["@app/client/**", "@app/components/**"],
      extends: [
        "next", // which itself extends plugin:react-hooks/recommended
      ],
    },
    {
      // Extract and lint GraphQL from template literals in client code.
      // Server is excluded because it defines the schema, not operations.
      files: ["**/*.{ts,tsx,js,jsx}"],
      excludedFiles: ["@app/server/src/**"],
      processor: "@graphql-eslint/graphql",
    },
    {
      files: ["**/*.graphql"],
      parser: "@graphql-eslint/eslint-plugin",
      parserOptions: {
        schema: "./data/schema.graphql",
        operations: "./@app/**/*.graphql",
      },
      rules: {
        "@graphql-eslint/executable-definitions": "error",
        "@graphql-eslint/fields-on-correct-type": "error",
        "@graphql-eslint/fragments-on-composite-type": "error",
        "@graphql-eslint/known-argument-names": "error",
        "@graphql-eslint/known-directives": "error", // disabled by default in relay
        // "@graphql-eslint/known-fragment-names": "error", // disabled by default in all envs
        "@graphql-eslint/known-type-names": "error",
        "@graphql-eslint/lone-anonymous-operation": "error",
        "@graphql-eslint/no-anonymous-operations": "error",
        "@graphql-eslint/no-fragment-cycles": "error",
        "@graphql-eslint/no-undefined-variables": "error", // disabled by default in relay
        // "@graphql-eslint/no-unused-fragments": "error", // disabled by default in all envs
        // "@graphql-eslint/no-unused-variables": "error", // throws even when fragments use the variable
        "@graphql-eslint/one-field-subscriptions": "error",
        "@graphql-eslint/overlapping-fields-can-be-merged": "error",
        "@graphql-eslint/possible-fragment-spread": "error",
        "@graphql-eslint/provided-required-arguments": "error", // disabled by default in relay
        "@graphql-eslint/require-id-when-available": [
          "error",
          { fieldName: ["id", "nodeId"] },
        ],
        "@graphql-eslint/scalar-leafs": "error", // disabled by default in relay
        "@graphql-eslint/unique-argument-names": "error",
        "@graphql-eslint/unique-directive-names-per-location": "error",
        "@graphql-eslint/unique-fragment-name": "error",
        "@graphql-eslint/unique-input-field-names": "error",
        "@graphql-eslint/unique-operation-name": "error",
        "@graphql-eslint/unique-variable-names": "error",
        "@graphql-eslint/value-literals-of-correct-type": "error",
        "@graphql-eslint/variables-are-input-types": "error",
        // "@graphql-eslint/variables-default-value-allowed": "error",
        "@graphql-eslint/variables-in-allowed-position": "error",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
    next: {
      rootDir: "@app/client/",
    },
  },
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        args: "after-used",
        ignoreRestSiblings: true,
      },
    ],
    "no-unused-expressions": [
      "error",
      {
        allowTernary: true,
      },
    ],
    "no-console": 0,
    "no-confusing-arrow": 0,
    "no-else-return": 0,
    "no-return-assign": [2, "except-parens"],
    "no-underscore-dangle": 0,
    "jest/no-focused-tests": 2,
    "jest/no-identical-title": 2,
    camelcase: 0,
    "prefer-arrow-callback": [
      "error",
      {
        allowNamedFunctions: true,
      },
    ],
    "class-methods-use-this": 0,
    "no-restricted-syntax": 0,
    "no-param-reassign": [
      "error",
      {
        props: false,
      },
    ],
    "react/prop-types": 0,
    "react/no-multi-comp": 0,
    "react/jsx-filename-extension": 0,
    "react/no-unescaped-entities": 0,

    "import/no-extraneous-dependencies": 0,

    "react/destructuring-assignment": 0,

    "arrow-body-style": 0,
    "no-nested-ternary": 0,

    /*
     * simple-import-sort seems to be the most stable import sorting currently,
     * disable others
     */
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "sort-imports": "off",
    "import/order": "off",

    "import/no-deprecated": "warn",
    "import/no-duplicates": "error",
  },
};
