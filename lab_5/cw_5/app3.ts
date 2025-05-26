import { Application, Context} from "jsr:@oak/oak/";
import { Eta } from "https://deno.land/x/eta/src/index.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";


const client = new MongoClient();
await client.connect("mongodb://127.0.0.1:27017");

const db = client.database("AGH");
const usersCollection = db.collection("students");

const students = await usersCollection.find().toArray();

const app = new Application();
const eta: Eta = new Eta({ views: `${Deno.cwd()}/views` });

app.use((ctx: Context) => {

    if(ctx.request.method === "GET" && ctx.request.url.pathname === "/"){

        const html = eta.render("app3",{students});
        ctx.response.body = html;
        ctx.response.type = "text/html";
    } else {
        ctx.response.status = 404;
        ctx.response.body = "NIe znaleziono strony";
    }

})


await app.listen({ port: 8000 });
