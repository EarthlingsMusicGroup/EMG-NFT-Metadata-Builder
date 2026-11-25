import assert from "node:assert/strict";
import { chooseFormat } from "./audio";
import { explainCheck } from "./checks";
import { BEATBOT } from "./config";
import { resolveFieldTip } from "./tips";
import { isStepShowable, pageFromPath, stepMatchesPage } from "./tour";

assert.equal(
  chooseFormat((mime) => (mime.includes("ogg") ? "probably" : "")),
  "ogg",
);
assert.equal(
  chooseFormat((mime) => (mime.includes("mpeg") ? "maybe" : "")),
  "mp3",
);
assert.equal(chooseFormat(() => ""), "m4a");

assert.equal(pageFromPath("/"), "home");
assert.equal(pageFromPath("/p/abc"), "project");
assert.equal(pageFromPath("/settings"), "settings");

const welcome = BEATBOT.tours[0].steps[0];
assert.equal(stepMatchesPage(welcome, "project"), true);
const start = BEATBOT.tours[0].steps.find((step) => step.id === "start");
assert.ok(start);
assert.equal(stepMatchesPage(start, "home"), true);
assert.equal(stepMatchesPage(start, "project"), false);
assert.equal(
  isStepShowable(start, "home", () => false),
  false,
);
assert.equal(
  isStepShowable(
    { ...start, allowMissing: true },
    "home",
    () => false,
  ),
  true,
);

assert.equal(explainCheck("url", "", {}), null);
assert.equal(explainCheck("url", "https://earthlingsmusic.com", {}), null);
assert.ok(explainCheck("url", "earthlingsmusic.com", {}));
assert.equal(explainCheck("hexColor", "FFFFFF", {}), null);
assert.ok(explainCheck("hexColor", "#FFFFFF", {}));
assert.ok(explainCheck("hexColor", "FFF", {}));
assert.equal(explainCheck("tokenSymbol", "NFT", {}), null);
assert.ok(explainCheck("tokenSymbol", "nft", {}));
assert.equal(explainCheck("nftType", "art.v0", {}), null);
assert.ok(explainCheck("nftType", "art.v1", {})?.includes("art.v0"));
assert.ok(explainCheck("nftType", "nope", {}));
assert.equal(explainCheck("positiveInt", "2", {}), null);
assert.ok(explainCheck("positiveInt", "0", {}));
assert.ok(explainCheck("positiveInt", "1.5", {}));
assert.equal(explainCheck("royalty", "5", { min: 0, max: 10 }), null);
assert.ok(explainCheck("royalty", "11", { min: 0, max: 10 }));
assert.equal(explainCheck("itemImage", "1.png", { chain: "ethereum" }), null);
assert.ok(explainCheck("itemImage", "1.png", { chain: "xrp" }));
assert.equal(
  explainCheck("itemImage", "ipfs://cid", { chain: "xrp" }),
  null,
);
assert.equal(
  explainCheck("evmAddress", "0x" + "ab".repeat(20), {}),
  null,
);
assert.ok(explainCheck("solanaAddress", "0x123", {}));
assert.equal(explainCheck("nearAddress", "alice.near", {}), null);
assert.ok(explainCheck("nearAddress", "Alice.near", {}));
assert.equal(
  explainCheck("isoDate", "2026-11-25T00:00:00.000Z", {}),
  null,
);
assert.ok(explainCheck("isoDate", "2026-11-25", {}));
assert.equal(explainCheck("policyId", "ab".repeat(28), {}), null);
assert.ok(explainCheck("policyId", "abc", {}));
assert.equal(explainCheck("ipfsKey", "", { ipfsOn: false }), null);
assert.ok(explainCheck("ipfsKey", "", { ipfsOn: true }));
assert.equal(explainCheck("ipfsKey", "secret-key", { ipfsOn: true }), null);
assert.equal(
  explainCheck("ipfsKey", "secret-key", { ipfsOn: true })?.includes("secret-key"),
  undefined,
);

const image = resolveFieldTip("item-image", {
  value: "cover.png",
  chain: "xrp",
});
assert.ok(image?.note?.includes("URI"));
assert.equal(image?.text.includes("ipfs://"), true);

const evm = resolveFieldTip("creator-address", {
  value: "nope",
  chain: "polygon",
});
assert.ok(evm?.note?.includes("0x"));
assert.equal(
  resolveFieldTip("creator-address", { value: "", chain: "cardano" })?.note,
  null,
);

const symbol = resolveFieldTip("token-symbol", { value: "", chain: "solana" });
assert.equal(symbol?.note, "Symbol is required on Solana.");

for (const tour of BEATBOT.tours) {
  assert.ok(tour.steps.length > 0);
  for (const step of tour.steps) {
    assert.equal(mentionsMinting(step.text), false);
  }
}
for (const tip of Object.values(BEATBOT.fields)) {
  assert.equal(mentionsMinting(tip.text), false);
  for (const variant of Object.values(tip.byChain ?? {})) {
    assert.equal(mentionsMinting(variant), false);
  }
}

function mentionsMinting(text: string): boolean {
  return /\bmint(?:ing)?\b/i.test(text);
}

console.log("beatbot checks ok");
