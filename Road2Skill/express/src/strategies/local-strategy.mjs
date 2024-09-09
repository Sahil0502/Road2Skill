import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helper.mjs";
import bcrypt from "bcrypt";

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
passport.deserializeUser(async(id, done) => {
    console.log(`Deserializing user ${id}`);
    try{
        const findUser =  await User.findById(id);
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
    new Strategy(async(username,password,done) => {
        console.log(`Username and password are ${username} and ${password}`);
        try{
            const findUser = await User.findOne({username});
            if (!findUser) {
                return done(new Error("User not found"), null);
            }
            if(!bcrypt.compareSync(password,findUser.password)){
                return done(new Error("Invalid password"),null);
            }
            done(null,findUser);
        }
        catch (err){
            done(err,null);
        }
    })
);