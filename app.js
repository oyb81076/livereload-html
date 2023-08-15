import express from 'express';
import livereload from 'livereload';
import { readFile } from 'node:fs';
import open from 'open';

const rootDir = new URL('./src', import.meta.url).pathname;

const app = express();
app.listen(3000);
livereload.createServer().watch(rootDir);
open('http://localhost:3000');

const scripts = `
<script type="module">
const element = document.createElement('script');
element.async = true;
element.src = "http://" + location.hostname + ":35729/livereload.js?snipver=1";
document.head.appendChild(element);
</script>`;
app.use((req, res, next) => {
  const url = req.url.endsWith('/') ? `${req.url}index.html` : req.url;
  if (!url.endsWith('.html')) return next();
  readFile(`${rootDir}${url}`, 'utf-8', (err, text) => {
    if (err) return next();
    res.setHeader('content-type', 'text/html;charset=utf-8');
    res.send(text.replace(/(:?<[/]head\s*>)/i, scripts));
  });
});
app.use(express.static(rootDir));
