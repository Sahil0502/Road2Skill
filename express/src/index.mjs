import express, { request, response } from "express";
import mongoose from "mongoose";
import userRouter from "./routers/users.mjs";
import contributionRouter from "./routers/contribution.mjs";
import recommendationRouter from "./routers/recommendations.mjs";
import passport from "passport";
import "./strategies/local-strategy.mjs"
import cookieParser from "cookie-parser";
import  session  from "express-session";
import MongoStore from "connect-mongo";
import cors from 'cors';
import { User } from "./mongoose/schemas/user.mjs";
import seedDatabase from "./mongoose/seed.mjs";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/roadmapapp";
mongoose.connect(mongoUri)
  .then(async () => {
    console.log("Connected to MongoDB");
    
    // Only run seeding if not explicitly skipped
    if (process.env.SKIP_SEEDING !== 'true') {
      try {
        await seedDatabase();
      } catch (error) {
        console.log("Database seeding failed (this is normal for local development):", error.message);
        console.log("Application will continue without seeding...");
      }
    } else {
      console.log("Database seeding skipped");
    }
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    console.log("Please ensure MongoDB is running and accessible");
    process.exit(1);
  });



app.use(express.json());
app.use (cookieParser('secret'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret',
  saveUninitialized: true,
  resave: false,
  cookie:{
    maxAge: 60000 * 60,
  },
  store: process.env.NODE_ENV === 'development' ? undefined : MongoStore.create({
    client: mongoose.connection.getClient()
  })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(userRouter);
app.use(contributionRouter);
app.use(recommendationRouter);

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../../Frontend/Road2Skill/dist')));

//endpoint for login
app.post("/api/auth/login",passport.authenticate("local"),(request,response)=>{
    response.send({msg:"success"});
});
//endpoint for status
app.get("/api/auth/status", async (request,response)=>{
    try{
        if(request.user){
            // Get full user data from database to check onboarding status
            const user = await User.findById(request.user._id);
            if (user) {
                return response.send({
                    msg:"success",
                    user: request.user,
                    onboardingCompleted: user.onboarding?.completed || false
                });
            }
            return response.send({msg:"success",user:request.user, onboardingCompleted: false});
        }
        else{
            return response.send({msg:"fail"});
        }
    }
    catch(err){
        console.error("Error checking auth status:", err);
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

const PORT = process.env.PORT || 3001;

// Serve React app for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Frontend/Road2Skill/dist/index.html'));
});

// listening to port
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
