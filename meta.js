const
  path = require('path'),
  fs = require('fs')

const {
  sortDependencies,
  installDependencies,
  runLintFix,
  printMessage,
} = require('./utils')

const pkg = require('./package.json')

module.exports = {
  helpers: {
    template_version() {
      return pkg.version
    }
  },

  prompts: {
    name: {
      type: 'string',
      required: true,
      message: 'Project name (internal usage for dev)',
    },
    productName: {
      type: 'string',
      required: true,
      message: 'Project product name (official name)',
      default: 'Quasar App'
    },
    description: {
      type: 'string',
      required: false,
      message: 'Project description',
      default: 'A Quasar Framework app',
    },
    author: {
      type: 'string',
      message: 'Author',
    },
    preset: {
      type: 'checkbox',
      message: 'Check the features needed for your project:',
      choices: [
        {
          name: 'ESLint',
          value: 'lint',
          checked: true
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
    lintConfig: {
      when: 'preset.lint',
      type: 'list',
      message: 'Pick an ESLint preset',
      choices: [
        {
          name: 'Standard (https://github.com/standard/standard)',
          value: 'standard',
          short: 'Standard',
        },
        {
          name: 'Airbnb (https://github.com/airbnb/javascript)',
          value: 'airbnb',
          short: 'Airbnb',
        },
        {
          name: 'none (configure it yourself)',
          value: 'none',
          short: 'none',
        }
      ]
    },
    cordovaId: {
      type: 'string',
      required: false,
      message: 'Cordova id (disregard if not building mobile apps)',
      default: 'org.cordova.quasar.app'
    },
    autoInstall: {
      type: 'list',
      message:
        'Should we run `npm install` for you after the project has been created? (recommended)',
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
    '.eslintrc.js': 'preset.lint',
    '.eslintignore': 'preset.lint',
    '.stylintrc': 'preset.lint',
    'src/store/**/*': 'preset.vuex',
    'src/i18n/**/*': 'preset.i18n',
    'src/plugins/i18n.js': 'preset.i18n',
    'src/plugins/axios.js': 'preset.axios'
  },
  complete: function(data, { chalk }) {
    const green = chalk.green

    sortDependencies(data, green)

    const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

    if (data.autoInstall) {
      installDependencies(cwd, data.autoInstall, green)
        .then(() => {
          return runLintFix(cwd, data, green)
        })
        .then(() => {
          printMessage(data, green)
        })
        .catch(e => {
          console.log(chalk.red('Error:'), e)
        })
    }
    else {
      printMessage(data, chalk)
    }
  }
}
