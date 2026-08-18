// The weekly hold, made machine-readable.
//
// "Any agent may hold. Only the founder may resume." That rule was written in
// prose and checked by an agent reading a document and forming a judgement,
// while the three other preconditions of the note tasks were mechanical. This
// reads one marker line out of docs/technical/operating-cadence.md.
//
// It fails closed. A marker that has gone missing is an error, not a quiet
// "no hold" — otherwise deleting the line would disable the brake and nothing
// would report it.

export const HOLD_MARKER_LABEL = 'Active hold';

const MARKER = new RegExp(String.raw`^\*\*${HOLD_MARKER_LABEL}:\*\*(.*)$`, 'gm');

/** @returns {{held: boolean, reason: string}} */
export function parseHold(markdown) {
  const matches = [...String(markdown).matchAll(MARKER)];
  if (matches.length === 0) {
    throw new Error(
      `Found no "**${HOLD_MARKER_LABEL}:**" marker. The hold check cannot pass without it; restore the line rather than removing the check.`,
    );
  }
  if (matches.length > 1) {
    throw new Error(`Found more than one "**${HOLD_MARKER_LABEL}:**" marker; exactly one is allowed.`);
  }

  const reason = matches[0][1].trim();
  if (reason.length === 0) throw new Error(`The "**${HOLD_MARKER_LABEL}:**" marker is empty; write "none" or the reason.`);
  return { held: reason.replace(/\.$/, '').toLowerCase() !== 'none', reason };
}
