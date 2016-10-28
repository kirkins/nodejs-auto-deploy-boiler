const http = require('http'),
createHandler = require('github-webhook-handler'),
handler = createHandler({ path: '/', secret: 'myhashsecret' }),
sys = require('util'),
exec = require('child_process').exec;


http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
      res.end('no such location')
  })
}).listen(7777)

handler.on('error', function (err) {
  console.error('Error:', err.message)
})

handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
      event.payload.repository.name,
      event.payload.ref);
  exec("./build.sh");
})

handler.on('issues', function (event) {
  console.log('Received an issue event for %s action=%s: #%d %s',
      event.payload.repository.name,
      event.payload.action,
      event.payload.issue.number,
      event.payload.issue.title)
})

console.log("listening on port 7777 for github webhook");
