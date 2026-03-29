import { useState } from "react";
import SupportWidget from "./SupportWidget";
import { FaCommentDots } from "react-icons/fa"; // Make sure react-icons is installed

export default function ChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <SupportWidget />}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform"
      >
        <FaCommentDots size={24} />
      </button>
    </>
  );
}
