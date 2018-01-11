module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  extends: [
    {{#if_eq vueESLint 'essential'}}
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential'{{/if_eq}}
    {{#if_eq vueESLint 'strongly-recommended'}}
    // https://github.com/vuejs/eslint-plugin-vue#priority-b-strongly-recommended-improving-readability
    'plugin:vue/strongly-recommended'{{/if_eq}}
    {{#if_eq vueESLint 'recommended'}}
    // https://github.com/vuejs/eslint-plugin-vue#priority-c-recommended-minimizing-arbitrary-choices-and-cognitive-overhead
    'plugin:vue/recommended'{{/if_eq}},

    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  plugins: [
    // required to lint *.vue files
    'vue'
  ],
  globals: {
    'ga': true, // Google Analytics
    'cordova': true,
    '__statics': true
  },
  // add your custom rules here
  'rules': {
    // allow async-await
    'generator-star-spacing': 'off',

    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never'
    }],

    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e' // for e.returnvalue
      ]
    }],

    // allow paren-less arrow functions
    'arrow-parens': 0,
    'one-var': 0,
    // allow async-await
    'generator-star-spacing': 0,

    // 'brace-style': [2, 'stroustrup', { 'allowSingleLine': true }],

    /*
    'import/first': 0,
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/extensions': 0,
    */

    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
