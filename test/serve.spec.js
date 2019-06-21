const test = require('tape')
const serve = require('../src/serve')
const fixture = require('./fixtures/trees.json')

function TestModel () {
  this.model = {
    pull: function (req, callback) {
      callback(null, fixture)
    }
  }
}

TestModel.prototype.serve = serve

const testModel = new TestModel()

test('serve', t => {
  const req = {
    params: { z: 0, x: 0, y: 0 }
  }
  const res = {
    status: (code) => {
      t.equals(code, 200, 'correct status code')
      return res
    },
    send: (data) => {
      t.equals(data instanceof Buffer, true, 'buffer is sent')
      t.ok(data.length, true, 'buffer is not empty')
      return res
    },
    set: (headers) => {
      t.deepEquals(headers, {
        'Content-Type': 'application/x-protobuf',
        'Cache-Control': `public, max-age: 3600`
      }, 'includes expected headers')
      return res
    }
  }
  testModel.serve(req, res)
  t.end()
})

test('serve no content', t => {
  const req = {
    params: { z: 10, x: 0, y: 0 }
  }
  const res = {
    status: (code) => {
      t.equals(code, 204, 'correct status code')
      return res
    },
    send: (data) => {
      t.notOk(data, 'nothing sent')
      return res
    }
  }
  testModel.serve(req, res)
  t.end()
})
