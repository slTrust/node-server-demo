// 处理非get请求
// 添加缓存
import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import * as fs from 'fs';
import * as p from 'path';
import * as url from 'url';

const server = http.createServer();
const publicDir = p.relative(__dirname, 'public');
let cacheAge = 3600 * 24 * 365;

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    const { method, url: path, headers } = request;
    const { pathname, search } = url.parse(path);

    if (method !== 'GET') {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html;charset=utf-8');
        response.end("这是一个假的响应");
        return;
    }

    // /index.html ==> index.html
    let filename = pathname.substr(1);
    if (filename === '') {
        filename = 'index.html'
    }
    response.setHeader('Content-Type', 'text/html;charset=utf-8');
    fs.readFile(p.resolve(publicDir, filename), (error, data) => {
        if (error) {
            if (error.errno === -4058) {
                response.statusCode = 404;
                response.end('你要的文件不存在啊！！！');
            } else if (error.errno === -4068) {
                // http://localhost:8888/xxx
                response.statusCode = 403;
                response.end('无权限查看目录内容');
            } else {
                response.statusCode = 500;
                response.end('服务器繁忙，请稍后再试');
            }
        } else {
            response.setHeader('Cache-Control', `public,max-age=${cacheAge}`);
            response.end(data);
        }
    })
})

server.listen(8888);