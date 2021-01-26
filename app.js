const express = require('express')
const countapi = require('countapi-js')
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
    res.setHeader('Content-Type', 'image/svg+xml')
    res.send(
      makeBadge({
        message: (result.value || '0').toString(),
        label: label || 'views',
        color: color || 'blue',
        style: style || 'flat-square'
      })
    )
  })
})

const host = process.env.HOST || '0.0.0.0'
const port = Number(process.env.PORT || 8000)
app.listen(port, host, () => {
  console.log('Server in listening on port ' + port)
})
