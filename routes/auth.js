const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "rhaulisgood$boy";

// ROUTE 1 : Create a User using: POST "api/auth/createuser" no login required
router.post(
  "/createuser",

  [
    body("name", "Enter valid name").isLength({ min: 3 }),
    body("email", "Enter valid email").isEmail(),
    body("password", "password must be at least 5 Characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //if there are errors retun bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // check weather emaill of the user exist already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(404).json("Sorry this email already exists");
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      //res.json(user);
      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Occoured");
    }

    // .then(user => res.json(user))
    //   .catch(err => {console.log("Duplicate value for email")
    //     res.json({error: "Please enter unique value for email"})
    //   })
  }
);






//ROUTE 1 :  authenticate a User using: POST "api/auth/login" no login required
router.post(
  "/login",

  [
    body("email", "Enter valid email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    //if there are errors retun bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: "User doesn't exists, Wrong Email" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ errors: "Wrong Password" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Occoured");
    }
  }
);




//ROUTE 3 :  Get logged in User: POST "api/auth/getuser" login required
router.post("/getuser", fetchuser, async (req, res) => {
try{
    userId = req.user.id;
   const user = await User.findById(userId).select('-password')
   res.send(user)
}catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Occoured");
    }

})

module.exports = router;
