import Color from 'color';

const colorHex = /.?((?:\#|\b0x)([a-f0-9]{6}([a-f0-9]{2})?|[a-f0-9]{3}([a-f0-9]{1})?))\b/gi;

/**
 * @export
 * @param {string} text
 * @returns {{
 *  start: number,
 *  end: number,
 *  color: string
 * }}
 */
export async function findHex(text) {
  let match = colorHex.exec(text);
  let result = [];

  while (match !== null) {
    const firstChar = match[0][0];
    const matchedColor = match[1];
    const start = match.index + (match[0].length - matchedColor.length);
    const end = colorHex.lastIndex;


    // Check the symbol before the color match, and try to avoid coloring in the
    // contexts that are not relevant
    // https://github.com/sergiirocks/vscode-ext-color-highlight/issues/25
    if (firstChar.length && /\w/.test(firstChar)) {
      match = colorHex.exec(text);
      continue;
    }

    try {
      let alphaInt = 1;
      let matchedHex = '#' + match[2];
      if (match[2].length == 8) {
        alphaInt = Math.round(parseInt(match[2].substring(0, 2), 16) * 100 / 255) / 100; // Get first 2 characters, convert to decimal
        matchedHex = '#' + match[2].substring(2);
      }
      const color = Color(matchedHex).alpha(alphaInt)
        .rgb()
        .string();

      result.push({
        start,
        end,
        color
      });
    } catch (e) { }

    match = colorHex.exec(text);
  }

  return result;
}
