import { request, response, Router } from "express";
import { User } from "../mongoose/schemas/user.mjs";
const router = Router();

router.post("/api/users",async (request,response)=>{
    const {body} = request;
    const newUser = new User(body);
    try{
        const savedUser = await newUser.save();
        return response.status(201).send({msg:"User created"})
    }
    catch(err){
        return response.status(400).send({msg:"User already exists"})
    }
});

router.get("/api/users/:username",async (request,response)=>{
    const {username} = request.params;
    console.log(request.signedCookies);
    try{
        const user = await User.findOne({username});
        return response.send(user);
    }
    catch(err){
        return response.status(404).send({msg:"User not found"})
    }
});


export default router;