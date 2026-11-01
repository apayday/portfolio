// Build the Village: selecting a node fills the "Selected" panel and highlights its link.
// Replace the bracketed placeholder copy with your own findings.
(function () {
  var NODES = {
    'interviews':    { name: 'Interviews',       quote: '“[A short participant quote or finding.]”',          used: 'Used in: [Project A], [Project B]', href: 'index.html#research' },
    'affinity':      { name: 'Affinity mapping', quote: '“[The theme that emerged from your synthesis.]”',     used: 'Used in: [Project A]',              href: 'index.html#insight' },
    'frontend':      { name: 'Front-end code',   quote: '[What you built and the tech behind it.]',           used: 'Used in: [Project A], [Project B]', href: 'index.html#code' },
    'accessibility': { name: 'Accessibility',    quote: '[An accessibility check or fix you made.]',          used: 'Used in: [Project B]',              href: 'index.html#design' },
    'project-a':     { name: '[Project A]',      quote: '[One-line summary of the project and its outcome.]', used: 'Methods: Interviews, Affinity mapping', href: 'index.html#case' },
    'project-b':     { name: '[Project B]',      quote: '[One-line summary of the project and its outcome.]', used: 'Methods: Interviews, Accessibility',    href: 'index.html#case' }
  };

  var nodes = document.querySelectorAll('.village .node[data-id]');
  var edges = document.querySelectorAll('.village .edge');
  var out = {
    name: document.getElementById('sel-name'),
    quote: document.getElementById('sel-quote'),
    used: document.getElementById('sel-used'),
    link: document.getElementById('sel-link')
  };

  function select(id) {
    var d = NODES[id];
    if (!d) return;
    out.name.textContent = d.name;
    out.quote.textContent = d.quote;
    out.used.textContent = d.used;
    out.link.href = d.href;
    nodes.forEach(function (n) {
      var on = n.dataset.id === id;
      n.classList.toggle('is-active', on);
      n.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    edges.forEach(function (e) { e.classList.toggle('is-active', e.dataset.to === id); });
  }

  nodes.forEach(function (n) {
    n.addEventListener('click', function () { select(n.dataset.id); });
    n.addEventListener('mouseenter', function () { select(n.dataset.id); });
    n.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(n.dataset.id); }
    });
  });

  select('interviews');
})();
