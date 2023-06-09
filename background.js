chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: unblock
  });
});

function unblock() {
  for (let node of [document.body, document.body.parentNode]) {
    node.style.setProperty('overflow', 'auto', 'important');
    node.style.setProperty('overflow-y', 'auto', 'important');
  }
  let elements = [...document.body.childNodes];
  while (elements.length) {
    let next = elements.shift();
    if (next.nodeType !== Element.ELEMENT_NODE) { continue; }
    if (!document.body.contains(next)) { continue; }
    elements.push(...next.childNodes);
    let style = getComputedStyle(next);
    if (style.filter.match(/blur/)) { 
      next.style.setProperty('filter', 'none', 'important'); 
    }
    if (style['position'] !== 'fixed') { continue; }
    let rect = next.getBoundingClientRect();
    if (rect.width/window.innerWidth < 0.9) { continue; }
    if (rect.height/window.innerHeight < 0.9) { continue; }
    next.parentNode.removeChild(next);
  }
}
