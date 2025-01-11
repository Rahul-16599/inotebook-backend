const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

// Create a User using: POST "api/auth/createuser" no login required
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
      //create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured")
    }

    // .then(user => res.json(user))
    //   .catch(err => {console.log("Duplicate value for email")
    //     res.json({error: "Please enter unique value for email"})
    //   })
  }
);

module.exports = router;
