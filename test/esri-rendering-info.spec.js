const test = require('tape')
const proxyquire = require('proxyquire')
const modulePath = '../src/esri-rendering-info'
const configStub = {}
const esriRenderingInfo = proxyquire(modulePath, {
  'config': configStub
})

test('esriRenderingInfo - types "circle" and "Point" should return defaults', t => {
  t.plan(2)
  t.deepEquals(esriRenderingInfo('Point'), { type: 'circle', paint: { 'circle-radius': 3, 'circle-color': '#007cbf' } }, 'returns default rendering info')
  t.deepEquals(esriRenderingInfo('circle'), { type: 'circle', paint: { 'circle-radius': 3, 'circle-color': '#007cbf' } }, 'returns default rendering info')
})

test('esriRenderingInfo - types "line", "LineString", and "MultiLineString" should return defaults', t => {
  t.plan(3)
  t.deepEquals(esriRenderingInfo('MultiLineString'), { type: 'line', paint: { 'line-width': 2, 'line-color': '#FF0000' } }, 'returns default rendering info')
  t.deepEquals(esriRenderingInfo('LineString'), { type: 'line', paint: { 'line-width': 2, 'line-color': '#FF0000' } }, 'returns default rendering info')
  t.deepEquals(esriRenderingInfo('line'), { type: 'line', paint: { 'line-width': 2, 'line-color': '#FF0000' } }, 'returns default rendering info')
})

test('esriRenderingInfo - types "fill", "Polygon", and "MultiPolygon" should return defaults', t => {
  t.plan(3)
  t.deepEquals(esriRenderingInfo('MultiPolygon'), { type: 'fill', paint: { 'fill-opacity': 0.5, 'fill-color': '#008000' } }, 'returns default rendering info')
  t.deepEquals(esriRenderingInfo('Polygon'), { type: 'fill', paint: { 'fill-opacity': 0.5, 'fill-color': '#008000' } }, 'returns default rendering info')
  t.deepEquals(esriRenderingInfo('fill'), { type: 'fill', paint: { 'fill-opacity': 0.5, 'fill-color': '#008000' } }, 'returns default rendering info')
})

test('esriRenderingInfo - point types should return configured properties', t => {
  t.plan(1)
  const esriRenderingInfo = proxyquire(modulePath, {
    'config': {
      koopOutputVectorTiles: {
        circle: { paint: { 'circle-radius': 7 } }
      }
    }
  })
  t.deepEquals(esriRenderingInfo('Point'), { type: 'circle', paint: { 'circle-radius': 7, 'circle-color': '#007cbf' } }, 'returns configured rendering info')
})

test('esriRenderingInfo - line types should return passed in properties', t => {
  t.plan(1)
  const esriRenderingInfo = proxyquire(modulePath, {
    'config': {
      koopOutputVectorTiles: {
        line: { paint: { 'line-width': 7 } }
      }
    }
  })
  t.deepEquals(esriRenderingInfo('LineString'), { type: 'line', paint: { 'line-width': 7, 'line-color': '#FF0000' } }, 'returns configured rendering info')
})

test('esriRenderingInfo - polygon types should return passed in properties', t => {
  t.plan(1)
  const esriRenderingInfo = proxyquire(modulePath, {
    'config': {
      koopOutputVectorTiles: {
        fill: { paint: { 'fill-opacity': 0.25 } }
      }
    }
  })
  t.deepEquals(esriRenderingInfo('Polygon'), { type: 'fill', paint: { 'fill-opacity': 0.25, 'fill-color': '#008000' } }, 'returns configured rendering info')
})

test('esriRenderingInfo - point types should return passed in properties', t => {
  t.plan(2)
  t.deepEquals(esriRenderingInfo('Point', { 'circle-radius': 6 }), { type: 'circle', paint: { 'circle-radius': 6, 'circle-color': '#007cbf' } }, 'returns combined rendering info')
  t.deepEquals(esriRenderingInfo('Point', {'circle-color': '#000000'}), { type: 'circle', paint: { 'circle-radius': 3, 'circle-color': '#000000' } }, 'returns combined rendering info')
})

test('esriRenderingInfo - line types should return passed in properties', t => {
  t.plan(2)
  t.deepEquals(esriRenderingInfo('LineString', { 'line-width': 4 }), { type: 'line', paint: { 'line-width': 4, 'line-color': '#FF0000' } }, 'returns combined rendering info')
  t.deepEquals(esriRenderingInfo('LineString', { 'line-color': '#000000' }), { type: 'line', paint: { 'line-width': 2, 'line-color': '#000000' } }, 'returns combined rendering info')
})

test('esriRenderingInfo - polygon types should return passed in properties', t => {
  t.plan(2)
  t.deepEquals(esriRenderingInfo('Polygon', { 'fill-opacity': 1 }), { type: 'fill', paint: { 'fill-opacity': 1, 'fill-color': '#008000' } }, 'returns combined rendering info')
  t.deepEquals(esriRenderingInfo('Polygon', {'fill-color': '#000000'}), { type: 'fill', paint: { 'fill-opacity': 0.5, 'fill-color': '#000000' } }, 'returns combined rendering info')
})
