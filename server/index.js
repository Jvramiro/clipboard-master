const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir))
    fs.mkdirSync(uploadDir);

// SSE
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

//Clipboard
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

//File
const storage  = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer ({ storage });
let fileData = { filename: '', originalName: '', updatedAt: null };

app.post('/file', upload.single('file'), (req, res) => {
    if (!req.file)
            return res.status(400).json({ error: 'No files received' });
    fileData.filename = req.file.filename;
    fileData.originalName = req.file.originalname;
    fileData.updatedAt = new Date();
    notifyClients();
    res.json({ success: true, originalName: fileData.originalName });
});

app.get('/file/info', (req, res) => {
  res.json(fileData);
});

app.get('/file/download', (req, res) => {
    if(!fileData.filename)
        return res.status(404).json({ error: 'There is no file' });
    const filePath = path.join(uploadDir, fileData.filename);
    res.download(filePath, fileData.originalName);
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
});