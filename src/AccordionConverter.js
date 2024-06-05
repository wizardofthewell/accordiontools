import React, { useState } from "react";
import { noFlatsOnlySharps } from "./Transposer";
import notes from "./notes";

const bMajorRow = notes.bMajorRow;

const cMajorRow = notes.cMajorRow;

function convertNoteToAccordion(note) {
  let buttonNumber, direction, row;

  // Extract the root and octave from the note
  let root = note.slice(0, -1);
  let octave = parseInt(note.slice(-1));

  // Check each button in the C Major and B Major rows
  while (octave >= 0 && octave <= 8) {
    let newNote = root + octave;

    for (let i = 1; i <= 11; i++) {
      if (cMajorRow.push[i] === newNote) {
        buttonNumber = i;
        direction = "push";
        row = "inside";
        break;
      } else if (cMajorRow.pull[i] === newNote) {
        buttonNumber = i;
        direction = "pull";
        row = "inside";
        break;
      }
    }

    if (!buttonNumber) {
      for (let i = 1; i <= 12; i++) {
        if (bMajorRow.push[i] === newNote) {
          buttonNumber = i;
          direction = "push";
          row = "outside";
          break;
        } else if (bMajorRow.pull[i] === newNote) {
          buttonNumber = i;
          direction = "pull";
          row = "outside";
          break;
        }
      }
    }

    // If found, break the loop
    if (buttonNumber) {
      break;
    }

    // If not found, try the next octave
    octave++;
  }

  // If still not found, return null
  if (!buttonNumber) {
    return note;
  }

  return {
    buttonNumber,
    direction,
    row,
  };
}
function formatAccordionNote(accordionNote) {
  let formattedNote = accordionNote.buttonNumber.toString();

  if (accordionNote.direction === "pull") {
    formattedNote = <b>{formattedNote}</b>;
  }

  if (accordionNote.row === "outside") {
    formattedNote = <>{formattedNote}*</>;
  }

  return <span>{formattedNote}</span>;
}
const AccordionConverter = () => {
  const [notes, setNotes] = useState("");
  const [accordionNotes, setAccordionNotes] = useState("");
  const [warnings, setWarnings] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleConvert = () => {
    const lines = notes.split("\n");
    const accordionLines = [];
    const newWarnings = [];
    const newErrors = [];

    lines.forEach((line, lineIndex) => {
      const notesArray = line.split(/\s+/);
      const accordionNotesArray = notesArray
        .map((note) => {
          if (note.trim() === "") {
            return " ";
          }

          let noteWithSharps = noFlatsOnlySharps(note);

          // Check if the note has an octave
          if (!noteWithSharps.slice(-1).match(/[0-9]/)) {
            noteWithSharps += "4";
            newWarnings.push(
              `Note "${note}" on line ${
                lineIndex + 1
              } is missing an octave. Assigned to octave 4.`
            );
          }

          const accordionNote = convertNoteToAccordion(noteWithSharps);
          if (!accordionNote) {
            newErrors.push(
              `Note "${note}" on line ${lineIndex + 1} could not be converted.`
            );
            return null;
          }

          return formatAccordionNote(accordionNote);
        })
        .filter(Boolean);

      accordionLines.push(<p key={lineIndex}>{accordionNotesArray}</p>);
    });

    setAccordionNotes(accordionLines);
    setWarnings(newWarnings);
    setErrors(newErrors);
  };
  return (
    <div>
      <h2>Standard to Accordion</h2>
      input notes:{" "}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        id="notes"
        name="notes"
        rows="10"
        cols="50"
      />
      <br />
      <br />
      <button onClick={handleConvert}>Convert</button>
      <br />
      <br />
      <div>
        {Array.isArray(accordionNotes)
          ? accordionNotes.map((line, i) => (
              <div key={i}>
                {line}
                <br />
              </div>
            ))
          : accordionNotes}
      </div>
      {warnings.map((warning, i) => (
        <p key={i} className="warning">
          {warning}
        </p>
      ))}
      {errors.map((error, i) => (
        <p key={i} className="error">
          {error}
        </p>
      ))}
    </div>
  );
};

export default AccordionConverter;
export { convertNoteToAccordion };
export { formatAccordionNote };
