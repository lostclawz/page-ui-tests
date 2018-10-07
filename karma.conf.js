// Karma configuration
// Generated on Fri Sep 07 2018 18:29:50 GMT-0400 (Eastern Daylight Time)

process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
   
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: __dirname,


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],



    // list of files / patterns to load in the browser
    files: [
      'src/**/test-*.js'
    ],
    client: {
      mocha: {
        // change Karma's debug.html to the mocha web reporter
        reporter: 'html',

        // require specific files after Mocha is initialized
      //   require: [require.resolve('bdd-lazy-var/bdd_lazy_var_global')],

        // custom ui, defined in required file above
      //   ui: 'bdd-lazy-var/global',
      }
    },
    /* 
    webpack: {
       // you don't need to specify the entry option because
       // karma watches the test entry points
       // webpack watches dependencies

       // ... remainder of webpack configuration (or import)

      mode: 'development',
       node: {
         fs: 'empty',
         net: 'empty',
         tls: 'empty',
         dns: 'empty',
         ws: 'empty',
       },
      //  target: 'node',
       externals: [
           'aws-sdk', 
           'es6-promise',
         //   '@serverless-chrome/lambda',
           'ws',
         //   require('webpack-node-externals')
       ]
      //  externals: {
         //  'ws': 'ws'

      //  }
      //  output: {
      //     target: 'node'
      //  }
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
    }, */

    exclude: [
       './node_modules'
    ],

   //  preprocessors: {
       // add webpack as preprocessor
      //  'src/**/test-*.js': ['webpack'],
   //  },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
   //  reporters: ['progress'],


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
      // require('karma-webpack'),
      // ('karma-chai'),
      require('karma-mocha'),
      require('karma-chrome-launcher')
    ]
  })
}
