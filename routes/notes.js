const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

// ROUTE 1 : Get all the notes : GET "api/notes/fetchallnotes" no login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Occoured");
  }
});

// ROUTE 2 : add a note: POST "api/notes/addnote" no login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter valid name for note").isLength({ min: 3 }),
    body("description", "description must be at least 5 Characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //if there are errors retun bad request and errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Occoured");
    }
  }
);

// ROUTE 3 : update an existing note using: POST "api/notes/updatenote" login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
    const {title, description, tag} = req.body;
    // create a new Note object
    const newNote = {}
    if(title){newNote.title = title}
    if(description){newNote.description = description}
    if(tag){newNote.tag= tag}

  //find the note to be updated and update it
    let note = await Note.findById(req.params.id)
    if(!note){
      return res.status(404).send("Not found")}

      if(note.user.toString()!==req.user.id ){
        return res.status(401).send("Not Allowed")}

  note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
  res.json({note});
})

module.exports = router;
