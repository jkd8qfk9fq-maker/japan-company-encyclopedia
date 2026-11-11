/* eslint-disable @typescript-eslint/no-require-imports -- next/font loads this file with require(), so it is CommonJS */
/**
 * What next/font/google would fetch from Google, served from this folder instead (JCE-040). scripts/build-static.mjs
 * sets NEXT_FONT_GOOGLE_MOCKED_RESPONSES to this file; next/font then reads each font file from the absolute path
 * given here. Written by scripts/fonts/vendor-google-fonts.mjs — do not edit responses.json by hand.
 */
const { join } = require("node:path");
const responses = require("./responses.json");

const dir = join(__dirname, "files");
module.exports = Object.fromEntries(Object.entries(responses).map(([url, css]) => [url, css.replaceAll("__FONT_DIR__", dir)]));
