import React, { useState } from "react";
import {
  convertNoteToAccordion,
  formatAccordionNote,
} from "./AccordionConverter";

const Transposer = () => {
  const [notes, setNotes] = useState("");
  const [key, setKey] = useState("");
  const [output, setOutput] = useState("");
  const [accordionNotes, setAccordionNotes] = useState("");

  const handleTranspose = () => {
    const transposedNotes = transposeNotes(notes, key);
    setOutput(transposedNotes);
    console.log(output);
  };
  const handleConvertToAccordion = () => {
    const lines = output.split("\n");
    const accordionLines = lines.map((line, lineIndex) => {
      const notesArray = line.split(/(\s+)/);
      const accordionNotesArray = notesArray
        .map((note) => {
          if (note.trim() === "") {
            return " ";
          }
          const noteWithSharps = noFlatsOnlySharps(note); // Use the imported function
          const accordionNote = convertNoteToAccordion(noteWithSharps);
          return accordionNote ? formatAccordionNote(accordionNote) : null;
        })
        .filter(Boolean);
      return <p key={lineIndex}>{accordionNotesArray}</p>;
    });
    setAccordionNotes(accordionLines);
  };
  const handleNotesChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (/^([A-G](#|b)?[0-9]*\s*)*$/.test(value) || value === "") {
      setNotes(value);
    }
  };
  const handleKeyChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (/^([A-G](#|b)?[0-9]*)?$/.test(value)) {
      setKey(value);
    }
  };

  return (
    <div>
      <h2>Transposer</h2>
      input notes:{" "}
      <textarea
        value={notes}
        onChange={handleNotesChange}
        id="notes"
        name="notes"
        rows="10"
        cols="50"
      />
      <br />
      <br />
      key:{" "}
      <input
        type="text"
        value={key}
        onChange={handleKeyChange}
        id="key"
        name="key"
      />
      <br />
      <br />
      <button onClick={handleTranspose}>Transpose</button>
      <br />
      <br />
      <pre id="output">{output}</pre>{" "}
      {/* display the output inside a <pre> tag */}
      <button onClick={handleConvertToAccordion} disabled={!output}>
        Convert to Accordion
      </button>
      {accordionNotes}
    </div>
  );
};

function transposeNotes(notes, key) {
  const lines = notes.split("\n");
  return lines.map((line) => transposeLine(line, key)).join("\n");
}

function transposeLine(line, key) {
  const notesArray = line.split(" ");
  const desiredKey = key;
  const keyArray = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const keyIndex = keyArray.indexOf(noFlatsOnlySharps(desiredKey));
  for (let i = 0; i < notesArray.length; i++) {
    let note = notesArray[i];
    let noteWithoutOctave = note.replace(/\d+$/, "");
    let noteIndex = keyArray.indexOf(noteWithoutOctave);
    if (noteIndex !== -1) {
      let newIndex = (noteIndex + keyIndex) % 12;
      let octave = note.match(/\d+$/) || "4"; // if no octave number is found, use "4"
      notesArray[i] = keyArray[newIndex] + octave;
    }
  }

  return notesArray.join(" ");
}

function noFlatsOnlySharps(notes) {
  const lines = notes.split("\n");
  return lines.map((line) => convertLineToSharps(line)).join("\n");
}

function convertLineToSharps(line) {
  const notesArray = line.split(" ");
  const enharmonicArray = [
    "A#",
    "Bb",
    "C#",
    "Db",
    "D#",
    "Eb",
    "F#",
    "Gb",
    "G#",
    "Ab",
  ];
  for (let i = 0; i < notesArray.length; i++) {
    let note = notesArray[i];
    let noteWithoutOctave = note.replace(/\d+$/, "");
    if (enharmonicArray.includes(noteWithoutOctave)) {
      let octave = note.match(/\d+$/) || "4";
      if (noteWithoutOctave === "Bb") {
        notesArray[i] = "A#" + octave;
      } else if (noteWithoutOctave === "Db") {
        notesArray[i] = "C#" + octave;
      } else if (noteWithoutOctave === "Eb") {
        notesArray[i] = "D#" + octave;
      } else if (noteWithoutOctave === "Gb") {
        notesArray[i] = "F#" + octave;
      } else if (noteWithoutOctave === "Ab") {
        notesArray[i] = "G#" + octave;
      }
    }
    return notesArray.join(" ");
  }
}
export default Transposer;
export { noFlatsOnlySharps };
