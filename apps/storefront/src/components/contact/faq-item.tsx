import { Icon } from "@/components/icons";

interface FaqItemProps {
  question: string;
  answer: string;
}

/** Native <details> disclosure (keyboard and screen-reader support built in). Motion is added in Phase 4. */
export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <details>
      <summary>{question}<Icon name="plus" /></summary>
      <p className="faq__a">{answer}</p>
    </details>
  );
}
