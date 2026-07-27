// fix-base-path.js
// Patches dist/index.html so absolute asset paths include the GitHub Pages repo subpath.
// Run this AFTER every `npx expo export --platform web`.
//
// Usage:
//   node fix-base-path.js
//
// Place this file in your `mobile` folder.

const fs = require("fs");
const path = require("path");

const BASE_PATH = "/Wallet-Expense-Tracker"; // change if your repo name changes
const DIST_DIR = path.join(__dirname, "dist");
const INDEX_PATH = path.join(DIST_DIR, "index.html");

if (!fs.existsSync(INDEX_PATH)) {
  console.error(`Could not find ${INDEX_PATH}. Did you run "expo export --platform web" first?`);
  process.exit(1);
}

let html = fs.readFileSync(INDEX_PATH, "utf8");

// Prepend BASE_PATH to any src="/..." or href="/..." that doesn't already have it.
const before = html;
html = html.replace(/(src|href)="\/(?!Wallet-Expense-Tracker)/g, `$1="${BASE_PATH}/`);

fs.writeFileSync(INDEX_PATH, html, "utf8");

if (html !== before) {
  console.log(`Patched asset paths in ${INDEX_PATH} with base path "${BASE_PATH}".`);
} else {
  console.log("No changes made — paths may already be correct, or none matched.");
}

// Also ensure .nojekyll exists so GitHub Pages doesn't ignore the _expo folder.
const nojekyllPath = path.join(DIST_DIR, ".nojekyll");
if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, "");
  console.log("Created .nojekyll in dist/.");
}