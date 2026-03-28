const http = require('http');

http.get('http://localhost:3000', (res) => {
  let html = '';
  res.on('data', d => html += d);
  res.on('end', () => {
    const cssMatches = html.match(/href="([^"\\\n]*\.css)"/g);
    if (!cssMatches) return console.log('NO CSS');
    const cssUrl = cssMatches[0].match(/href="([^"]+)"/)[1];
    
    http.get('http://localhost:3000' + cssUrl, (resCSS) => {
       let css='';
       resCSS.on('data', d=> css+=d);
       resCSS.on('end', () => {
          console.log("CSS Length:", css.length);
          console.log("Has w-full:", css.includes(".w-full"));
          console.log("Has flex:", css.includes(".flex"));
          console.log("Has items-center:", css.includes(".items-center"));
          console.log("Has text-center:", css.includes(".text-center"));
          console.log("Has min-h-dvh:", css.includes(".min-h-dvh"));
       });
    });
  });
});
