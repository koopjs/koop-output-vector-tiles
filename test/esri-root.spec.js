const test = require('tape')
const _ = require('lodash')
const esriRoot = require('../src/esri-root')
const fixtureGeojson = _.cloneDeep(require('./fixtures/trees.json'))

fixtureGeojson.metadata = {
  title: 'Koop File GeoJSON',
  id: 'trees',
  name: 'Test data',
  vt: {
    type: 'circle',
    paint: {
      'circle-radius': 8
    }
  }

}

function TestModel () {
  this.model = {
    pull: function (req, callback) {
      callback(null, fixtureGeojson)
    }
  }
}

TestModel.prototype.esriRoot = esriRoot

const testModel = new TestModel()

test('esriRoot', t => {
  const req = {
    params: { id: 'test', z: 0, x: 0, y: 0 },
    headers: {},
    path: '/test/VectorTiles/resources/styles/root.json',
    protocol: 'http',
    host: 'example.com'
  }
  const res = {
    status: (code) => {
      t.equals(code, 200, 'correct status code')
      return res
    },
    json: (data) => {
      t.deepEquals(data, {
        version: 8,
        sources: {
          esri: {
            type: 'vector',
            url: 'http://example.com/test/VectorTiles/'
          }
        },
        layers: [{
          source: 'esri',
          'source-layer': 'test',
          minzoom: 0,
          layout: {},
          id: 'test',
          type: 'circle',
          paint: {
            'circle-radius': 8,
            'circle-color': '#007cbf'
          }
        }]
      }, 'root.json data is sent')
      return res
    }
  }
  testModel.esriRoot(req, res)
  t.end()
})
