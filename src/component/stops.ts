/**
 * The route the tuk-tuk drives. One entry per chapter, in page order: `id`
 * is the section's DOM id, `kh` its Khmer heading, `en` the short label on
 * the ride bar.
 */
export const STOPS = [
  { id: "home", kh: "ភ្នំពេញ", en: "Home" },
  { id: "abroad", kh: "ចាកចេញ", en: "Abroad" },
  { id: "road", kh: "ផ្លូវថ្មី", en: "New road" },
  { id: "market", kh: "ផ្សាររាត្រី", en: "Market" },
  { id: "toolbox", kh: "ឧបករណ៍", en: "Toolbox" },
  { id: "forward", kh: "ទៅមុខ", en: "Forward" },
] as const;

export type StopId = (typeof STOPS)[number]["id"];

const KH_DIGITS = "០១២៣៤៥៦៧៨៩";

/** 12 → "១២" */
export const khNum = (n: number) =>
  String(n).replace(/\d/g, (d) => KH_DIGITS[Number(d)]);

export const stopOf = (id: StopId) => {
  const i = STOPS.findIndex((s) => s.id === id);
  return { ...STOPS[i], n: i + 1 };
};
