import { T } from "@/components/i18n/t";
import { translationRepository } from "@/lib/repositories";

/**
 * A plain text from an entry (a business name, a product, a card's flattened description) with its English
 * reference translation when one exists and passed the checks (JCE-128); otherwise the Japanese alone, in every
 * language. Rich text goes through RichText, which does the same.
 */
export async function ContentText({ text }: { text: string }) {
  const en = await translationRepository.find("en", text);
  return en ? <T m={{ ja: text, en }} /> : <>{text}</>;
}
