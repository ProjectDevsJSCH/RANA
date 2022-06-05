const rules = {
  semi: [2, 'always'],
  'import/extensions': [
    2,
    {
      ignorePackages: true,
      pattern: {
        vue: 'always',
      },
    },
  ],
  /* Disabled */
  'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  'class-methods-use-this': ['warn'],
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/member-delimiter-style': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  'import/prefer-default-export': 'off',
  'no-useless-constructor': 'off',
  'lines-between-class-members': 'off',
  'no-implicit-any': 'off',
  'no-param-reassign': 'off',
  'linebreak-style': 'off',
  'max-len': 'off',
  'ban-ts-ignore': 'off',
  'global-require': 'off',
  indent: 'off',
  '@typescript-eslint/indent': ['error', 2],
  'import/order': [
    2,
    {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
      'newlines-between': 'always',
      alphabetize: { order: 'asc' },
    },
  ],
  'no-shadow': 'off',
  '@typescript-eslint/no-shadow': ['error'],

  /* Vue specific */
  'vue/dot-location': ['error', 'property'],
  'vue/eqeqeq': ['error', 'always'],
  'vue/html-closing-bracket-spacing': 2,
  'vue/html-closing-bracket-newline': 2,
  'vue/html-indent': 2,
  'vue/html-quotes': 2,
  'vue/html-self-closing': 2,
  'vue/key-spacing': 2,
  'vue/keyword-spacing': 2,
  'vue/attributes-order': 2,
  'vue/multiline-html-element-content-newline': 2,
  'vue/mustache-interpolation-spacing': 2,
  'vue/valid-v-slot': [
    'error',
    {
      allowModifiers: false,
    },
  ],
  'vue/max-attributes-per-line': [
    2,
    {
      singleline: {
        max: 2,
      },
      multiline: {
        max: 1,
      },
    },
  ],
};

module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: ['plugin:vue/essential', '@vue/airbnb', '@vue/typescript/recommended'],

  parserOptions: {
    ecmaVersion: 2020,
  },

  rules,

  plugins: ['only-warn'],

  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
