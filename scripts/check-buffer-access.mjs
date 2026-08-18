#!/usr/bin/env node

// Status-only probe of the Buffer personal access key. Prints whether the key
// resolves and which organization it reaches; never prints the key. Exits
// non-zero on any failure so a caller cannot read a refusal as a pass.

import {probeBufferApi, BUFFER_ORGANIZATION_ID} from "./lib/buffer-api.mjs";

const result = await probeBufferApi();

if (result.ok) {
  console.log(`Buffer API: ok (200) — ${result.organizationName} (${result.organizationId})`);
  process.exit(0);
}

console.error(`Buffer API: FAILED${result.status ? ` (${result.status})` : ""}`);
console.error(result.message);
console.error(`Expected organization: ${BUFFER_ORGANIZATION_ID}`);
process.exit(1);
