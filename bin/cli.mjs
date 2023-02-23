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
  const inVideoDomain = req.url.startsWith('/video') || req.headers.referer?.endsWith('/video');
  let basePath = inVideoDomain ? path.dirname(videoFilePath) : svelteAppPath;
  let url = inVideoDomain ? req.url.replace('/video', '/'+path.basename(videoFilePath)) : req.url;
  let filePath = path.join(basePath, url === '/' ? 'index.html' : url);
  const ext = path.parse(filePath).ext;
  const map = {
    '.htm': 'text/html',
    '.html': 'text/html',
    '.md': 'text/markdown',
    '.txt': 'text/plain',
    '.xhtml': 'application/xhtml+xml',
    '.xml': 'application/xml',

    '.cjs': 'text/javascript',
    '.js': 'text/javascript',
    '.jsx': 'text/javascript',
    '.mjs': 'text/javascript',
    '.ts': 'text/javascript',
    '.tsx': 'text/javascript',
    
    '.wasm': 'application/wasm',

    '.json': 'application/json',
    '.jsonp': 'application/json',
    '.map': 'application/json',

    '.css': 'text/css',
    '.less': 'text/css',
    '.sass': 'text/css',
    '.scss': 'text/css',
    '.styl': 'text/css',

    '.bmp': 'image/bmp',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.tiff': 'image/tiff',
    '.webp': 'image/webp',
    
    '.otf': 'application/font-sfnt',
    '.ttf': 'application/font-sfnt',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',

    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg',
    '.wav': 'audio/wav',

    '.mov': 'video/quicktime',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',

    '.7z': 'application/x-7z-compressed',
    '.csh': 'application/x-csh',
    '.doc': 'application/msword',
    '.eot': 'application/vnd.ms-fontobject',
    '.gz': 'application/gzip',
    '.jar': 'application/java-archive',
    '.pdf': 'application/pdf',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.rar': 'application/x-rar-compressed',
    '.sh': 'application/x-sh',
    '.tar': 'application/x-tar',
    '.xls': 'application/vnd.ms-excel',
    '.xsl': 'application/xml',
    '.xslt': 'application/xslt+xml',
    '.zip': 'application/zip',
  };

  const exist = fs.existsSync(filePath);

  if(!exist) {
    res.statusCode = 404;
    res.end(`File ${filePath} not found!`);
    return;
  }

  const data = fs.readFileSync(filePath);
  
  res.setHeader('Content-type', map[ext] || 'text/plain' );

  if (inVideoDomain) {
    // Ensure it can be embedded in an iframe
    res.writeHead(200, {
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    });
  }

  res.end(data);
});

server.listen(port, () => {
  console.log(`Serving file: ${videoFilePath} on port http://localhost:${port}`);
});
