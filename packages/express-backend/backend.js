import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import util from 'util';

const app = express();
const port = 8000;


app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    const result = await userService.getUsers();
    res.send(result);
});
app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    console.log(job);
    if (name != undefined && job != undefined) {
        console.log("Swag");
        let result = userService.findUserByNameandJob(name, job)
        .then((users)=> res.json(users))
        .catch((error) => console.log(error));
    } else if (name != undefined) {
        let result = userService.findUserByName(name)
        .then((users)=> res.json(users))
        .catch((error) => console.log(error));

    } else if (job != undefined){
        let result = userService.findUserByJob(job)
        .then((users)=> res.json(users))
        .catch((error) => console.log(error));
    } else {
        let result = userService.getUsers()
        .then((users)=> res.json(users))
        .catch((error) => console.log(error));
        
    } 
});
app.get("/users/:id", (req, res) => {
    const id = req.params["id"];
    let result = userService.findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});


app.post("/users", (req, res) => {
    const userToAdd = req.body;
    const rand_id = Math.floor(Math.random() * 100000);
    const newJSON = { "id": "" + rand_id + "", ...userToAdd};
    let result = userService.addUser(newJSON)
    .then((users)=> res.status(201).json(users))
        .catch((error) => res.status(400).send("Bad POST Request"));
});

app.delete("/users/:id", (req, res) => {
    const userToRem = req.body;
    const id = req.params["id"];
   //console.log(id);
    userService.deleteById(id);
    res.status(204).send();
})

app.listen(port, () => {
    console.log(
        'Example app listening at http://localhost:${port}'
    );
});
