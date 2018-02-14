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
    lint: {
      type: 'confirm',
      message: 'Use ESLint to lint your code?',
    },
    lintConfig: {
      when: 'lint',
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
    vuex: {
      type: 'confirm',
      message: 'Use Vuex? (recommended for complex apps/websites)',
    },
    axios: {
      type: 'confirm',
      message: 'Use Axios for Ajax calls?'
    },
    i18n: {
      type: 'confirm',
      message: 'Use Vue-i18n? (recommended if you support multiple languages)',
      default: false
    },
    ie: {
      type: 'confirm',
      message: 'Support IE11?',
      default: false
    },
    autoInstall: {
      type: 'list',
      message:
        'Should we run `npm install` for you after the project has been created? (recommended)',
      choices: [
        {
          name: 'Yes, use NPM',
          value: 'npm',
          short: 'NPM',
        },
        {
          name: 'Yes, use Yarn',
          value: 'yarn',
          short: 'yarn',
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
    '.eslintrc.js': 'lint',
    '.eslintignore': 'lint',
    '.stylintrc': 'lint',
    'src/store/**/*': 'vuex',
    'src/i18n/**/*': 'i18n',
    'src/plugins/i18n.js': 'i18n',
    'src/plugins/axios.js': 'axios'
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
