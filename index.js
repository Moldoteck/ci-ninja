const express = require('express')
const path = require('path')
const http = require('http')
const app = express()
const bodyParser = require('body-parser')
const Netmask = require('netmask').Netmask
const fs = require('fs')

app.set('port', 61439)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/', (req, res) => {
  const authorizedIps = [
    '127.0.0.1',
    'localhost'
  ]
  const githubIps = [
    '207.97.227.253',
    '50.57.128.197',
    '204.232.175.75',
    '108.171.174.178'
  ]
  const payload = JSON.parse(req.body.payload)

  if (!payload) {
    console.log('No payload')
    res.writeHead(400)
    res.end()
    return
  }

  const ipv4 = req.ip.replace('::ffff:', '')
  if (!(inAuthorizedSubnet(ipv4) || authorizedIps.indexOf(ipv4) >= 0 || githubIps.indexOf(ipv4) >= 0)) {
    console.log('Unauthorized IP:', req.ip, '(', ipv4, ')')
    res.writeHead(403)
    res.end()
    return
  }
  if (!payload.ref) {
    res.writeHead(200)
    res.end()
    return
  }

  let docker_name = ''
  if (payload.repository.name.includes('MalwareBot'))
    docker_name = 'malwarebot'
  if (payload.repository.name.includes('AbstractExtractorBot'))
    docker_name = 'abstractbot'
  if (payload.repository.name.includes('ToxMod'))
    docker_name = 'toxmodbot'
  if (payload.repository.name.includes('VoiceSpeaker'))
    docker_name = 'voicespeaker'
  if (payload.repository.name.includes('Beautifier'))
    docker_name = 'beautifier'
  console.log(`Executing task for: ${docker_name}`)
  myExec(docker_name)

  res.writeHead(200)
  res.end()
})

http.createServer(app).listen(app.get('port'), function () {
  console.log('CI Ninja server listening on port ' + app.get('port'))
})

function myExec(line) {
  const exec = require('child_process').exec
  const execCallback = (error) => {
    if (error !== null) {
      console.log('exec error: ' + error)
    }
  }

  exec(`sudo docker-compose restart ${line}`, { cwd: '../Bots' }, execCallback)
}

function inAuthorizedSubnet(ip) {
  const authorizedSubnet = [
    '192.30.252.0/22',
    '185.199.108.0/22',
    '140.82.112.0/20',
    '143.55.64.0/20'
  ].map(function (subnet) {
    return new Netmask(subnet)
  })
  return authorizedSubnet.some(function (subnet) {
    return subnet.contains(ip)
  })
}
