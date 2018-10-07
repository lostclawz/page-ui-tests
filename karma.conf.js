// Karma configuration
// Generated on Fri Sep 07 2018 18:29:50 GMT-0400 (Eastern Daylight Time)


module.exports = function(config) {
   process.env.CHROME_BIN = require('puppeteer').executablePath()
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],



    // list of files / patterns to load in the browser
    files: [
      'src/**/test-*.js'
    ],
    
    webpack: {
       // you don't need to specify the entry option because
       // karma watches the test entry points
       // webpack watches dependencies

       // ... remainder of webpack configuration (or import)

       node: {
         fs: 'empty',
         net: 'empty',
         tls: 'empty',
         dns: 'empty',
         ws: "empty",
       }
      //  target: "node"
    },
    webpackMiddleware: {
       // webpack-dev-middleware configuration
       // i.e.
      //  noInfo: false,
       // and use stats to turn off verbose output
       stats: {
          // options i.e. 
          chunks: false
       }
    },

    exclude: [
    ],

    preprocessors: {
       // add webpack as preprocessor
       'src/**/test-*.js': ['webpack'],
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
    plugins:[
      require('karma-webpack'),
      // ('karma-chai'),
      ('karma-mocha'),
      ('karma-chrome-launcher')
    ]
  })
}
