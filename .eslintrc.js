// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  ignorePatterns: ['/dist/*'],
  settings: {
    'import/resolver': {
      typescript: {
        // Attempt to explicitly point to the tsconfig file
        project: './tsconfig.json',
      },
    },
  },
};
