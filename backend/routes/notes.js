const express = require('express');
const router = express.Router()
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const {body , validationResult} = require('express-validator');

// Route 1: Get all the notes using: GET "/api/notes/fetchallnotes".login required
router.get('/fetchallnotes', fetchuser, async (req, res)=>{
    try {

    const notes = await Note.find({user: req.user.id});
    res.json(notes) 
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})

// Route 2: Adding a new notes using: GET "/api/notes/addnote".login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({min : 3}),
        body('description', 'Description must be atleast 5 characters').isLength({min : 5}),
], async (req, res)=>{
    try {
    
    const {title, description, tag} = req.body; 
    //If their are errrors, return bad reqest and the error 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors : errors.array()});
    }
    const note = new Note({
        title, description, tag, user : req.user.id
    })
    const saveNote = await note.save();
    res.json(saveNote)
    
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");       
}
})


// Route 3: Updating a notes using: PUT "/api/notes/updatenote".login required
router.put('/updatenote/:id', fetchuser, async (req, res)=>{
        const {title, description, tag} = req.body;
        try {
        // ?Create new notNote object
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}

        if(note.user.toString() !== req.user.id){
            return result.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, {$set : newNote}, {new:true})
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");    
    }
})


// Route 4: Deleting a note using: DELETE "/api.notes/deletenote".login required
router.delete('/deletenote/:id', fetchuser, async (req, res)=>{
    try {

        // Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}

        // Allow deletion only if user owns this note
        if(note.user.toString() !== req.user.id){
            return result.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"Success" : "Note has been deleted", note : note });
    } catch (error) {
        console.error(error.message);
    res.status(500).send("Internal Server Error");    
    }
})
module.exports = router