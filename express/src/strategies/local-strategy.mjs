import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/user.mjs";
import { mockusers } from "../index.mjs";


passport.serializeUser((user, done) => {
    console.log(`Serializing user ${user.id}`);
    try {
        // your serialization logic here
        done(null, user.id);
    } catch (err) {
        console.error('Error serializing user:', err);
        done(err, null);
    }
});
passport.deserializeUser((id, done) => {
    console.log(`Deserializing user ${id}`);
    try{
        const findUser = mockusers.find((user) => user.id === id);
        if (!findUser) {
            return done(new Error("User not found"), null);
        }
        done(null, findUser);
    }
    catch(err){
        done(err, null);
    }
});

export default passport.use(
    new Strategy((username,password,done) => {
        console.log(`Username and password are ${username} and ${password}`);
        try{
            const findUser = mockusers.find((user)=> user.username===username);
            if(!findUser) throw new Error("User not found");
            if(findUser.password !== password) 
                throw new Error("Password not found");
            done(null,findUser);
        }
        catch (err){
            done(err,null);
        }
    })
);