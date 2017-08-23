const request = require('request').defaults({gzip: true})
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const fs = require('fs')
const FeatureParser = require('feature-parser')
const spawn = require('child_process').spawn
const _ = require('highland')
const watch = require('node-watch')
const path = require('path')

const tippecanoe = spawn('tippecanoe', ['-e', './tiles'])

// tippecanoe.stderr.once('data', d => console.log('tippecanoe started'))

tippecanoe.stdout.on('data', d => console.log(d.toString()))
// tippecanoe.stderr.on('data', d => console.log(d.toString()))

const watcher = watch('./tiles', {recursive: true}, console.log)

watcher.on('change', (c, f) => {
  if (/\./.test(f)) {
    const file = path.parse(`./tiles/${f}`)
    const Bucket = path.join('dev-koop-downloads/tiles/test', file.dir.split('/tiles')[1])
    const localPath = `./${f}`
    const options = {
      Bucket,
      Key: file.base,
      ACL: 'public-read',
      Body: fs.createReadStream(localPath)
    }
    console.log(`stats=uploading file=${localPath} path=${Bucket}`)
    s3.upload(options, e => console.log(`status=uploading file=${f} error=${e.message}`))
  }
})

_(request.get('https://opendata.arcgis.com/datasets/f6c3c04113944f23a7993f2e603abaf2_23.geojson'))
.pipe(_(FeatureParser.parse()))
.intersperse('\n')
.pipe(tippecanoe.stdin)
.on('end', () => {
  watcher.close()
  console.log('done')
})
