import type { Metadata } from "next";
import Rulebook from "./Rulebook";

export const metadata: Metadata = {
  title: "Rulebook | WAVES '26",
  description: "The WAVES '26 rulebook — code of conduct, general rules and every event's rules.",
};

export default function RulebookPage() {
  return <Rulebook />;
}
