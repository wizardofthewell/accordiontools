import React, { useState } from "react";
import notes from "./notes";

const bMajorRow = notes.bMajorRow;
const cMajorRow = notes.cMajorRow;

function convertAccordionToNote(accordionNote) {
  const { buttonNumber, direction, row } = accordionNote;
  let note;

  if (row === "inside") {
    note =
      direction === "push"
        ? cMajorRow.push[buttonNumber]
        : cMajorRow.pull[buttonNumber];
  } else {
    note =
      direction === "push"
        ? bMajorRow.push[buttonNumber]
        : bMajorRow.pull[buttonNumber];
  }

  return note;
}

function parseAccordionNote(accordionNoteStr) {
  const buttonNumber = parseInt(accordionNoteStr.replace(/[^0-9]/g, ""));
  const direction = accordionNoteStr.includes("<b>") ? "pull" : "push";
  const row = accordionNoteStr.includes("*") ? "outside" : "inside";

  return {
    buttonNumber,
    direction,
    row,
  };
}

function StandardConverter() {
  const [accordionNotes, setAccordionNotes] = useState("");
  const [standardNotes, setStandardNotes] = useState("");

  const handleAccordionNotesChange = (event) => {
    setAccordionNotes(event.target.value);
  };

  const convertToStandard = () => {
    const accordionNotesArray = accordionNotes.split(" ");
    const standardNotesArray = accordionNotesArray.map((noteStr) => {
      const accordionNote = parseAccordionNote(noteStr);
      return convertAccordionToNote(accordionNote);
    });

    setStandardNotes(standardNotesArray.join(" "));
  };

  return (
    <div>
      <h2>Standard Converter</h2>
      Accordion notes:
      <textarea
        value={accordionNotes}
        onChange={handleAccordionNotesChange}
        rows="10"
        cols="50"
      />
      <br />
      <button onClick={convertToStandard}>Convert to Standard</button>
      <br />
      <pre>{standardNotes}</pre>
    </div>
  );
}

export default StandardConverter;
