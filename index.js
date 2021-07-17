'use strict'

const Benchmark = require('benchmark')
const KoaCompose = require('koa-compose')
const AppBuilder = require('./app-builder/compose.js')
const TrekMiddleware = require('trek-middleware')
const ExpressifyMiddleware = require('expressify-middleware')
const MacchiatoMiddleware = require('@macchiatojs/middleware').default
const MacchiatoKoaifyMiddleware = require('@macchiatojs/koaify-middleware').default
const CoCompose = require('co-compose').Middleware
const Throwback = require('throwback')

const suite = new Benchmark.Suite()
const MW_NUMBER = +process.env.MW_NUMBER

console.log(`${MW_NUMBER} middlewares`)

const KoaComposeBench = deferred => {
  const logic = () => Promise.resolve(true)
  const fn = (ctx, next) => logic().then(next).then(logic)

  const count = MW_NUMBER
  const arr = []
  for (let i = 0; i < count; i++) {
    arr.push(fn)
  }
  KoaCompose(arr)({}).then(() => deferred.resolve())
}

const TrekMiddlewareBench = deferred => {
  const logic = () => Promise.resolve(true)

  const fn = (ctx, next) => logic().then(next).then(logic)

  const count = MW_NUMBER
  const middleware = new TrekMiddleware()
  for (let i = 0; i < count; i++) {
    middleware.push(fn)
  }

  middleware.compose({}).then(() => deferred.resolve())
}

const MacchiatoKoaifyMiddlewareBench = deferred => {
  const logic = () => Promise.resolve(true)

  const fn = (ctx, next) => logic().then(next).then(logic)

  const count = MW_NUMBER
  const middleware = new MacchiatoKoaifyMiddleware()
  for (let i = 0; i < count; i++) {
    middleware.push(fn)
  }

  middleware.compose({}).then(() => deferred.resolve())
}

const ExpressifyMiddlewareBench = deferred => {
  const logic = () => Promise.resolve(true)

  const fn = (req, res, next) => {
    return logic()
      .then(next)
      .then(logic)
  }

  const count = MW_NUMBER
  const middleware = new ExpressifyMiddleware()
  for (let i = 0; i < count; i++) {
    middleware.push(fn)
  }

  middleware.compose({}, {}).then(() => deferred.resolve())
}

const MacchiatoMiddlewareBench = deferred => {
  const logic = () => Promise.resolve(true)

  const fn = (req, res, next) => {
    return logic()
      .then(next)
      .then(logic)
  }

  const count = MW_NUMBER
  const middleware = new MacchiatoMiddleware()
  for (let i = 0; i < count; i++) {
    middleware.push(fn)
  }

  middleware.compose({}, {}).then(() => deferred.resolve())
}

const CoComposeBench = deferred => {
  const logic = () => Promise.resolve(true)

  const fn = (ctx, next) => logic().then(next).then(logic)

  const count = MW_NUMBER
  const arr = []
  for (let i = 0; i < count; i++) {
    arr.push(fn)
  }

  new CoCompose().register(arr).runner().run([{}]).then(() => deferred.resolve())
}

const ThrowbackBench = deferred => {
  const logic = () => Promise.resolve(true)

  const fn = (ctx, next) => logic().then(next).then(logic)

  const count = MW_NUMBER
  const arr = []
  for (let i = 0; i < count; i++) {
    arr.push(fn)
  }

  Throwback.compose(arr)({}, () => { return '' }).then(() => deferred.resolve())
}

const AppBuilderBench = deferred => {
  const logic = () => Promise.resolve(true)

  const fn = (ctx, next) => logic().then(next).then(logic)

  const count = MW_NUMBER
  const arr = []
  for (let i = 0; i < count; i++) {
    arr.push(fn)
  }

  AppBuilder.compose(arr)({}).then(() => deferred.resolve())
}

suite
  .add('koa-compose', KoaComposeBench, { defer: true })
  .add('koa-compose', KoaComposeBench, { defer: true })
  .add('trek-middleware', TrekMiddlewareBench, { defer: true })
  .add('trek-middleware', TrekMiddlewareBench, { defer: true })
  .add('macchiato-koaifymiddleware', MacchiatoKoaifyMiddlewareBench, { defer: true })
  .add('macchiato-koaifymiddleware', MacchiatoKoaifyMiddlewareBench, { defer: true })
  .add('expressify-middleware', ExpressifyMiddlewareBench, { defer: true })
  .add('expressify-middleware', ExpressifyMiddlewareBench, { defer: true })
  .add('macchiato-middleware', MacchiatoMiddlewareBench, { defer: true })
  .add('macchiato-middleware', MacchiatoMiddlewareBench, { defer: true })
  .add('co-compose', CoComposeBench, { defer: true })
  .add('co-compose', CoComposeBench, { defer: true })
  .add('throwback', ThrowbackBench, { defer: true })
  .add('throwback', ThrowbackBench, { defer: true })
  .add('app-builder', AppBuilderBench, { defer: true })
  .add('app-builder', AppBuilderBench, { defer: true })
  .on('cycle', event => { console.log(String(event.target)) })
  .on('complete', function () { console.log('Fastest is ' + this.filter('fastest').map('name')) })
  .run({ async: true })
