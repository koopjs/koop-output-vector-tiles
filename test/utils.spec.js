const test = require('tape')
const Utils = require('../src/utils')

test('Utils.getTileSetKey, with defined host and id args', t => {
  t.plan(1)
  const result = Utils.getTileSetKey('host_param', 'id_param')
  t.equals(result, 'host_param-id_param', 'correct key')
})

test('Utils.getTileSetKey, with defined host and undefined id args', t => {
  t.plan(1)
  const result = Utils.getTileSetKey('host_param', undefined)
  t.equals(result, 'host_param', 'correct key')
})

test('Utils.getTileSetKey, with undefined host and defined id args', t => {
  t.plan(1)
  const result = Utils.getTileSetKey(undefined, 'id_param')
  t.equals(result, 'id_param', 'correct key')
})

test('Utils.getTileSetKey, with undefined host and undefined id args', t => {
  t.plan(1)
  const result = Utils.getTileSetKey(undefined, undefined)
  t.equals(result, '_', 'correct key')
})
