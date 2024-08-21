import express from "express";
import mongoose from "mongoose";
import router from "./routers/users.mjs";

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost/roadmapapp")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(`Error: ${err}`));



app.use(express.json());
app.use(router);
const PORT = process.env.PORT || 3000;

const mockusers = [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
    { id: 3, name: "Bob" }
];

// Middleware to log and validate PUT, PATCH, DELETE requests
function logAndValidate(req, res, next) {
    console.log(`${req.method} request to ${req.originalUrl} with data:`, req.body);
    const parsedId = parseInt(req.params.id);
    if (isNaN(parsedId)) {
        return res.status(400).send({ msg: "Invalid ID format" });
    }
    req.parsedId = parsedId; // Store parsed ID for downstream use
    next();
}

app.get("/", (req, res) => {
    res.status(201).send({ msg: 'Hello' });
});

app.get("/api/users", (req, res) => {
    const { query: { filter, value } } = req;
    if (filter && value) {
        return res.send(mockusers.filter((user) => user[filter].includes(value)));
    }
    return res.send(mockusers);
});

app.get("/api/users/:id", (req, res) => {
    const parsedId = parseInt(req.params.id);
    if (isNaN(parsedId)) return res.status(400).send({ msg: "Invalid id" });
    const user = mockusers.find((user) => user.id === parsedId);
    if (!user) {
        res.status(404).send({ msg: "User not found" });
    } else {
        res.send(user);
    }
});

app.post("/api/users", (req, res) => {
    const { body } = req;
    const newUser = { id: mockusers[mockusers.length - 1].id + 1, ...body };
    mockusers.push(newUser);
    res.status(201).send(newUser);
});

app.put("/api/users/:id", logAndValidate, (req, res) => {
    const user = mockusers.find(user => user.id === req.parsedId);
    if (!user) {
        return res.status(404).send({ msg: "User not found" });
    }
    const updatedUser = { ...user, ...req.body };
    const index = mockusers.findIndex(user => user.id === req.parsedId);
    mockusers[index] = updatedUser;
    res.send(updatedUser);
});

app.patch("/api/users/:id", logAndValidate, (req, res) => {
    const user = mockusers.find(user => user.id === req.parsedId);
    if (!user) {
        return res.status(404).send({ msg: "User not found" });
    }
    Object.keys(req.body).forEach(key => {
        user[key] = req.body[key];
    });
    const index = mockusers.findIndex(user => user.id === req.parsedId);
    mockusers[index] = user;
    res.send(user);
});

app.delete("/api/users/:id", logAndValidate, (req, res) => {
    const index = mockusers.findIndex(user => user.id === req.parsedId);
    if (index === -1) {
        return res.status(404).send({ msg: "User not found" });
    }
    mockusers.splice(index, 1);
    res.send({ msg: "User deleted" });
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
