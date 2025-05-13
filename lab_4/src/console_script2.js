import fs from 'node:fs';
import { argv } from 'node:process';
import { exec } from 'child_process';
import readline from 'node:readline';

function readAsync(){

    fs.readFile('counter.txt', (err, data) => {
        if (err && err.code == 'ENOENT'){
            fs.writeFile('counter.txt', '1', 'utf8', err => {
                if(err) throw err;
            });
        }
        else if(err) throw err;

        else{
            const count = parseInt(data) + 1;
            fs.writeFile('counter.txt', String(count), 'utf8', err => {
                if(err) throw err;
            });
        }
    })
}

function readSync(){
    const buffer = fs.readFileSync('counter.txt', 'utf8');

    if (buffer.length === 0) {
        fs.writeFileSync('counter.txt', '1');
    }
    else{
        const count = parseInt(buffer) + 1;
        fs.writeFileSync('counter.txt', String(count), 'utf8',)
        console.log("SYNC increase");
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})



function questionLoop(){

    rl.question('Podaj komendę: ',answer =>{

        exec(answer,(error,stdout,stderr) => {
            if (error) {
                console.log(stderr);
            }
            if (stdout) process.stdout.write(stdout);
            if (stderr) process.stderr.write(stderr);
            questionLoop();
        })

    })

}

if (argv[2] === '--sync') readSync();
else if (argv[2] === '--async') readAsync();
else{
    questionLoop();
}
