import http from 'node:http';
import { parse } from 'node:querystring';

let mainTable = [];

const server = http.createServer((req, res) => {

    if ( req.method === 'GET' ) {

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

        res.end(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Vanilla Node.js application</title>
          </head>
          <body>
            <h1>Opinie Odwiedzajacych</h1>
            <ul>
                    ${mainTable.map((row, i) => `<li><h3>${row[0]}</h3> <p>${row[1]}</p></li>`)}
            </ul>
              
              <form action=" /submit" method="POST">
                    <h4>Nowy wpis</h4>
                    <label for="name">Twoje imie i nazwisko</label>
                    <input type="text" name="name" id="name">
                    <br>
                    <label for="entry">Treść wpisu</label>
                    <input type="text" name="entry" id="entry"><br>
                    <input type="submit" value="Dodaj wpis">
                </form>
              
              
          </body>
          
          
        </html>
                
        
       `)

    }
    else if (req.method === 'POST') {
        let buffor = '';
            req.on('data', (chunk) => {
                buffor += chunk.toString();
            })

            req.on('end', () => {
                const data = parse(buffor);

                mainTable.push([data.name,data.entry]);

                res.writeHead(302, { Location: '/' });
                res.end();

            })
    }

})

server.listen(3000,() => {
    console.log(`Serwer działa na http://localhost:3000/`);
})