import { Application, Context,Router} from "jsr:@oak/oak/";
import { Eta } from "https://deno.land/x/eta/src/index.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { route } from "jsr:@oak/oak/serve";


const client = new MongoClient();
await client.connect("mongodb://127.0.0.1:27017");

const db = client.database("AGH");
const usersCollection = db.collection("students");

const students = await usersCollection.find().toArray();

const app = new Application();
const router = new Router();
const eta: Eta = new Eta({ views: `${Deno.cwd()}/views` });

router.get("/", (ctx: Context) => {
    const html = eta.render("usosPage",{});
    ctx.response.body = html;
    ctx.response.type = "text/html";
});

router.get("/StudentsData.json",(ctx: Context) => {
    
    ctx.response.body = students;
    ctx.response.type = "application/json";
});


router.post("/addStudent", async (ctx) => {
  const body = await ctx.request.body.json();
  const newStudent = await body.value;            
  const insertId = await usersCollection.insertOne(newStudent);
  ctx.response.body = { message: "Student dodany", id: insertId };
  ctx.response.type = "application/json";
});



app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });