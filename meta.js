const { complete } = require('./utils')
const escape = val => JSON.stringify(val).slice(1, -1)

module.exports = {
  prompts: {
    name: {
      type: 'string',
      message: 'Project name (internal usage for dev)',
      validate: val => val && val.length > 0
    },

    productName: {
      type: 'string',
      message: 'Project product name (must start with letter if building mobile apps)',
      default: 'Quasar App',
      validate: val => val && val.length > 0,
      transformer: escape
    },

    description: {
      type: 'string',
      message: 'Project description',
      default: 'A Quasar Framework app',
      transformer: escape
    },

    author: {
      type: 'string',
      message: 'Author'
    },

    css: {
      type: 'list',
      message: 'Pick your favorite CSS preprocessor: (can be changed later)',
      default: 'scss',
      choices: [
        {
          name: 'Sass with SCSS syntax (recommended)',
          value: 'scss',
          short: 'SCSS'
        },
        {
          name: 'Sass with indented syntax (recommended)',
          value: 'sass',
          short: 'Sass'
        },
        {
          name: 'Stylus (deprecated)',
          value: 'stylus'
        },
        {
          name: 'None (the others will still be available)',
          value: 'none',
          short: 'None'
        }
      ]
    },

    importStrategy: {
      type: 'list',
      message: 'Pick a Quasar components & directives import strategy: (can be changed later)',
      choices: [
        {
          name: '* Auto-import in-use Quasar components & directives\n    - also treeshakes Quasar; minimum bundle size',
          value: 'auto',
          short: 'Auto import',
          checked: true
        },
        {
          name: '* Import everything from Quasar\n    - not treeshaking Quasar; biggest bundle size',
          value: 'all',
          short: 'Import everything'
        }
      ]
    },

    preset: {
      type: 'checkbox',
      message: 'Check the features needed for your project:',
      choices: [
        {
          name: 'ESLint (recommended)',
          value: 'lint',
          checked: true
        },
        {
          name: 'TypeScript',
          value: 'typescript'
        },
        {
          name: 'Vuex',
          value: 'vuex'
        },
        {
          name: 'Axios',
          value: 'axios'
        },
        {
          name: 'Vue-i18n',
          value: 'i18n'
        },
        {
          name: 'IE11 support',
          value: 'ie'
        }
      ]
    },

    typescriptConfig: {
      when: 'preset.typescript',
      type: 'list',
      message: 'Pick a component style:',
      choices: [
        {
          name:
            'Composition API (recommended) (https://github.com/vuejs/composition-api)',
          value: 'composition',
          short: 'Composition',
        },
        {
          name:
            'Class-based (recommended) (https://github.com/vuejs/vue-class-component & https://github.com/kaorun343/vue-property-decorator)',
          value: 'class',
          short: 'Class',
        },
        {
          name: 'Options API',
          value: 'options',
          short: 'options',
        }
      ]
    },

    lintConfig: {
      when: 'preset.lint',
      type: 'list',
      message: 'Pick an ESLint preset:',
      choices: [
        {
          name: 'Prettier (https://github.com/prettier/prettier)',
          value: 'prettier',
          short: 'Prettier'
        },
        {
          name: 'Standard (https://github.com/standard/standard)',
          value: 'standard',
          short: 'Standard',
        },
        {
          name: 'Airbnb (https://github.com/airbnb/javascript)',
          value: 'airbnb',
          short: 'Airbnb',
        }
      ]
    },

    autoInstall: {
      type: 'list',
      message:
        'Continue to install project dependencies after the project has been created? (recommended)',
      choices: [
        {
          name: 'Yes, use Yarn (recommended)',
          value: 'yarn',
          short: 'yarn',
        },
        {
          name: 'Yes, use NPM',
          value: 'npm',
          short: 'NPM',
        },
        {
          name: 'No, I will handle that myself',
          value: false,
          short: 'no',
        }
      ]
    }
  },

  filters: {
    // ESlint files
    '.eslintignore': 'preset.lint',
    '.eslintrc.js': 'preset.lint',

    // Default files when not using TypeScript
    'jsconfig.json': '!preset.typescript',
    'src/router/*.js': '!preset.typescript',

    // Presets files when not using TypeScript
    'src/boot/axios.js': 'preset.axios && !preset.typescript',
    'src/boot/i18n.js': 'preset.i18n && !preset.typescript',
    'src/i18n/**/*.js': 'preset.i18n && !preset.typescript',
    'src/store/**/*.js': 'preset.vuex && !preset.typescript',

    // TypeScript files
    '.prettierrc': `preset.lint && preset.typescript && lintConfig === 'prettier'`,
    'tsconfig.json': 'preset.typescript',
    'src/env.d.ts': 'preset.typescript',
    'src/shims-vue.d.ts': 'preset.typescript',
    'src/components/CompositionComponent.vue': `preset.typescript && typescriptConfig === 'composition'`,
    'src/components/ClassComponent.vue': `preset.typescript && typescriptConfig === 'class'`,
    'src/components/OptionsComponent.vue': `preset.typescript && typescriptConfig === 'options'`,
    'src/components/models.ts': `preset.typescript`,

    // Default files using TypeScript
    'src/router/*.ts': 'preset.typescript',

    // Presets files using TypeScript
    'src/boot/axios.ts': 'preset.axios && preset.typescript',
    'src/boot/composition-api.ts': `preset.typescript && typescriptConfig === 'composition'`,
    'src/boot/i18n.ts': 'preset.i18n && preset.typescript',
    'src/i18n/**/*.ts': 'preset.i18n && preset.typescript',
    'src/store/**/*.ts': 'preset.vuex && preset.typescript',

    // CSS preprocessors
    '.stylintrc': `preset.lint && css === 'stylus'`,
    'src/css/*.styl': `css === 'stylus'`,
    'src/css/*.scss': `css === 'scss'`,
    'src/css/*.sass': `css === 'sass'`,
    'src/css/app.css': `css === 'none'`,
  },

  complete
};
