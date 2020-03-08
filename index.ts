
import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';

const server = http.createServer();

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    console.log(request.constructor);
    console.log(response.constructor);
    // 得知它是什么 然后声明它的类型 , 这样你在 request. 的时候才会有提示
    console.log('request.httpVersion')
    console.log(request.httpVersion);
    console.log('request.url');
    console.log(request.url);
    console.log('request.headers');
    console.log(request.headers);
    console.log('request.method');
    console.log(request.method);

    // 获取请求体
    const array = [];
    request.on('data', (chunk) => {
        array.push(chunk)
    })
    request.on('end', () => {
        const body = Buffer.concat(array).toString();
        console.log('body')
        console.log(body)

        response.statusCode = 404;
        // 设置响应头
        response.setHeader('x-frank', 'I am frank')
        response.write('1\n');
        response.write('2\n');
        response.write('3\n');
        response.write('4\n');
        response.end(); // 如果你设置了 404 就 end里不传任何东西
    })

})

server.listen(8888);