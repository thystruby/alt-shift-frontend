import js from '@eslint/js';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  {
    ignores: [
      'dist',
      'storybook-static',
      'coverage',
      '**/*.figma.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  jsxA11y.flatConfigs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  ...storybook.configs['flat/recommended'],
  {
    settings: {
      'import/resolver': {
        node: true,
        typescript: {
          noWarnOnMultipleProjects: true,
          project: [
            './tsconfig.app.json',
            './tsconfig.node.json',
          ],
        },
      },
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2018,
      globals: {
        ...globals.browser,
        ...globals.es2018,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        noWarnOnMultipleProjects: true,
        project: [
          './tsconfig.app.json',
          './tsconfig.node.json',
        ],
        sourceType: 'module',
        tsconfigRootDir,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
        },
      ],
      'import/no-named-as-default-member': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
          filter: {
            regex: 'VM$',
            match: false,
          },
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          prefix: ['T'],
        },
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        {
          selector: 'variable',
          modifiers: ['const', 'exported', 'unused'],
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
        },
      ],
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: ['multiline-const', 'multiline-let'],
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: ['multiline-const', 'multiline-let'],
        },
        {
          blankLine: 'never',
          prev: ['singleline-let', 'singleline-const'],
          next: ['singleline-let', 'singleline-const'],
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'function',
        },
      ],
      'newline-before-return': 'error',
      'react/jsx-filename-extension': [
        'error',
        {
          extensions: ['.tsx'],
        },
      ],
      'react/require-default-props': 'off',
      'react/forbid-prop-types': 'off',
      'space-before-function-paren': ['error', 'always'],
      'react/function-component-definition': 'off',
      semi: ['error', 'always'],
      curly: ['error', 'multi-line'],
      'import/prefer-default-export': 'off',
      'no-console': 'error',
      'react/react-in-jsx-scope': 'off',
      'object-curly-newline': [
        'error',
        {
          consistent: true,
        },
      ],
      'react/destructuring-assignment': 'off',
      '@typescript-eslint/no-use-before-define': 'error',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-indent': [
        'error',
        2,
        {
          indentLogicalExpressions: true,
        },
      ],
      'no-await-in-loop': 'off',
      'react/no-multi-comp': 'error',
      'no-restricted-syntax': 'off',
      'import/no-cycle': 'error',
      'react/no-unused-prop-types': 'error',
      'react/no-children-prop': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
        },
      ],
      'no-nested-ternary': 'error',
      'max-len': [
        'error',
        {
          code: 100,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
      'react/no-array-index-key': 'error',
      'prefer-spread': 'off',
      'import/no-extraneous-dependencies': 'error',
      '@typescript-eslint/no-shadow': 'error',
      'jsx-a11y/media-has-caption': 'off',
      'arrow-parens': ['error', 'as-needed'],
      'jsx-quotes': ['error', 'prefer-single'],
      'no-param-reassign': 'error',
      'no-underscore-dangle': 'off',
      'jsx-a11y/no-static-element-interactions': 'error',
      'react/jsx-no-bind': 'off',
      'react/default-props-match-prop-types': 'off',
      'no-prototype-builtins': 'off',
      'prefer-destructuring': 'off',
      'react/prop-types': 'off',
      'import/no-mutable-exports': 'error',
      'no-restricted-exports': [
        'error',
        {
          restrictedNamedExports: ['off'],
        },
      ],
      'arrow-body-style': ['error', 'as-needed'],
      'react-hooks/exhaustive-deps': 'error',
      'no-alert': 'off',
      'max-classes-per-file': ['error', 1],
      '@typescript-eslint/no-useless-constructor': 'off',
      'class-methods-use-this': 'error',
      'no-plusplus': [
        'error',
        {
          allowForLoopAfterthoughts: true,
        },
      ],
      'no-multi-assign': 'error',
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/control-has-associated-label': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-autofocus': 'off',
      'consistent-return': 'off',
      'func-names': 'off',
      'lines-between-class-members': [
        'error',
        'always',
        {
          exceptAfterSingleLine: true,
        },
      ],
      'eol-last': ['error', 'always'],
      'react/no-danger': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ['.storybook/**/*.{ts,tsx}'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      parserOptions: {
        project: false,
      },
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.vitest,
      },
    },
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      ecmaVersion: 2018,
      globals: {
        ...globals.node,
        ...globals.es2018,
      },
      sourceType: 'module',
    },
    rules: {
      'import/no-named-as-default-member': 'off',
    },
  },
);
