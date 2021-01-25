module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    'no-plusplus': 0,
    'no-template-curly-in-string': 0,
    'no-param-reassign': 0,
    'no-unused-expressions': 0,
    'no-unused-vars': 0
  }
};
