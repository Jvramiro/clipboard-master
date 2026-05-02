const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let clients = [];

app.get('/clipboard/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(c => c !== res);
  });
});

function notifyClients() {
  clients.forEach(res => res.write('data: update\n\n'));
}

let clipboardData = {
    text: '',
    updateAt: null
};

app.post('/clipboard', (req, res) => {

    const { text } = req.body;
    clipboardData = { text, updateAt: new Date() };
    notifyClients();
    res.json({ success: true });

});

app.get('/clipboard', (req, res) => {
    res.json(clipboardData);
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
});