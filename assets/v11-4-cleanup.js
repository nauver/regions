
(function(){
  function cleanLeafletAttribution(){
    document.querySelectorAll('.leaflet-control-attribution').forEach(function(box){
      box.querySelectorAll('a').forEach(function(a){
        var href = (a.getAttribute('href') || '').toLowerCase();
        var text = (a.textContent || '').toLowerCase();
        var title = (a.getAttribute('title') || '').toLowerCase();
        if(href.includes('leafletjs.com') || href.includes('leaflet.com') || text.includes('leaflet') || title.includes('leaflet')){
          a.remove();
        }
      });
      Array.from(box.childNodes).forEach(function(node){
        if(node.nodeType === Node.TEXT_NODE){
          node.textContent = node.textContent
            .replace(/\bLeaflet\b/gi, '')
            .replace(/^\s*[|·,-]+\s*/, '')
            .replace(/\s*[|·,-]+\s*$/,'')
            .replace(/\s{2,}/g, ' ');
        }
      });
      box.innerHTML = box.innerHTML
        .replace(/\s*\|\s*\|\s*/g, ' | ')
        .replace(/(^|>)\s*[|·,-]+\s*/g, '$1')
        .replace(/\s*[|·,-]+\s*(<|$)/g, '$1');
    });
  }
  cleanLeafletAttribution();
  setInterval(cleanLeafletAttribution, 500);
})();
