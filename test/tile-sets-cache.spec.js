const test = require('tape')
const TileSetsCache = require('../src/tile-sets-cache')
const fixture = require('./fixtures/trees.json')

test('should upsert geojson as tile set', t => {
  t.plan(1)
  const tileSetsCache = new TileSetsCache()
  const tileSet = tileSetsCache.upsert('key', fixture)
  const retrieved = tileSetsCache.retrieve('key')
  t.deepEquals(tileSet, retrieved, 'upsert equals retrieved')
})

test('should return undefined for expired TileSet', t => {
  t.plan(1)
  const tileSetsCache = new TileSetsCache({ ttl: -1000 })
  tileSetsCache.upsert('key', fixture)
  const retrieved = tileSetsCache.retrieve('key')
  t.notOk(retrieved, 'retrieve returns undefined')
})
