import { gardenQuotes } from "../../../constants";

const MS_PER_DAY = 86_400_000;
const dayIndex =
  Math.floor(Date.now() / MS_PER_DAY) % gardenQuotes.length;

// One quote per calendar day (index fixed for this page load)
export default function DailyQuote() {
  const [text, author] = gardenQuotes[dayIndex].split(" — ");
  return (
    <blockquote className="text-center">
      <p className="text-muted-italic text-sm">"{text}"</p>
      {author && <span className="label-xs mt-2 block">— {author}</span>}
    </blockquote>
  );
}
