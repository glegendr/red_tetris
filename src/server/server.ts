let http = require('http');
let fs = require('fs');
let port = 1515;

const server = http.createServer((request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    fs.readFile('src/client/index.html', null, function (error, data) {
        if (error) {
            response.writeHead(404);
            response.write('Whoops! File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port number: ${port}`);

});
