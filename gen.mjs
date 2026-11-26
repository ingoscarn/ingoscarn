// Generates the SVG banner and cards for the personal profile README.
import { writeFileSync, mkdirSync } from 'node:fs';

const out = new URL('./assets/', import.meta.url);
mkdirSync(out, { recursive: true });
const SANS = "'Segoe UI', -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// ---------- banner: data flows through a pipeline and lands as stacked blocks ----------
const stages = ['ingest', 'transform', 'orchestrate', 'serve'];
const sx = (i) => 760 + i * 120;
let pipe = '';
stages.forEach((s, i) => {
  pipe += `<g transform="translate(${sx(i)} 150)">
    <rect x="-44" y="-22" width="88" height="44" rx="12" fill="#ffffff" fill-opacity=".04" stroke="url(#t)" stroke-opacity=".7"/>
    <text y="5" text-anchor="middle" font-family="${MONO}" font-size="12" fill="#c9cbe0">${s}</text>
    <circle r="3" cy="-22" fill="#22d3ee"><animate attributeName="opacity" values=".2;1;.2" dur="2s" begin="${i * 0.5}s" repeatCount="indefinite"/></circle>
  </g>`;
});
pipe += `<path id="p" d="M700 150 H1180 V250" fill="none" stroke="#ffffff" stroke-opacity=".12" stroke-width="2" stroke-dasharray="3 6"/>`;
const cols = ['#22d3ee', '#a855f7', '#f472b6', '#34d399'];
for (let i = 0; i < 8; i++) {
  pipe += `<rect x="-5" y="-5" width="10" height="10" rx="2.5" fill="${cols[i % 4]}">
    <animateMotion dur="4s" begin="${(i * 0.5).toFixed(1)}s" repeatCount="indefinite"><mpath href="#p"/></animateMotion>
    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.9;1" dur="4s" begin="${(i * 0.5).toFixed(1)}s" repeatCount="indefinite"/></rect>`;
}
// the stack the data lands on
[[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[3,1],[0,2]].forEach(([x, y], i) => {
  pipe += `<rect x="${1128 + x * 26}" y="${300 - y * 26}" width="23" height="23" rx="4" fill="${cols[i % 4]}" opacity=".55"/>`;
});

const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="360" viewBox="0 0 1280 360">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#07080f"/><stop offset=".6" stop-color="#0f0b24"/><stop offset="1" stop-color="#06171f"/></linearGradient>
  <linearGradient id="t" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#22d3ee"/><stop offset=".5" stop-color="#a855f7"/><stop offset="1" stop-color="#f472b6"/>
    <animateTransform attributeName="gradientTransform" type="translate" values="-.3 0;.3 0;-.3 0" dur="9s" repeatCount="indefinite"/>
  </linearGradient>
  <radialGradient id="g1" cx=".15" cy=".2" r=".6"><stop offset="0" stop-color="#a855f7" stop-opacity=".3"/><stop offset="1" stop-color="#a855f7" stop-opacity="0"/></radialGradient>
  <radialGradient id="g2" cx=".9" cy=".9" r=".5"><stop offset="0" stop-color="#22d3ee" stop-opacity=".25"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></radialGradient>
  <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#ffffff" fill-opacity=".06"/></pattern>
  <clipPath id="c"><rect width="1280" height="360" rx="24"/></clipPath>
</defs>
<style>.cur{animation:b 1.1s steps(1) infinite}@keyframes b{50%{opacity:0}}</style>
<g clip-path="url(#c)">
  <rect width="1280" height="360" fill="url(#bg)"/><rect width="1280" height="360" fill="url(#grid)"/>
  <rect width="1280" height="360" fill="url(#g1)"/><rect width="1280" height="360" fill="url(#g2)"/>
  <text x="72" y="118" font-family="${MONO}" font-size="16" fill="#22d3ee">$ whoami<tspan class="cur">_</tspan></text>
  <text x="70" y="190" font-family="${SANS}" font-size="68" font-weight="800" fill="url(#t)">Oscar Nuñez</text>
  <text x="72" y="236" font-family="${SANS}" font-size="22" fill="#e6e7f5">Senior Data Engineer · Full Stack · Technical Founder</text>
  <text x="72" y="276" font-family="${MONO}" font-size="15" fill="#8d92b8">pipelines by day · games by night · CDMX</text>
  ${pipe}
  <rect x=".5" y=".5" width="1279" height="359" rx="24" fill="none" stroke="url(#t)" stroke-opacity=".45"/>
</g>
</svg>`;
writeFileSync(new URL('banner.svg', out), banner);

// ---------- cards ----------
function card({ id, kicker, name, lines, stack, url, a, b, w = 640, h = 280 }) {
  const pillW = 38 + kicker.length * 8.8;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0b16"/><stop offset="1" stop-color="#11132a"/></linearGradient>
  <linearGradient id="bd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
  <radialGradient id="gl" cx=".95" cy=".1" r=".8"><stop offset="0" stop-color="${a}" stop-opacity=".22"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></radialGradient>
</defs>
<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="22" fill="url(#bg)"/>
<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="22" fill="url(#gl)"/>
<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="22" fill="none" stroke="url(#bd)" stroke-opacity=".7" stroke-width="1.5"/>
<g transform="translate(34 32)">
  <rect width="${pillW}" height="26" rx="13" fill="${a}" fill-opacity=".14" stroke="${a}" stroke-opacity=".5"/>
  <circle cx="15" cy="13" r="4" fill="${a}"><animate attributeName="opacity" values="1;.3;1" dur="1.8s" repeatCount="indefinite"/></circle>
  <text x="27" y="17.5" font-family="${MONO}" font-size="12" font-weight="700" letter-spacing="1.5" fill="${a}">${esc(kicker)}</text>
</g>
<text x="34" y="108" font-family="${SANS}" font-size="40" font-weight="800" fill="#f4f4fb">${esc(name)}</text>
${lines.map((l, i) => `<text x="34" y="${146 + i * 26}" font-family="${SANS}" font-size="18" fill="#b9bcd6">${esc(l)}</text>`).join('\n')}
<text x="34" y="${h - 28}" font-family="${MONO}" font-size="13" fill="${a}">${esc(stack)}</text>
<text x="${w - 34}" y="${h - 28}" text-anchor="end" font-family="${MONO}" font-size="13" fill="#7c81a6">${url ? esc(url) + ' ↗' : ''}</text>
</svg>`;
  writeFileSync(new URL(`${id}.svg`, out), svg);
}

