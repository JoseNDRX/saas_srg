const http = require('http');

http.get('http://localhost:3000', (res) => {
  let html = '';
  res.on('data', d => html += d);
  res.on('end', () => {
    // 1. Fetch CSS
    const cssMatches = html.match(/href="([^"\\\n]*\.css)"/g);
    if (!cssMatches) return console.log('NO CSS FOUND');
    const cssUrl = cssMatches[0].match(/href="([^"]+)"/)[1];
    
    http.get('http://localhost:3000' + cssUrl, (resCSS) => {
       let css='';
       resCSS.on('data', d=> css+=d);
       resCSS.on('end', () => {
          // 2. Check if the body has a class in the HTML, and check if it's in the CSS
          console.log("HTML length:", html.length)
          const classMatch = html.match(/class="([^"]+)"/g);
          console.log("Sample classes on page:", classMatch ? classMatch.slice(0, 5) : 'none');
          
          console.log("CSS Check - .bg-zinc-950:", css.includes(".bg-zinc-950"));
          console.log("CSS Check - var(--bg-base):", css.includes("--bg-base"));
          console.log("CSS Check - @custom-variant:", css.includes("custom-variant"));
       });
    });
  });
});
