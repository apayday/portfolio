// Interactive map: projects, research methods and skills.
// To add a project: add a case study article in index.html, then add a node
// below with type "project", a case id in `to`, and the ids it `uses`.

const KINDS = { project: 'Case study', method: 'Research method', skill: 'Skill' };

const nodes = [
  { id: 'donation', type: 'project', label: 'Donation flow', angle: 270, radius: 24, to: '#case-donation',
    text: '[One sentence on this project and what it shows.]',
    uses: ['interviews', 'affinity', 'frontend', 'a11y'] },
  { id: 'gallery', type: 'project', label: 'Gallery visit', angle: 30, radius: 24, to: '#case-gallery',
    text: '[One sentence on this project and what it shows.]',
    uses: ['interviews', 'testing', 'prototyping'] },
  { id: 'cafe', type: 'project', label: 'Cafe ordering', angle: 150, radius: 24, to: '#case-cafe',
    text: '[One sentence on this project and what it shows.]',
    uses: ['testing', 'frontend', 'a11y', 'prototyping'] },

  { id: 'interviews', type: 'method', label: 'Interviews', angle: 0, radius: 41,
    text: '[How you run and analyse interviews, and what you look for.]' },
  { id: 'affinity', type: 'method', label: 'Affinity mapping', angle: 60, radius: 41,
    text: '[How you turn notes into themes and insights.]' },
  { id: 'testing', type: 'method', label: 'Usability testing', angle: 120, radius: 41,
    text: '[How you test with real people and act on what you find.]' },
  { id: 'frontend', type: 'skill', label: 'HTML, CSS, JS', angle: 180, radius: 41,
    text: '[What you build in code and how you keep it accessible.]' },
  { id: 'a11y', type: 'skill', label: 'Accessibility', angle: 240, radius: 41,
    text: '[How you design and test for access from the start.]' },
  { id: 'prototyping', type: 'skill', label: 'Prototyping', angle: 300, radius: 41,
    text: '[Tools and fidelity you use to test ideas quickly.]' }
];

const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
const position = n => {
  const rad = (n.angle * Math.PI) / 180;
  return { x: 50 + n.radius * Math.cos(rad), y: 50 + n.radius * Math.sin(rad) };
};

const map = document.getElementById('map');
const panelTitle = document.getElementById('panel-title');
const panelText = document.getElementById('panel-text');
const panelLinks = document.getElementById('panel-links');
const SVG_NS = 'http://www.w3.org/2000/svg';

// Lines
const svg = document.createElementNS(SVG_NS, 'svg');
svg.setAttribute('class', 'lines');
svg.setAttribute('viewBox', '0 0 100 100');
svg.setAttribute('aria-hidden', 'true');
const lines = [];
const addLine = (a, b) => {
  const line = document.createElementNS(SVG_NS, 'line');
  line.setAttribute('class', 'link');
  line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
  line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
  svg.appendChild(line);
  lines.push({ el: line, ids: [a.id, b.id] });
};
const centre = { id: 'core', x: 50, y: 50 };
nodes.forEach(n => {
  const p = position(n);
  n.x = p.x; n.y = p.y;
});
nodes.filter(n => n.type === 'project').forEach(n => {
  addLine(centre, n);
  n.uses.forEach(id => addLine(n, byId[id]));
});
map.appendChild(svg);

// Core
const core = document.createElement('div');
core.className = 'core';
core.innerHTML = '<svg class="mark" viewBox="0 0 124 100" aria-hidden="true"><use href="#ap-mark"/></svg>';
map.appendChild(core);

// Nodes
const buttons = {};
nodes.forEach(n => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `node node--${n.type}`;
  b.style.left = `${n.x}%`;
  b.style.top = `${n.y}%`;
  b.textContent = n.label;
  b.setAttribute('aria-pressed', 'false');
  b.setAttribute('aria-label', `${n.label}, ${KINDS[n.type].toLowerCase()}`);
  b.addEventListener('click', () => setActive(map.dataset.active === n.id ? null : n.id));
  map.appendChild(b);
  buttons[n.id] = b;
});

const related = id => {
  const n = byId[id];
  if (n.type === 'project') return n.uses;
  return nodes.filter(p => p.type === 'project' && p.uses.includes(id)).map(p => p.id);
};

function setActive(id) {
  map.dataset.active = id || '';
  const on = id ? new Set([id, ...related(id)]) : new Set();
  nodes.forEach(n => {
    buttons[n.id].classList.toggle('is-on', on.has(n.id));
    buttons[n.id].setAttribute('aria-pressed', String(n.id === id));
  });
  lines.forEach(l => l.el.classList.toggle('is-on', !!id && l.ids.includes(id)));

  panelLinks.textContent = '';
  if (!id) {
    panelTitle.textContent = 'Explore the map';
    panelText.textContent = 'Select a node to see how a project, a method and a skill connect. Press Escape to reset.';
    return;
  }
  const n = byId[id];
  panelTitle.textContent = n.label;
  panelText.textContent = `${KINDS[n.type]}. ${n.text}`;
  const names = related(id).map(r => byId[r].label).join(', ');
  panelLinks.textContent = `${n.type === 'project' ? 'Uses' : 'Appears in'}: ${names}. `;
  if (n.to) {
    const a = document.createElement('a');
    a.href = n.to;
    a.textContent = 'Read this case study';
    panelLinks.appendChild(a);
  }
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') setActive(null); });
document.getElementById('year').textContent = new Date().getFullYear();
