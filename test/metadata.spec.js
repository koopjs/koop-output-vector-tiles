const test = require('tape')
const metadata = require('../src/metadata')
const fixture = require('./fixtures/trees.json')
fixture.metadata = {
  title: 'Koop File GeoJSON',
  id: 'trees',
  name: 'Test data',
  description: 'Test data description',
  attribution: 'Give some credit here',
  bounds: 'Bounds from metadata',
  source: 'Source from metadata',
  webpage: 'Webpage from metadata'

}
let callbackErr = null
let callbackData = fixture

function TestModel () {
  this.model = {
    pull: function (req, callback) {
      callback(callbackErr, callbackData)
    }
  }
}

TestModel.prototype.metadata = metadata

const testModel = new TestModel()

test('metadata - success', t => {
  const req = {
    params: { z: 0, x: 0, y: 0 },
    headers: {},
    path: '/test/VectorTileServer/tiles.json',
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
        attribution: 'Give some credit here',
        bounds: '-118.18545715987369,34.11804759286581,-118.06811055720897,34.20374076923347',
        center: '0.05867330133236237,0.04284658818383136,10',
        created: undefined,
        description: 'Test data description',
        filesize: 0,
        fillzoom: 8,
        format: 'pbf',
        id: 'Test data',
        name: 'Test data',
        private: false,
        scheme: 'zxy',
        tilejson: '2.2.0',
        tiles: ['http://example.com/test/VectorTileServer/{z}/{x}/{y}.pbf'],
        vector_layers: [{
          description: undefined,
          fields: {
            OBJECTID: 'Integer',
            Common_Name: 'String',
            Genus: 'String',
            Species: 'String',
            House_Number: 'Integer',
            Street_Direction: 'String',
            Street_Name: 'String',
            Street_Type: 'String',
            Street_Suffix: 'String',
            Trunk_Diameter: 'Integer',
            Longitude: 'Double',
            Latitude: 'Double'
          },
          id: '_',
          source: 'Source from metadata',
          source_name: 'Source from metadata'
        }],
        webpage: 'Webpage from metadata'
      }, 'metadata is sent')
      return res
    }
  }
  testModel.metadata(req, res)
  t.end()
})

test('metadata - error handling', t => {
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
  testModel.metadata(req, res)
  t.end()
})

test('metadata - 404 handling', t => {
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
  testModel.metadata(req, res)
  t.end()
})
