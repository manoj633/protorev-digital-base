const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const assetsDir = path.join(__dirname, '..', 'public', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#B9B3A0" stroke-width="0.75" opacity="0.6" />
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="#ECE7DA" />
  <rect width="1200" height="630" fill="url(#grid)" />

  <!-- Outer Drawing Frame -->
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="#11130F" stroke-width="2" />

  <!-- Corner Registration Marks -->
  <!-- Top Left -->
  <circle cx="24" cy="24" r="12" fill="none" stroke="#B9B3A0" stroke-width="1.5" />
  <line x1="12" y1="24" x2="36" y2="24" stroke="#11130F" stroke-width="1.5" />
  <line x1="24" y1="12" x2="24" y2="36" stroke="#11130F" stroke-width="1.5" />
  
  <!-- Top Right -->
  <circle cx="1176" cy="24" r="12" fill="none" stroke="#B9B3A0" stroke-width="1.5" />
  <line x1="1164" y1="24" x2="1188" y2="24" stroke="#11130F" stroke-width="1.5" />
  <line x1="1176" y1="12" x2="1176" y2="36" stroke="#11130F" stroke-width="1.5" />

  <!-- Bottom Left -->
  <circle cx="24" cy="606" r="12" fill="none" stroke="#B9B3A0" stroke-width="1.5" />
  <line x1="12" y1="606" x2="36" y2="606" stroke="#11130F" stroke-width="1.5" />
  <line x1="24" y1="594" x2="24" y2="618" stroke="#11130F" stroke-width="1.5" />

  <!-- Bottom Right -->
  <circle cx="1176" cy="606" r="12" fill="none" stroke="#B9B3A0" stroke-width="1.5" />
  <line x1="1164" y1="606" x2="1188" y2="606" stroke="#11130F" stroke-width="1.5" />
  <line x1="1176" y1="594" x2="1176" y2="618" stroke="#11130F" stroke-width="1.5" />

  <!-- Title Block Header Bar -->
  <rect x="24" y="24" width="1152" height="68" fill="#E0DACA" stroke="#11130F" stroke-width="1.5" />
  <line x1="340" y1="24" x2="340" y2="92" stroke="#11130F" stroke-width="1.5" />
  <line x1="560" y1="24" x2="560" y2="92" stroke="#11130F" stroke-width="1.5" />
  <line x1="760" y1="24" x2="760" y2="92" stroke="#11130F" stroke-width="1.5" />
  <line x1="980" y1="24" x2="980" y2="92" stroke="#11130F" stroke-width="1.5" />

  <!-- Cell 1: Studio Brand -->
  <text x="48" y="52" font-family="serif" font-size="20" font-weight="700" fill="#11130F">PROTOREV DIGITAL</text>
  <text x="48" y="74" font-family="monospace" font-size="10" fill="#2A2D26" letter-spacing="1">ENGINEERING SPECIFICATION</text>

  <!-- Cell 2: Drawing Sheet -->
  <text x="358" y="48" font-family="monospace" font-size="9" fill="#2A2D26" letter-spacing="1">DRAWING</text>
  <text x="358" y="72" font-family="monospace" font-size="14" font-weight="700" fill="#11130F">SHEET 01 OF 06</text>

  <!-- Cell 3: Revision -->
  <text x="578" y="48" font-family="monospace" font-size="9" fill="#2A2D26" letter-spacing="1">REVISION</text>
  <text x="578" y="72" font-family="monospace" font-size="14" font-weight="700" fill="#11130F">REV A</text>

  <!-- Cell 4: Release Date -->
  <text x="778" y="48" font-family="monospace" font-size="9" fill="#2A2D26" letter-spacing="1">RELEASE DATE</text>
  <text x="778" y="72" font-family="monospace" font-size="14" font-weight="700" fill="#11130F">10 OCT 2026</text>

  <!-- Cell 5: Status -->
  <text x="998" y="48" font-family="monospace" font-size="9" fill="#2A2D26" letter-spacing="1">SYSTEM STATUS</text>
  <text x="998" y="72" font-family="monospace" font-size="13" font-weight="700" fill="#B8310F">ACTIVE BLUEPRINT</text>

  <!-- Main Hero Content -->
  <!-- Badges -->
  <rect x="64" y="136" width="160" height="26" fill="#ECE7DA" stroke="#11130F" stroke-width="1" rx="2" />
  <text x="76" y="153" font-family="monospace" font-size="10" font-weight="600" fill="#11130F" letter-spacing="0.5">[SPEC: MASTER SHEET]</text>

  <rect x="236" y="136" width="220" height="26" fill="#ECE7DA" stroke="#2E6F5E" stroke-width="1" rx="2" />
  <text x="248" y="153" font-family="monospace" font-size="10" font-weight="600" fill="#2E6F5E" letter-spacing="0.5">[OPEN REFERENCE BUILDS]</text>

  <!-- Main Headline -->
  <text x="64" y="235" font-family="serif" font-size="54" font-weight="700" fill="#11130F" letter-spacing="-1">Websites that rank.</text>
  <text x="64" y="298" font-family="serif" font-size="54" font-weight="700" fill="#11130F" letter-spacing="-1">Workflows that <tspan font-style="italic" fill="#B8310F">run</tspan>.</text>

  <!-- Statement -->
  <text x="64" y="352" font-family="sans-serif" font-size="20" fill="#2A2D26">A new studio for web architecture, technical SEO, marketing ops, and n8n workflows.</text>
  <text x="64" y="382" font-family="sans-serif" font-size="17" fill="#2A2D26">Zero invented data. Every deliverable is an inspectable reference blueprint.</text>

  <!-- Technical Node Representation Box -->
  <rect x="64" y="425" width="1072" height="104" fill="#11130F" stroke="#2A2D26" stroke-width="1" rx="2" />
  
  <!-- Flow Nodes inside Dark Ink Box -->
  <!-- Node 1 -->
  <rect x="88" y="447" width="180" height="60" fill="#11130F" stroke="#B9B3A0" stroke-width="1" rx="2" />
  <text x="104" y="468" font-family="monospace" font-size="10" fill="#B9B3A0">01 / INGRESS</text>
  <text x="104" y="490" font-family="sans-serif" font-size="14" font-weight="600" fill="#ECE7DA">Webhook Ingest</text>

  <!-- Wire 1 -->
  <line x1="268" y1="477" x2="348" y2="477" stroke="#F5A300" stroke-width="2" stroke-dasharray="4 2" />
  <polygon points="348,477 340,473 340,481" fill="#F5A300" />

  <!-- Node 2 -->
  <rect x="348" y="447" width="180" height="60" fill="#11130F" stroke="#B9B3A0" stroke-width="1" rx="2" />
  <text x="364" y="468" font-family="monospace" font-size="10" fill="#B9B3A0">02 / CLASSIFY</text>
  <text x="364" y="490" font-family="sans-serif" font-size="14" font-weight="600" fill="#ECE7DA">Schema Validation</text>

  <!-- Wire 2 -->
  <line x1="528" y1="477" x2="608" y2="477" stroke="#F5A300" stroke-width="2" stroke-dasharray="4 2" />
  <polygon points="608,477 600,473 600,481" fill="#F5A300" />

  <!-- Node 3 -->
  <rect x="608" y="447" width="180" height="60" fill="#11130F" stroke="#B9B3A0" stroke-width="1" rx="2" />
  <text x="624" y="468" font-family="monospace" font-size="10" fill="#B9B3A0">03 / PERSIST</text>
  <text x="624" y="490" font-family="sans-serif" font-size="14" font-weight="600" fill="#ECE7DA">Record Sync</text>

  <!-- Wire 3 -->
  <line x1="788" y1="477" x2="868" y2="477" stroke="#F5A300" stroke-width="2" stroke-dasharray="4 2" />
  <polygon points="868,477 860,473 860,481" fill="#F5A300" />

  <!-- Node 4 -->
  <rect x="868" y="447" width="180" height="60" fill="#11130F" stroke="#2E6F5E" stroke-width="1.5" rx="2" />
  <text x="884" y="468" font-family="monospace" font-size="10" fill="#2E6F5E">04 / DISPATCH</text>
  <text x="884" y="490" font-family="sans-serif" font-size="14" font-weight="600" fill="#ECE7DA">Operations Alert</text>

  <!-- Footer Info Line -->
  <line x1="24" y1="565" x2="1176" y2="565" stroke="#B9B3A0" stroke-width="1" />
  <text x="48" y="588" font-family="monospace" font-size="11" fill="#2A2D26">CANONICAL SPECIFICATION: HTTPS://WWW.PROTOREVDIGITAL.COM</text>
  <text x="1128" y="588" font-family="monospace" font-size="11" font-weight="700" fill="#11130F" text-anchor="end">2026 PROTOREV DIGITAL</text>
</svg>
`;

sharp(Buffer.from(svg))
  .png()
  .toFile(path.join(assetsDir, 'og_base.png'))
  .then(() => {
    console.log('Successfully generated public/assets/og_base.png');
  })
  .catch(err => {
    console.error('Error generating image:', err);
    process.exit(1);
  });
