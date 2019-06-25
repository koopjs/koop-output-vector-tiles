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

function TestModel () {
  this.model = {
    pull: function (req, callback) {
      callback(null, fixture)
    }
  }
}

TestModel.prototype.metadata = metadata

const testModel = new TestModel()

test('metadata', t => {
  const req = {
    params: { z: 0, x: 0, y: 0 },
    headers: {},
    path: '/test/VectorTiles/tiles.json',
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
        bounds: undefined,
        center: undefined,
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
        tiles: ['http://example.com/test/VectorTiles/{z}/{x}/{y}.pbf'],
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
      }, 'metaddata is sent')
      return res
    }
  }
  testModel.metadata(req, res)
  t.end()
})
