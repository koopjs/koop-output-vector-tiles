const test = require('tape')
const _ = require('lodash')
const esriMetadata = require('../src/esri-metadata')
const fixtureGeojson = _.cloneDeep(require('./fixtures/trees.json'))
const fixtureEsriMetadataResult = require('./fixtures/esri-metadata-result.json')

fixtureGeojson.metadata = {
  title: 'Koop File GeoJSON',
  id: 'trees',
  name: 'Test data',
  extent: {
    xmin: -118,
    ymin: 34.0,
    xmax: -117,
    ymax: 34.2,
    spatialReference: {
      wkid: 4326
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

TestModel.prototype.esriMetadata = esriMetadata

const testModel = new TestModel()

test('esriMetadata', t => {
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
