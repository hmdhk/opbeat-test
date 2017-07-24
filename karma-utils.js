function getKarmaConfig (karmaConfig, userConfig) {
  var defaultLaunchers = {
    'SL_CHROME': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '46'
    },
    'SL_FIREFOX': {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '42'
    },
    'SL_SAFARI9': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.11',
      version: '9.0'
    },
    'SL_IE11': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    },
    'SL_IE10': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 2012',
      version: '10'
    },
    'SL_EDGE': {
      base: 'SauceLabs',
      browserName: 'microsoftedge',
      platform: 'Windows 10',
      version: '13'
    },
    'SL_ANDROID4.4': {
      base: 'SauceLabs',
      browserName: 'android',
      platform: 'Linux',
      version: '4.4'
    },
    'SL_IOS9': {
      base: 'SauceLabs',
      browserName: 'iphone',
      platform: 'OS X 10.10',
      version: '9.1'
    },
    'SL_IOS8': {
      base: 'SauceLabs',
      browserName: 'iphone',
      platform: 'OS X 10.10',
      version: '8.4'
    }
  }
  var specPattern = 'test/!(e2e)/*.spec.js'

  var defaultConfig = {
    exclude: [
      'e2e/**/*.*'
    ],
    files: [
      specPattern
    ],
    frameworks: ['browserify', 'jasmine'],
    plugins: [
      'karma-sauce-launcher',
      'karma-failed-reporter',
      'karma-jasmine',
      'karma-spec-reporter',
      'karma-browserify'
    ],
    browserNoActivityTimeout: 60000,
    customLaunchers: defaultLaunchers,
    browsers: [],
    captureTimeout: 120000, // on saucelabs it takes some time to capture browser
    reporters: ['spec', 'failed'],
    browserify: {
      debug: true
    },
    sauceLabs: {
      testName: 'OpbeatJS',
      startConnect: false,
      recordVideo: false,
      recordScreenshots: true,
      options: {
        'selenium-version': '2.48.2',
        'command-timeout': 600,
        'idle-timeout': 600,
        'max-duration': 5400
      }
    }
  }

  defaultConfig.preprocessors = {}
  defaultConfig.preprocessors[specPattern] = ['browserify']

  var isTravis = process.env.TRAVIS
  var isSauce = process.env.MODE && process.env.MODE.startsWith('saucelabs')
  var version = userConfig.packageVersion || ''
  var buildId = 'OpbeatJS@' + version

  if (process.env.MODE) {
    console.log('MODE: ' + process.env.MODE)
  }

  if (isTravis) {
    buildId = buildId + ' - TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')'
    // 'karma-chrome-launcher',
    defaultConfig.plugins.push('karma-firefox-launcher')
    defaultConfig.browsers.push('Firefox')
  } else {
    // buildId = 'OpbeatJS@' + version
    defaultConfig.plugins.push('karma-chrome-launcher')
    defaultConfig.browsers.push('Chrome')

    if (karmaConfig.coverage) {
      // istanbul code coverage
      defaultConfig.plugins.push('karma-coverage')
      var istanbul = require('browserify-istanbul')
      defaultConfig.browserify.transform = [istanbul]

      defaultConfig.coverageReporter = {
        includeAllSources: true,
        reporters: [
          {type: 'html', dir: 'coverage/'},
          {type: 'text-summary'}
        ],
        dir: 'coverage/'
      }

      defaultConfig.preprocessors['src/**/*.js'] = ['coverage']

      defaultConfig.reporters.push('coverage')
    }
  // cfg.plugins.push('karma-phantomjs2-launcher')
  // cfg.browsers.push('PhantomJS2')
  }

  if (isSauce) {
    defaultConfig.concurrency = 3
    if (process.env.TRAVIS_BRANCH === 'master') { // && process.env.TRAVIS_PULL_REQUEST !== 'false'
      defaultConfig.sauceLabs.build = buildId
      defaultConfig.sauceLabs.tags = ['master']
      console.log('saucelabs.build:', buildId)
    }
    defaultConfig.reporters = ['dots', 'saucelabs']
    defaultConfig.browsers = Object.keys(defaultLaunchers)
    defaultConfig.transports = ['polling']
  }
  return defaultConfig
}

module.exports = {getKarmaConfig}