card({ id: 'hireabl3', kicker: 'NOW', name: 'Hireabl3', a: '#22d3ee', b: '#3b82f6', url: 'hireabl3.tech',
  lines: ['Architecting event-driven platforms.', 'Zero-data retention, sub-30s processing,', 'serverless AWS, IaC with Pulumi.'], stack: 'Technical Founder' });
card({ id: 'dantemma', kicker: 'NOW', name: 'Dantemma Interactive', a: '#a855f7', b: '#f472b6',
  lines: ['A small studio building games and', 'interactive products. Real-time 3D,', 'sound and the web.'], stack: 'games · interactive products' });

const focus = [
  { id: 'f-data', kicker: 'DATA', name: 'Data engineering', a: '#22d3ee', b: '#34d399',
    lines: ['Reliable pipelines, ELT at scale,', 'data contracts and orchestration', 'that people can trust.'], stack: 'Airbyte · dbt · Dagster · Airflow · PostgreSQL' },
  { id: 'f-cloud', kicker: 'CLOUD', name: 'Cloud architecture', a: '#60a5fa', b: '#a855f7',
    lines: ['Serverless-first and event-driven.', 'AWS native, Lambda + SAM,', 'microservices that scale down too.'], stack: 'AWS · Lambda · SAM · Cloudflare' },
  { id: 'f-full', kicker: 'FULL STACK', name: 'Full stack', a: '#f472b6', b: '#fb923c',
    lines: ['TypeScript and Node.js, FastAPI', 'backends, React fronts. APIs that', 'hold up under real load.'], stack: 'TypeScript · Node.js · Python · React' },
  { id: 'f-iac', kicker: 'IAC', name: 'Infrastructure as code', a: '#c084fc', b: '#22d3ee',
    lines: ['Pulumi for everything infrastructure.', 'Repeatable environments, CI/CD,', 'deploys nobody runs by hand.'], stack: 'Pulumi · GitHub Actions' },
  { id: 'f-ai', kicker: 'AI', name: 'AI and agents', a: '#34d399', b: '#facc15',
    lines: ['LLMs in the cloud and on local', 'hardware. Multi-agent workflows,', 'tooling and evaluation.'], stack: 'Ollama · LangGraph · CrewAI' },
  { id: 'f-3d', kicker: 'CRAFT', name: 'Real-time 3D', a: '#fb7185', b: '#a855f7',
    lines: ['Interactive graphics and audio', 'in the browser. Shaders, particles', 'and sound that respond to you.'], stack: 'Three.js · WebGL · Web Audio' },
];
focus.forEach((m) => card(m));

