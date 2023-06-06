const express = require('express')
const countapi = require('./lib/countapi')
const { makeBadge } = require('badge-maker')
const md5 = require('md5')

const project = require('./package.json')

const app = express()

app.get('/', (req, res) => {
  res.send(project.name)
})

app.get('/:key', async (req, res) => {
  const { label, color, style } = req.query
  countapi.hit(project.name, md5(req.params.key)).then(result => {
    res.set({
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache,max-age=0',
      Expires: new Date(new Date().getTime() - 600000).toUTCString()
    })
    res.send(
      makeBadge({
        message: (result.value || '0').toString(),
        label: label || 'views',
        color: color || 'blue',
        style: style || 'flat'
      })
    )
  })
})

const host = process.env.HOST || '0.0.0.0'
const port = Number(process.env.PORT || 8000)
app.listen(port, host, () => {
  console.log('Server in listening on port ' + port)
})
