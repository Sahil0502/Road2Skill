import express, { request, response } from "express";
import mongoose from "mongoose";
import router from "./routers/users.mjs";
import passport from "passport";
import "./strategies/local-strategy.mjs"
import cookieParser from "cookie-parser";
import  session  from "express-session";
import MongoStore from "connect-mongo";

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost/roadmapapp")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(`Error: ${err}`));



app.use(express.json());
app.use (cookieParser('secret'));
app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:false,
    cookie: {
        maxAge: 60000 * 60,
    },
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
    })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(router);

//endpoint for login
app.post("/api/auth",passport.authenticate("local"),(request,response)=>{
    response.send({msg:"success"});
});

app.get("/api/auth/status",(request,response)=>{
    try{
        if(request.user){
            return response.send({msg:"success",user:request.user});
        }
        else{
            return response.send({msg:"fail"});
        }
    }
    catch(err){
        return response.send({msg:"fail"});
    }
});

app.post("/api/auth/logout",(request,response)=>{
    if(!request.user){
        return response.send({msg:"fail"});
    }
    request.logout((err)=>{
        if(err){
            return response.send({msg:"fail"});
        }
        return response.send({msg:"success"});
    });
});





const PORT = process.env.PORT || 3000;








export const mockusers = [
    { id: 1, username: "user1", email: "Xb5ZG@example.com", password: "password1" },
    { id: 2, username: "user2", email: "a1B0M@example.com", password: "password2" },
    { id: 3, username: "user3", email: "lT5pF@example.com", password: "password3" },
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
    console.log(req.session);
    console.log(req.session.id);
    req.session.visited = true;
    res.cookie("test", "Hello",{maxAge: 60000,signed: true});
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