// ---------- career path ----------
const steps = [['Telecom', ''], ['Fintech', ''], ['AI', ''], ['Founder', '']];
const px = (i) => 140 + i * 333;
let path = `<line x1="${px(0)}" y1="90" x2="${px(3)}" y2="90" stroke="#ffffff" stroke-opacity=".12" stroke-width="2"/>
<line x1="${px(0)}" y1="90" x2="${px(3)}" y2="90" stroke="url(#t)" stroke-width="2.5" stroke-dasharray="1000" stroke-dashoffset="1000"><animate attributeName="stroke-dashoffset" values="1000;0;0" keyTimes="0;.6;1" dur="5s" repeatCount="indefinite"/></line>
<circle r="5" cy="90" fill="#ffffff"><animate attributeName="cx" values="${px(0)};${px(3)};${px(3)}" keyTimes="0;.6;1" dur="5s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0" keyTimes="0;.6;.7" dur="5s" repeatCount="indefinite"/></circle>`;
steps.forEach(([t, s], i) => {
  path += `<circle cx="${px(i)}" cy="90" r="11" fill="#0a0b16" stroke="url(#t)" stroke-width="2.5"/>
<circle cx="${px(i)}" cy="90" r="4" fill="${['#22d3ee', '#60a5fa', '#a855f7', '#f472b6'][i]}"/>
<text x="${px(i)}" y="140" text-anchor="middle" font-family="${SANS}" font-size="22" font-weight="700" fill="#f4f4fb">${t}</text>
<text x="${px(i)}" y="166" text-anchor="middle" font-family="${MONO}" font-size="13" fill="#8d92b8">${s}</text>`;
});
writeFileSync(new URL('career.svg', out), `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="180" viewBox="0 0 1280 180">
<defs><linearGradient id="t" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#22d3ee"/><stop offset=".5" stop-color="#a855f7"/><stop offset="1" stop-color="#f472b6"/></linearGradient>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0b16"/><stop offset="1" stop-color="#11132a"/></linearGradient></defs>
<rect x="1" y="1" width="1278" height="178" rx="22" fill="url(#bg)" stroke="url(#t)" stroke-opacity=".45"/>
<text x="40" y="44" font-family="${MONO}" font-size="13" letter-spacing="1.5" fill="#22d3ee">10+ YEARS</text>
${path}
</svg>`);
[
  { id: 'oss-local-code-team', kicker: 'OPEN SOURCE', name: 'local-code-team-poc', a: '#60a5fa', b: '#a855f7', url: 'ingoscarn/local-code-team-poc',
    lines: ['Multi-agent code generation on', 'local LLMs: Aider vs CrewAI vs', 'LangGraph, all on Ollama.'], stack: 'Python · Ollama · LangGraph' },
  { id: 'oss-spinner-verbs', kicker: 'OPEN SOURCE', name: 'slack-spinner-verbs', a: '#f472b6', b: '#facc15', url: 'ingoscarn/slack-status-spinner-verbs',
    lines: ['Your Slack status as a thinking', 'spinner: Thinking..., Reasoning...,', 'rotating locally, your way.'], stack: 'Python · Slack API' },
].forEach((m) => card(m));

// ---------- stack: grouped pills, one column per area ----------
const groups = [
  ['LANGUAGES', '#22d3ee', [['TypeScript', '#3178c6'], ['Python', '#3776ab'], ['Node.js', '#5fa04e'], ['SQL', '#e38c00']]],
  ['DATA', '#34d399', [['Airbyte', '#615eff'], ['dbt', '#ff694b'], ['Dagster', '#a6a8ff'], ['Airflow', '#017cee'], ['PostgreSQL', '#4169e1']]],
  ['CLOUD + IAC', '#a855f7', [['AWS', '#ff9900'], ['Lambda + SAM', '#ff9900'], ['Cloudflare', '#f38020'], ['Pulumi', '#8a3391'], ['GitHub Actions', '#2088ff']]],
  ['PRODUCT', '#f472b6', [['React', '#61dafb'], ['FastAPI', '#009688'], ['Three.js', '#ffffff'], ['Ollama', '#ffffff']]],
];
const gw = 300, rowH = 46, top = 92;
const sh = top + Math.max(...groups.map((g) => g[2].length)) * rowH + 24;
let st = '';
groups.forEach(([title, accent, items], gi) => {
  const x = 40 + gi * gw;
  st += `<text x="${x}" y="64" font-family="${MONO}" font-size="13" font-weight="700" letter-spacing="2" fill="${accent}">${title}</text>
<line x1="${x}" y1="76" x2="${x + gw - 40}" y2="76" stroke="${accent}" stroke-opacity=".35"/>`;
  items.forEach(([name, c], i) => {
    const y = top + i * rowH, w = 46 + name.length * 9.4 + (name.match(/[A-Z]/g) || []).length * 2.5;
    st += `<g transform="translate(${x} ${y})">
  <rect width="${w}" height="34" rx="17" fill="#ffffff" fill-opacity=".045" stroke="#ffffff" stroke-opacity=".1"/>
  <circle cx="17" cy="17" r="5" fill="${c}"><animate attributeName="r" values="5;6.5;5" dur="2.6s" begin="${((gi * 5 + i) * 0.23).toFixed(2)}s" repeatCount="indefinite"/></circle>
  <text x="31" y="22.5" font-family="${SANS}" font-size="16" fill="#e6e7f5">${esc(name)}</text>
</g>`;
  });
});
writeFileSync(new URL('stack.svg', out), `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="${sh}" viewBox="0 0 1280 ${sh}">
<defs><linearGradient id="t" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#22d3ee"/><stop offset=".5" stop-color="#a855f7"/><stop offset="1" stop-color="#f472b6"/>
<animateTransform attributeName="gradientTransform" type="translate" values="-.3 0;.3 0;-.3 0" dur="9s" repeatCount="indefinite"/></linearGradient>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0b16"/><stop offset="1" stop-color="#11132a"/></linearGradient></defs>
<rect x="1" y="1" width="1278" height="${sh - 2}" rx="22" fill="url(#bg)" stroke="url(#t)" stroke-opacity=".45"/>
${st}
</svg>`);
console.log('ok');
