import React, { useState, useEffect } from "react";
import notes from "./notes";
import { useEditor, EditorContent } from "@tiptap/react";
import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
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
const parseAccordionNote = (accordionNoteStr) => {
  const parser = new DOMParser();
  const parsedHtml = parser.parseFromString(accordionNoteStr, "text/html");
  const spans = parsedHtml.querySelectorAll("p > span, p > strong");
  const notes = Array.from(spans).map((span) => {
    const isBold = span.tagName.toLowerCase() === "strong";
    const numbers = span.textContent.trim().split(" ").map(Number);
    return numbers.map((number) => ({ number, isBold }));
  });

  const flatNotes = notes.flat();

  return flatNotes.map((note) => {
    const { number, isBold } = note;
    const direction = isBold ? "pull" : "push";
    const row = isBold ? "outside" : "inside";

    return {
      buttonNumber: number,
      direction,
      row,
    };
  });
};

function StandardConverter() {
  const [accordionNotes, setAccordionNotes] = useState("");
  const [standardNotes, setStandardNotes] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: accordionNotes,
    onUpdate: ({ editor }) => {
      setAccordionNotes(editor.getHTML());
    },
  });

  const convertToStandard = () => {
    if (!editor) {
      console.error("Editor is not initialized yet");
      return;
    }

    const accordionNotesHTML = editor.getHTML();
    console.log("Accordion notes HTML:", accordionNotesHTML);

    const accordionNotes = parseAccordionNote(accordionNotesHTML);
    console.log("Accordion notes:", accordionNotes);

    const standardNotes = accordionNotes.map(convertAccordionToNote);

    setStandardNotes(standardNotes.join("\n"));
  };

  return (
    <div>
      <EditorContent editor={editor} />
      <button onClick={convertToStandard}>Convert to Standard</button>
    </div>
  );
}

export default StandardConverter;
