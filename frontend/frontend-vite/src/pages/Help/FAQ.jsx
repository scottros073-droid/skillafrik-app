import { Link } from "react-router-dom";
import HelpCenter from "./HelpCenter";

// FAQ page is the same as Help Center - redirect or use same component
export default function FAQ() {
  return <HelpCenter />;
}
