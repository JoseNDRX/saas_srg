const postcss = require('postcss');
const tailwind = require('@tailwindcss/postcss');
const fs = require('fs');

const css = fs.readFileSync('app/globals.css', 'utf8');
postcss([tailwind()]).process(css, { from: 'app/globals.css' }).then(result => {
  console.log("SUCCESS");
  console.log("Output CSS length:", result.css.length);
  console.log("Contains w-full?", result.css.includes('.w-full') ? "YES" : "NO");
  console.log("Contains flex?", result.css.includes('.flex') ? "YES" : "NO");
}).catch(e => {
  console.error("ERROR", e);
});
