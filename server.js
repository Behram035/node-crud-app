import express from "express";
import User from "./models/user.model.js";
import dotenv from "dotenv";
import { Database } from "./db/index.js";
const app = express();

// for JSON Request
app.use(express.json());

// .env config
dotenv.config();

// for JSON Request
app.use(express.urlencoded({ extended: false }));

  

    // validate password
    function validatePassword(password) {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      return passwordRegex.test(password);
    }


// Create user
app.post("/api/v1/users", async (req, res) => {
  try {
    // to check email is exist
    const { username, email, password } = req.body;
    const existedEmail = await User.findOne({ email });
    if (existedEmail) {
      console.log("existed")
      return res.status(400).json({
        message: "Error: Email is already Existed",
        email: existedEmail.email,
      });
    } 
    
    // check for username 

    const existedUsername = await User.findOne({username})
    if (existedUsername) {
      console.log("Username Existed")
      return res.status(400).json({message: "Error: Try another username"})
    }

    //
    if (!validatePassword(password)) {
      console.log("Password Invalid")
      return res.status(400).json({
        message:
          "Error: Password must Includes atleast 8 characters, 1 capital and special character",
      });
    }

    // create user when already not exist and valid password
    const user = await User.create(req.body);
    console.log("User Created")
    return res.status(200).json({ message: "User created Successfully", user });
  

  } catch (error) {
    return res.status(500).json({ message: "Error : User Not Created", error: error.message });
  }
});




// get all users
app.get("/api/v1/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ message: "These are All Users", users });
  } catch (error) {
    res.status(500).json({ message: "Error : No Users Found" });
  }
});

// find user by id
app.get("/api/v1/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    res.status(200).json({ message: "This User found Successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error : This User Not Available" });
  }
});

// update the user
app.put("/api/v1/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body);
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    }
    const updatedUser = await User.findById(id);
    res.status(200).json({ message: "User updated Successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error : Users Not Updated" });
  }
});

// delete the user
app.delete("/api/v1/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id, req.body);
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    }
    const deletedUser = await User.findById(id);
    res.status(200).json({ id, message: "User Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error : User Not Deleted" });
  }
});

Database()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `Server is running on port http://localhost:${process.env.PORT}`
      );
      app.on("ERROR", (error) => {
        console.log("Error", error);
        throw error;
      });
    });
  })
  .catch((error) => {
    console.log("MONGO DB connection Failed !!", error);
  });
