module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'object-shorthand': 'error',
    curly: 'error',
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 'off',
    semi: [2, 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-empty': ['error'],
    'eol-last': 'off',
    'no-undef': 'off',
    camelcase: 'off',
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'vue/attribute-hyphenation': ['warn', 'always', {
      ignore: ['parentID', 'ownerID'],
    }],
    'vue/max-attributes-per-line': ['warn', {
      singleline: 10,
      multiline: {
        max: 1,
        allowFirstLine: false,
      },
    }],
    'vue/order-in-components': 'off',
    'vue/v-slot-style': 'off',
    'vue/no-mutating-props': 'off',
    'vue/custom-event-name-casing': 'off',
    'vue/singleline-html-element-content-newline': 'off',
  },
  overrides: [
    {
      files: [
        '*.vue',
        '*.ts',
      ],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
};
