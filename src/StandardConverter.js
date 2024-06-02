import React, { useState } from "react";
import notes from "./notes";
import Quill from "react-quill";
import "react-quill/dist/quill.snow.css";
import parse from "html-react-parser";

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
  const direction = accordionNoteStr.includes("<strong>") ? "pull" : "push";
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

  const handleAccordionNotesChange = (html) => {
    setAccordionNotes(html);
  };

  const convertToStandard = () => {
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(accordionNotes, "text/html");
    const accordionNotesArray = parsedHtml.body.innerHTML.match(
      /<strong>.*?<\/strong>|[^<\s]+/g
    );
    const standardNotesArray = accordionNotesArray.map((noteStr) => {
      const accordionNote = parseAccordionNote(noteStr);
      return convertAccordionToNote(accordionNote);
    });

    setStandardNotes(standardNotesArray.join("\n"));
  };

  return (
    <div>
      <Quill value={accordionNotes} onChange={handleAccordionNotesChange} />
      <button onClick={convertToStandard}>Convert to Standard</button>
      <div>{standardNotes}</div>
    </div>
  );
}

export default StandardConverter;
