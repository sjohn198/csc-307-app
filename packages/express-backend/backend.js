import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      }
    ]
};
const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
};
const findUserById = (id) =>  users["users_list"].find(
        (user) => user["id"] === id
    );
const findUserByNameAndJob = (name, job) =>  users["users_list"].find(
    (user) => user["name"] === name && user["job"] === job
);

const addUser = (user) => {
    const rand_id = Math.floor(Math.random() * 100000);
    const newJSON = { "id": "" + rand_id + "", ...user};
    users["users_list"].push(newJSON);
    return newJSON;
};

const remUser = (user) => { 
    const delUser = users["users_list"].find(
        (u) => u["id"] === user["id"]
    );
    const idx = users["users_list"].indexOf(delUser);
    users["users_list"].splice(idx, 1);
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send(users);
});
app.get("/users", (req, res) => {
    const name = req.query.name;
    if (name != undefined) {
        let result = findUserByName(name);
        result = {users_list: result};
        res.send(result);
    } else {
        res.send(users);
    } 
});
app.get("/users/:id", (req, res) => {
    const id = req.params["id"];
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});
app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    let result = findUserByNameAndJob(name, job);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    let result = addUser(userToAdd);
    if (result === undefined) {
        res.status(400).send("Bad POST Request");
    } else {
        result = JSON.stringify(result);
        res.status(201).send(result);
    }
});

app.delete("/users", (req, res) => {
    const userToRem = req.body;
    remUser(userToRem);
    res.status(204).send();
})

app.listen(port, () => {
    console.log(
        'Example app listening at http://localhost:${port}'
    );
});
