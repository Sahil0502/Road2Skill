import express, { request, response } from "express";
import mongoose from "mongoose";
import userRouter from "./routers/users.mjs";
import contributionRouter from "./routers/contribution.mjs";
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

app.use(userRouter);
app.use(contributionRouter);
//endpoint for login
app.post("/api/auth",passport.authenticate("local"),(request,response)=>{
    response.send({msg:"success"});
});
//endpoint for status
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
//endpoint for logout
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
// endpoint for testing
app.get("/", (req, res) => {
    console.log(req.session);
    console.log(req.session.id);
    req.session.visited = true;
    res.cookie("test", "Hello",{maxAge: 60000,signed: true});
    res.status(201).send({ msg: 'Hello' });
});
// listening to port
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
