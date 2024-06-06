const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 12345 });

wss.on('connection', ws => {
  console.log('Hot reload server connected.');
});

const watcher = chokidar.watch(path.resolve(__dirname, 'dist'), {
  ignored: /(^|[\/\\])\../,
  persistent: true
});

watcher.on('change', filePath => {
  console.log(`${filePath} has been changed`);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send('reload');
    }
  });
});

console.log('Hot reload server is running...');
