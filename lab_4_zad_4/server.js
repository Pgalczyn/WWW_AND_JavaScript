const fs = require('fs');
const path = require('path');
const http = require('http');

const dataFilepath = path.join(__dirname, 'StudentsData.json');

function addData(){

    if(!fs.existsSync(dataFilepath)){
        const students = [
            {first_name:'Jan' , last_name:'Kowalski',
                photo:"https://www.investopedia.com/thmb/r-ykjZLW9I4RmbU-drQ3hrksqdM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-2130374028-337261d83cc5416eb5bd23f2905a44ee.jpg",
                notes:{
                    Matematyka: 0,
                    Polski: 0,
                    Angielski:0,
                    Niemiecki:0

                }},
            {first_name:'Joanna' , last_name:'Ptak', photo:"https://st.depositphotos.com/1011643/4715/i/450/depositphotos_47157715-stock-photo-college-student-looking-up.jpg",
                notes:{
                    Matematyka: 0,
                    Polski: 0,
                    Angielski:0,
                    Niemiecki:0

                }},
            {first_name:'Michał' , last_name:'Anioł',photo:"https://thumbs.dreamstime.com/b/high-school-student-29699566.jpg",
                notes:{
                    Matematyka: 0,
                    Polski: 0,
                    Angielski:0,
                    Niemiecki:0

                }},
            {first_name:'Marysia' , last_name:'Lis',photo:"https://st2.depositphotos.com/4431055/11856/i/950/depositphotos_118562150-stock-photo-young-student-girl.jpg",
                notes:{
                    Matematyka: 0,
                    Polski: 0,
                    Angielski:0,
                    Niemiecki:0
                }},
        ]
        fs.writeFileSync(dataFilepath, JSON.stringify(students, null, 2));
    }
}
addData();
const publicPath = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {

    if( req.method === 'GET' && req.url === '/StudentsData.json'){

        fs.readFile(dataFilepath, (err, data) => {
            if (err){
                res.writeHead(500, {'content-type': 'text/html',
                    'Access-Control-Allow-Origin': '*'});
                res.end('server internal error');
            }
            else{
                res.writeHead(200, {'content-type': 'application/json',
                    'Access-Control-Allow-Origin': '*'});
                res.end(data);
            }

        });
        return;

    }

    if( req.method === 'POST' && req.url === '/StudentsData.json'){

        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', (chunk) => {
            const parsedData = JSON.parse(body);
            fs.writeFileSync(dataFilepath, JSON.stringify(body,null,2), 'utf8');
        })

    }


    let filePath = path.join(publicPath, req.url === '/' ? 'usosPage.html' : req.url);


    const extname = path.extname(filePath);

    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.js': 'text/javascript',
        '.json': 'application/json',
    }

    const contentType = contentTypes[extname] || 'text/plain';

    fs.readFile(filePath, (err, data) => {

        if (err){
            if (err.code === 'ENOENT') {
                res.writeHead(404, {'content-type': 'text/html'});
                res.end('404 Not Found');
            }
            else {
                res.writeHead(500);
                res.end('server error');
            }
        }
        else{
            res.writeHead(200, {'content-type': contentType});
            console.log(req.url);
            res.end(data);


        }
    })



})


server.listen(8080, () => {
    console.log('Server listening on port 8080');
})






