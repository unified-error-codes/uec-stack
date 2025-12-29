export type Locale = "en-US";

import enUs from "./en-US.json";

const messages: Record<Locale, Record<string, string>> = {
  "en-US": enUs,
};

export function loadMessages(): {
  locale: Locale;
  messages: Record<string, string>;
} {
  return { locale: "en-US", messages: messages["en-US"] };
}
