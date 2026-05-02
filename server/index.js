const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let clipboardData = {
    text: '',
    updateAt: null
};

app.post('/clipboard', (req, res) => {

    const { text } = req.body;
    clipboardData = { text, updateAt: new Date() };
    res.json({ success: true });

});

app.get('/clipboard', (req, res) => {
    res.json(clipboardData);
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
});