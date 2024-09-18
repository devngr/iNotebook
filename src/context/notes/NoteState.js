import React from "react";
import noteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props)=>{
    const host = "http://localhost:5000"
        const notesInitial = []
        const [notes, setNotes] = useState(notesInitial)

        // Get all note
        const getNotes=async ()=>{

            const response = await fetch(`${host}/api/notes/fetchallnotes`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  "auth-token": localStorage.getItem('token')
                },
              });
              const json = await response.json(); 
              setNotes(json);

            }

        // Add a note
        const addNote=async (title, description, tag)=>{
            // TODO: API calls
            const response = await fetch(`${host}/api/notes/addnote`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  "auth-token": localStorage.getItem('token')
                },
                body: JSON.stringify({title, description, tag})
              });
              const note = await response.json(); 
              setNotes(notes.concat(note))
        }

        // Delete a note
        const deleteNote= async (id)=>{
            // TODO API Call
            const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  "auth-token": localStorage.getItem('token')
                }
              });
              const json = response.json(); 
              console.log(json)
              
            const newNote = notes.filter((note)=>{return note._id!==id})
            setNotes(newNote);
        }


        // Edit a note
        const editNote= async (id, title, description, tag)=>{
            // API Call
            const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  "auth-token": localStorage.getItem('token')
                },
                body: JSON.stringify({title, description, tag})
              });
              const json = await response.json(); 
              console.log(json)


            let newNote = JSON.parse(JSON.stringify(notes))
            // Logic to edit in client
            for (let index = 0; index < newNote.length; index++) {
                const element = newNote[index];
                if(element._id===id){
                    newNote[index].title = title;
                    newNote[index].description = description;
                    newNote[index].tag = tag;
                    break;
                }
            }
            setNotes(newNote);
        }


    return(
        <noteContext.Provider value={{notes, addNote, deleteNote, editNote, getNotes}}>
            {props.children}
        </noteContext.Provider>
    )
}
export default NoteState;