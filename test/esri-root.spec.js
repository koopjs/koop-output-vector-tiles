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
let callbackErr = null
let callbackData = fixtureGeojson

function TestModel () {
  this.model = {
    pull: function (req, callback) {
      callback(callbackErr, callbackData)
    }
  }
}

TestModel.prototype.esriRoot = esriRoot

const testModel = new TestModel()

test('esriRoot - success', t => {
  const req = {
    params: { id: 'test', z: 0, x: 0, y: 0 },
    headers: {},
    path: '/test/VectorTileServer/resources/styles/root.json',
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
            url: 'http://example.com/test/VectorTileServer/'
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

test('esriRoot - error handling', t => {
  const req = {
    params: { id: 'test', z: 0, x: 0, y: 0 }
  }
  const res = {
    status: (code) => {
      t.equals(code, 500, 'correct status code')
      return res
    },
    json: (data) => {
      t.equals(data.message, 'Internal server error', 'has error message')
      return res
    }
  }
  callbackErr = new Error('Internal server error')
  testModel.esriRoot(req, res)
  t.end()
})

test('esriRoot - 404 handling', t => {
  const req = {
    params: { id: 'test', z: 0, x: 0, y: 0 }
  }
  const res = {
    status: (code) => {
      t.equals(code, 404, 'correct status code')
      return res
    },
    send: () => {
      t.pass('404 sent')
      return res
    }
  }
  callbackErr = null
  callbackData = null
  testModel.esriRoot(req, res)
  t.end()
})
