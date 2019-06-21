const test = require('tape')
const _ = require('lodash')
const proxyquire = require('proxyquire')
const modulePath = '../src/tile-set-config'
const configStub = {}

test('tileSetConfig should contain no undefined properties', t => {
  t.plan(1)
  const tileSetConfig = proxyquire(modulePath, {
    'config': configStub
  })
  const undefinedKeys = Object.keys(_.pickBy(tileSetConfig, _.isUndefined))
  t.equals(undefinedKeys.length, 0, 'no undefinedKeys')
})

test('tileSetConfig should contain any defined properties', t => {
  t.plan(1)
  _.set(configStub, 'koopOutputVectorTiles.geojsonVT.maxZoom', 10)
  const tileSetConfig = proxyquire(modulePath, {
    'config': configStub
  })
  const definedKeys = Object.keys(_.omitBy(tileSetConfig, _.isUndefined))
  t.equals(definedKeys[0], 'maxZoom', 'has defined keys')
})
