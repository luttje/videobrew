import path from 'path';

type ContentTypeMap = {
  [key: string]: string;
};

export const contentTypeMap: ContentTypeMap = {
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

export function getContentType(filePath: string): string {
  const ext = path.parse(filePath).ext;

  return contentTypeMap[ext] || 'text/plain';
}
