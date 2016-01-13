'use strict';
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();
const request = require('request');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config');

const production = process.env.NODE_ENV === 'production';
const development = !production;

let movieData;
const devConfig = Object.create(webpackConfig);
devConfig.debug = true;
devConfig.devtool = 'eval-source-map';
let devCompiler;

const fetchData = () => {
  const MOVIE_DATA_URL = 'http://papeko-server.herokuapp.com/api/';

  return new Promise(done => {
    request(MOVIE_DATA_URL, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        movieData = body;

        if (development) {
          devConfig.plugins.push(
            new webpack.DefinePlugin({
              MOVIE_DATA: JSON.stringify(movieData),
              'process.env.NODE_ENV': JSON.stringify('development')
            })
          );
          devCompiler = webpack(devConfig);
        }

        return done();
      }

      throw new $.util.PluginError('request', {
        message: 'Failed to fetch data from the papeko server.'
      });
    });
  });
};

const webpackDev = () => {
  return devCompiler.plugin('done', stats => {
    if (stats.hasErrors() || stats.hasWarnings()) {
      return;
    }
    browserSync.reload();
  });
};

let isFetch = true;

gulp.task('webpack:dev', () => {
  if (isFetch) {
    isFetch = false;

    return fetchData()
      .then(webpackDev);
  }

  return webpackDev();
});

gulp.task('webpack:build', () => {
  return fetchData()
    .then(() => {
      const config = Object.create(webpackConfig);
      config.plugins.push(
        new webpack.DefinePlugin({
          MOVIE_DATA: JSON.stringify(movieData),
          'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
      );

      return webpack(config, (err, stats) => {
        if (err) {
          throw new $.util.PluginError('webpack:build', err);
        }
        $.util.log('[webpack:build]', stats.toString({ colors: true }));
      });
    });
});

gulp.task('styles', () => {
  return gulp.src('src/styles/style.styl')
    .pipe($.plumber())
    .pipe($.if(development, $.sourcemaps.init({ loadMaps: true })))
    .pipe($.stylus({ include: ['node_modules'] }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe($.cssnano())
    .pipe($.if(development, $.sourcemaps.write('./')))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('images', () => {
  return gulp.src('src/images/**/*.{gif,jpg,png,svg}')
    .pipe($.if(production, $.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('jade', () => {
  return gulp.src(['src/**/*.jade', '!src/**/_*.jade'])
    .pipe($.jade())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('copy', () => {
  return gulp.src([
    'src/favicon.ico',
    'src/apple-touch-icon.png',
    'src/CNAME'
  ])
    .pipe(gulp.dest('dist'));
});

gulp.task('serve', () => {
  const config = {
    server: 'dist',
    logFileChanges: false
  };

  if (development) {
    config.middleware = [
      webpackDevMiddleware(devCompiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: { colors: true }
      })
    ];
  }

  return browserSync.init(config);
});

gulp.task('watch', ['styles', 'images', 'jade'], () => {
  gulp.watch('src/styles/**/*.styl', ['styles']);
  gulp.watch('src/images/**/*.{gif,jpg,png,svg}', ['images']);
  gulp.watch('src/**/*.jade', ['jade']);
});

gulp.task('default', () => {
  return runSequence(
    ['webpack:dev', 'watch'],
    'serve'
  );
})

gulp.task('clean', () => del(['dist/**/*', '!dist/.git']));

gulp.task('build', () => {
  return runSequence(
    'clean',
    ['webpack:build', 'styles', 'images', 'jade', 'copy']
  );
});
