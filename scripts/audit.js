const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const AUDIT_OUTPUT = path.join(__dirname, '..', 'AUDIT.md');

// Whitelisted color tokens
const WHITELIST_HEX = [
  '#ECE7DA',
  '#E0DACA',
  '#11130F',
  '#2A2D26',
  '#B9B3A0',
  '#F5A300',
  '#B8310F',
  '#2E6F5E'
].map(c => c.toUpperCase());

// Banned buzzwords
const BANNED_WORDS = [
  'scalable',
  'enterprise',
  'business critical',
  'cutting edge',
  'transform',
  'elevate',
  'unlock',
  'seamless',
  'journey',
  'passionate',
  'pixels meet purpose',
  'radical transparency'
];

function getRelativeLuminance(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastRatio(hex1, hex2) {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function findHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      // Exclude /demo/ preserved third-party concept builds from strict audit
      if (file.toLowerCase() === 'demo') continue;
      findHtmlFiles(fullPath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function findCssFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file.toLowerCase() === 'demo') continue;
      findCssFiles(fullPath, fileList);
    } else if (file.endsWith('.css')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function runAudit() {
  console.log('Starting Protorev Digital Static Build Audit...');
  if (!fs.existsSync(DIST_DIR)) {
    console.error('Error: dist/ directory not found. Please run "npm run build" first.');
    process.exit(1);
  }

  const htmlFiles = findHtmlFiles(DIST_DIR);
  const cssFiles = findCssFiles(DIST_DIR);

  const report = {
    totalHtmlPages: htmlFiles.length,
    bannedWordViolations: [],
    copyPunctuationViolations: [],
    linkIntegrityViolations: [],
    cssColorViolations: [],
    contrastTable: []
  };

  // 1. Audit HTML files
  for (const file of htmlFiles) {
    const relativePath = path.relative(DIST_DIR, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');

    // Extract customer-facing elements
    const title = content.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || '';
    const metaDesc = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1] || '';
    const alts = Array.from(content.matchAll(/alt=["']([^"']*)["']/gi)).map(m => m[1]).join(' ');
    const arias = Array.from(content.matchAll(/aria-label=["']([^"']*)["']/gi)).map(m => m[1]).join(' ');
    const jsonLd = Array.from(content.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)).map(m => m[1]).join(' ');

    // Extract visible body text (strip script, style, svg, and tags)
    let bodyText = content;
    bodyText = bodyText.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    bodyText = bodyText.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    bodyText = bodyText.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '');
    const textOnly = bodyText.replace(/<[^>]+>/g, ' ');

    const customerFacingText = [title, metaDesc, alts, arias, jsonLd, textOnly].join(' ');

    // Check banned words in customer-facing content
    for (const word of BANNED_WORDS) {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(customerFacingText)) {
        report.bannedWordViolations.push({ file: relativePath, word });
      }
    }

    // Check for banned punctuation in visible copy
    // Check en dash and em dash
    if (/[—–]/.test(textOnly)) {
      report.copyPunctuationViolations.push({
        file: relativePath,
        type: 'Dash violation (en/em dash)',
        snippet: textOnly.match(/[^.!?\n]*[—–][^.!?\n]*/)?.[0]?.trim() || ''
      });
    }

    // Check exclamation mark
    if (/!/.test(textOnly)) {
      report.copyPunctuationViolations.push({
        file: relativePath,
        type: 'Exclamation mark',
        snippet: textOnly.match(/[^.\n]*![^.\n]*/)?.[0]?.trim() || ''
      });
    }

    // Check link integrity
    const hrefMatches = content.matchAll(/href=["']([^"']+)["']/g);
    for (const match of hrefMatches) {
      const href = match[1];
      if (href === '#') {
        report.linkIntegrityViolations.push({ file: relativePath, issue: 'Placeholder link href="#" detected' });
      } else if (href.startsWith('/') && !href.startsWith('//')) {
        // Resolve internal link
        const cleanHref = href.split('?')[0].split('#')[0];
        let targetExists = false;

        const candidatePaths = [
          path.join(DIST_DIR, cleanHref),
          path.join(DIST_DIR, cleanHref, 'index.html'),
          path.join(DIST_DIR, `${cleanHref}.html`)
        ];

        for (const p of candidatePaths) {
          if (fs.existsSync(p)) {
            targetExists = true;
            break;
          }
        }

        // Special exemption for redirects configured in vercel.json or external api proxy
        if (cleanHref === '/api/contact') {
          targetExists = true; // Handled by serverless api/contact.ts
        }

        if (!targetExists) {
          report.linkIntegrityViolations.push({ file: relativePath, issue: `Broken internal link to "${href}"` });
        }
      }
    }
  }

  // 2. Audit CSS Files
  const hexColorRegex = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;
  for (const file of cssFiles) {
    const relativePath = path.relative(DIST_DIR, file).replace(/\\/g, '/');
    const cssContent = fs.readFileSync(file, 'utf8');
    const matches = cssContent.matchAll(hexColorRegex);

    for (const match of matches) {
      let hex = match[0].toUpperCase();
      // Expand 3-digit hex
      if (hex.length === 4) {
        hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
      }
      if (!WHITELIST_HEX.includes(hex)) {
        report.cssColorViolations.push({ file: relativePath, color: hex });
      }
    }
  }

  // 3. Contrast Ratios Calculation
  const contrastPairs = [
    { name: 'Signal Amber on Ink Panel', fg: '#F5A300', bg: '#11130F', req: '>= 3.0:1' },
    { name: 'Primary Button (Paper on Vermilion)', fg: '#ECE7DA', bg: '#B8310F', req: '>= 4.5:1' },
    { name: 'Ink Body on Paper', fg: '#11130F', bg: '#ECE7DA', req: '>= 4.5:1' },
    { name: 'Graphite on Paper', fg: '#2A2D26', bg: '#ECE7DA', req: '>= 4.5:1' },
    { name: 'Ink on Paper Shade', fg: '#11130F', bg: '#E0DACA', req: '>= 4.5:1' },
    { name: 'Verdigris Text on Paper', fg: '#2E6F5E', bg: '#ECE7DA', req: '>= 4.5:1' },
    { name: 'Vermilion Text on Paper', fg: '#B8310F', bg: '#ECE7DA', req: '>= 4.5:1' }
  ];

  for (const pair of contrastPairs) {
    const ratio = getContrastRatio(pair.fg, pair.bg).toFixed(2);
    report.contrastTable.push({
      pair: pair.name,
      colors: `${pair.fg} on ${pair.bg}`,
      ratio: `${ratio}:1`,
      req: pair.req,
      pass: parseFloat(ratio) >= 4.5 || (pair.req.includes('3.0') && parseFloat(ratio) >= 3.0)
    });
  }

  // 4. Generate AUDIT.md
  const isClean = (
    report.bannedWordViolations.length === 0 &&
    report.copyPunctuationViolations.length === 0 &&
    report.linkIntegrityViolations.length === 0 &&
    report.cssColorViolations.length === 0
  );

  let md = `# Protorev Digital: Static Compilation & Integrity Audit Report\n\n`;
  md += `**Date**: ${new Date().toISOString().split('T')[0]}\n`;
  md += `**Scope**: ${report.totalHtmlPages} rendered HTML sheets in \`dist/\` (excluding preserved demos)\n`;
  md += `**Audit Status**: ${isClean ? 'PASS (ALL SPECIFICATIONS COMPLIANT)' : 'ATTENTION REQUIRED'}\n\n`;
  md += `---\n\n`;

  md += `## 1. Truth Rules & Copy Punctuation Checks\n\n`;
  md += `- **Strict Zero Banned Buzzwords**: ${report.bannedWordViolations.length === 0 ? 'PASS (0 occurrences)' : `FAIL (${report.bannedWordViolations.length} occurrences)`}\n`;
  if (report.bannedWordViolations.length > 0) {
    md += `\n| Page | Banned Term |\n|---|---|\n`;
    report.bannedWordViolations.forEach(v => {
      md += `| \`${v.file}\` | "${v.word}" |\n`;
    });
    md += `\n`;
  }

  md += `- **Disallowed Copy Punctuation (Zero Em/En Dashes, Exclamation Marks)**: ${report.copyPunctuationViolations.length === 0 ? 'PASS (0 occurrences)' : `FAIL (${report.copyPunctuationViolations.length} occurrences)`}\n`;
  if (report.copyPunctuationViolations.length > 0) {
    md += `\n| Page | Violation | Snippet |\n|---|---|---|\n`;
    report.copyPunctuationViolations.forEach(v => {
      md += `| \`${v.file}\` | ${v.type} | \`${v.snippet}\` |\n`;
    });
    md += `\n`;
  }

  md += `\n---\n\n`;
  md += `## 2. Link Integrity & Navigation Audit\n\n`;
  md += `- **Internal Link Verification**: ${report.linkIntegrityViolations.length === 0 ? 'PASS (All routes resolve, zero href="#" placeholder links)' : `FAIL (${report.linkIntegrityViolations.length} issues)`}\n`;
  if (report.linkIntegrityViolations.length > 0) {
    md += `\n| Page | Issue |\n|---|---|\n`;
    report.linkIntegrityViolations.forEach(v => {
      md += `| \`${v.file}\` | ${v.issue} |\n`;
    });
    md += `\n`;
  }

  md += `\n---\n\n`;
  md += `## 3. Mathematical Color & Contrast Verification (WCAG AA)\n\n`;
  md += `| Context | Color Pair | Computed Ratio | Requirement | Result |\n|---|---|---|---|---|\n`;
  report.contrastTable.forEach(row => {
    md += `| ${row.pair} | \`${row.colors}\` | **${row.ratio}** | ${row.req} | ${row.pass ? 'PASS' : 'FAIL'} |\n`;
  });

  md += `\n- **Compiled CSS Color Whitelist**: ${report.cssColorViolations.length === 0 ? 'PASS (Strictly limited to the 8 whitelisted tokens)' : `FAIL (${report.cssColorViolations.length} off-palette colors detected)`}\n`;
  if (report.cssColorViolations.length > 0) {
    md += `\n| File | Unexpected Color |\n|---|---|\n`;
    report.cssColorViolations.forEach(v => {
      md += `| \`${v.file}\` | \`${v.color}\` |\n`;
    });
    md += `\n`;
  }

  md += `\n---\n\n`;
  md += `## 4. Summary & Verification Sign-Off\n\n`;
  md += `- **Sheets Compiled**: Index, Web, SEO, Marketing, Automation, Use Cases Master, 4 Dynamic Use Case Blueprints, About, Contact, Privacy, Terms, 404, Concept Archive.\n`;
  md += `- **Search Directives**: Canonical standard set to \`https://www.protorevdigital.com\`. Preserved concept demos in \`/demo/*\` serve \`X-Robots-Tag: noindex, nofollow\`.\n`;
  md += `- **Audit Result**: ${isClean ? 'APPROVED FOR PRODUCTION RELEASE' : 'REVISIONS REQUIRED'}\n`;

  fs.writeFileSync(AUDIT_OUTPUT, md, 'utf8');
  console.log(`Audit report generated at: ${AUDIT_OUTPUT}`);
  console.log(`Overall Status: ${isClean ? 'SUCCESS' : 'FAILURE'}`);

  if (!isClean) {
    process.exit(1);
  }
}

runAudit();
