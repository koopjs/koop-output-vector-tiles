const test = require('tape')
const _ = require('lodash')
const esriMetadata = require('../src/esri-metadata')
const fixtureGeojson = _.cloneDeep(require('./fixtures/trees.json'))
const fixtureEsriMetadataResult = require('./fixtures/esri-metadata-result.json')

fixtureGeojson.metadata = {
  title: 'Koop File GeoJSON',
  id: 'trees',
  name: 'Test data'
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

TestModel.prototype.esriMetadata = esriMetadata

const testModel = new TestModel()

test('esriMetadata - success', t => {
  const req = {
    params: { z: 0, x: 0, y: 0 },
    headers: {},
    path: '/test/VectorTileServer',
    protocol: 'http',
    host: 'example.com'
  }
  const res = {
    status: (code) => {
      t.equals(code, 200, 'correct status code')
      return res
    },
    json: (data) => {
      t.deepEquals(data, fixtureEsriMetadataResult, 'esriMetadata is sent')
      return res
    }
  }
  testModel.esriMetadata(req, res)
  t.end()
})

test('esriMetadata - error handling', t => {
  const req = {
    params: { id: 'test' }
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
  testModel.esriMetadata(req, res)
  t.end()
})

test('esriMetadata - 404 handling', t => {
  const req = {
    params: { id: 'test' }
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
  testModel.esriMetadata(req, res)
  t.end()
})
