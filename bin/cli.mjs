import http from 'http';
import fs from 'fs';
import path from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 8081;
const args = process.argv.slice(2);
const action = args[0];

if (action === 'render') {
  console.log('Rendering...');
  console.log('TODO! (not implemented yet)');
  process.exit(0);
}

if (action !== 'preview') {
  console.log('Please provide an action: preview or render');
  process.exit(1);
}

const relativeFilePath = args[1];

if (!relativeFilePath) {
  console.log('Please provide a relative path to the file to preview.');
  process.exit(1);
}

const workingDirectory = cwd();
const videoFilePath = path.join(workingDirectory, relativeFilePath);
const svelteAppPath = path.join(__dirname, '..', 'build');

const server = http.createServer((req, res) => {
  if (req.url === '/video') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',

    });
    res.end(fs.readFileSync(videoFilePath));
  } else {
    let filePath = path.join(svelteAppPath, req.url === '/' ? 'index.html' : req.url);
    const ext = path.parse(filePath).ext;
    const map = {
      '.ico': 'image/x-icon',
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.mjs': 'text/javascript',
      '.cjs': 'text/javascript',
      '.json': 'application/json',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.wav': 'audio/wav',
      '.mp3': 'audio/mpeg',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword'
    };
  
    const exist = fs.existsSync(filePath);

    if(!exist) {
      res.statusCode = 404;
      res.end(`File ${filePath} not found!`);
      return;
    }

    const data = fs.readFileSync(filePath);

    res.setHeader('Content-type', map[ext] || 'text/plain' );
    res.end(data);
  }
});

server.listen(port, () => {
  console.log(`Serving file: ${videoFilePath} on port http://localhost:${port}`);
});
