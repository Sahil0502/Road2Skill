import { Router } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helper.mjs";
const userRouter = Router();

// Middleware for validating user input
const validateUser = (req, res, next) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).send({ msg: "Username and password are required." });
  }

  // Validate username length
  if (username.length < 5 || username.length > 10) {
    return res.status(400).send({ msg: "Username must be between 5 and 10 characters long." });
  }

  // Validate password complexity
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).send({
      msg: "Password must be at least 8 characters long, contain at least one letter, one number, and one special character.",
    });
  }

  next();
};

// Route for creating a new user
userRouter.post("/api/users", validateUser, async (req, res) => {
  const { body } = req;
  try {
    body.password = hashPassword(body.password);
    const newUser = new User(body);
    const savedUser = await newUser.save();
    return res.status(201).send({ msg: "User created successfully." });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) { // Duplicate key error (e.g., user already exists)
      return res.status(400).send({ msg: "User already exists." });
    }
    return res.status(500).send({ msg: "Server error. Please try again later." });
  }
});

// Route for retrieving a user by username
userRouter.get("/api/users/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password"); // Exclude the password field
    if (!user) {
      return res.status(404).send({ msg: "User not found." });
    }
    return res.send(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ msg: "Server error. Please try again later." });
  }
});

export default userRouter;
