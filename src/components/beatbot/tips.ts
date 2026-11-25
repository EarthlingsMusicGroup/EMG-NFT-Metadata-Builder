import { explainCheck, type CheckExtra, type CheckName } from "./checks";
import { BEATBOT, chainGroup, tipText, type FieldTip } from "./config";

export type ResolvedTip = {
  id: string;
  text: string;
  note: string | null;
};

export type FieldReading = {
  value: string;
  chain: string | null;
  min?: number;
  max?: number;
  ipfsOn?: boolean;
};

export function resolveFieldTip(
  fieldId: string,
  reading: FieldReading,
): ResolvedTip | null {
  const tip = BEATBOT.fields[fieldId];
  if (!tip) return null;
  const check = checkFor(fieldId, tip, reading.chain);
  const extra: CheckExtra = {
    required: tip.required,
    requiredNote: tip.requiredNote,
    chain: reading.chain,
    min: reading.min,
    max: reading.max,
    ipfsOn: reading.ipfsOn,
  };
  const empty = reading.value.trim() === "";
  let note: string | null = null;
  if (empty && tip.required) {
    note = tip.requiredNote ?? "This field is required.";
  } else if (check) {
    note = explainCheck(check, reading.value, extra);
  }
  return {
    id: fieldId,
    text: tipText(tip, reading.chain),
    note,
  };
}

function checkFor(
  fieldId: string,
  tip: FieldTip,
  chain: string | null,
): CheckName | undefined {
  if (fieldId !== "creator-address") return tip.check;
  if (!chain) return undefined;
  if (BEATBOT.addressChecks[chain]) return BEATBOT.addressChecks[chain];
  const group = chainGroup(chain);
  if (group && BEATBOT.addressChecks[group]) return BEATBOT.addressChecks[group];
  return undefined;
}
