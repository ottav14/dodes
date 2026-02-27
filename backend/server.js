import express from 'express';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 1110;
const httpServer = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('/', (req, res) => {
	  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start web server
app.listen(PORT, () => {
	console.log(`http server running on http://localhost:${PORT}`);
});
