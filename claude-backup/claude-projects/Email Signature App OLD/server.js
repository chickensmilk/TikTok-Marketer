const express = require('express');
const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup
const db = new Database(path.join(__dirname, 'data', 'signatures.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    department TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    mobile TEXT,
    website TEXT,
    company TEXT,
    address TEXT,
    linkedin TEXT,
    logo_url TEXT,
    banner_url TEXT,
    accent_color TEXT DEFAULT '#0066CC',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  INSERT OR IGNORE INTO settings (key, value) VALUES
    ('company_name', ''),
    ('company_website', ''),
    ('company_logo_url', ''),
    ('accent_color', '#0066CC'),
    ('company_phone', ''),
    ('company_phone_label', 'p:'),
    ('company_address', ''),
    ('company_address2', ''),
    ('company_address_label', 'a:'),
    ('company_website_label', 'w:'),
    ('banner_url', ''),
    ('banner_link', ''),
    ('social_1_icon_url', ''), ('social_1_link', ''),
    ('social_2_icon_url', ''), ('social_2_link', ''),
    ('social_3_icon_url', ''), ('social_3_link', ''),
    ('social_4_icon_url', ''), ('social_4_link', ''),
    ('social_5_icon_url', ''), ('social_5_link', ''),
    ('social_6_icon_url', ''), ('social_6_link', ''),
    ('social_7_icon_url', ''), ('social_7_link', ''),
    ('social_8_icon_url', ''), ('social_8_link', ''),
    ('social_9_icon_url', ''), ('social_9_link', ''),
    ('social_10_icon_url', ''), ('social_10_link', '');
`);

// Migrate: add new columns if they don't exist yet
const newColumns = [
  'photo_url TEXT',
  'additional_text TEXT',
  'address2 TEXT',
  'phone_label TEXT',
  'mobile_label TEXT',
  'address_label TEXT',
  'website_label TEXT',
  'social_linkedin TEXT',
  'social_facebook TEXT',
  'social_instagram TEXT',
  'social_youtube TEXT',
  'social_twitter TEXT',
  'social_tiktok TEXT',
  'social_pinterest TEXT',
  'banner_link TEXT',
  'layout INTEGER DEFAULT 1',
  // New styling fields
  'photo_shape TEXT DEFAULT "circle"',
  'icon_style TEXT DEFAULT "filled-circle"',
  'label_color TEXT DEFAULT "#F6921C"',
  'company_color TEXT DEFAULT "#26A9E1"',
  'name_font TEXT DEFAULT "Tahoma"',
  'name_size INTEGER DEFAULT 18',
  'name_weight TEXT DEFAULT "700"',
  'title_font TEXT DEFAULT "Tahoma"',
  'title_size INTEGER DEFAULT 15',
  'title_weight TEXT DEFAULT "400"',
  'company_font TEXT DEFAULT "Tahoma"',
  'company_size INTEGER DEFAULT 16',
  'company_weight TEXT DEFAULT "700"',
  'contact_font TEXT DEFAULT "Tahoma"',
  'contact_size INTEGER DEFAULT 14',
];
for (const col of newColumns) {
  try { db.exec(`ALTER TABLE employees ADD COLUMN ${col}`); } catch { /* already exists */ }
}

// ── Social icon SVG endpoint ──
const ICON_BRANDS = {
  linkedin:  { color: '#0077B5', label: 'in',  fontSize: 10 },
  facebook:  { color: '#1877F2', label: 'f',   fontSize: 13 },
  instagram: { color: '#E1306C', label: 'ig',  fontSize: 9  },
  youtube:   { color: '#FF0000', label: '\u25B6', fontSize: 11 },
  pinterest: { color: '#E60023', label: 'P',   fontSize: 13 },
  twitter:   { color: '#000000', label: 'X',   fontSize: 12 },
  tiktok:    { color: '#010101', label: 'TT',  fontSize: 8  },
};

// Seed admin password if not set
db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES ('admin_password', 'admin')").run();

// In-memory admin sessions
const adminSessions = new Set();

function requireAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token && adminSessions.has(token)) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve social platform icons as SVG — supports 4 styles via ?style= param
app.get('/icons/:platform', (req, res) => {
  const platform = req.params.platform.toLowerCase();
  const style = req.query.style || 'filled-circle';
  const brand = ICON_BRANDS[platform];
  if (!brand) return res.status(404).send('Unknown platform');

  let bgShape, textFill;
  switch (style) {
    case 'filled-square':
      bgShape = `<rect width="24" height="24" rx="5" ry="5" fill="${brand.color}"/>`;
      textFill = 'white';
      break;
    case 'outline':
      bgShape = `<circle cx="12" cy="12" r="11" stroke="${brand.color}" stroke-width="1.5" fill="white"/>`;
      textFill = brand.color;
      break;
    case 'mono':
      bgShape = `<circle cx="12" cy="12" r="12" fill="#555555"/>`;
      textFill = 'white';
      break;
    default: // filled-circle
      bgShape = `<circle cx="12" cy="12" r="12" fill="${brand.color}"/>`;
      textFill = 'white';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">${bgShape}<text x="12" y="${12 + brand.fontSize * 0.35}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${brand.fontSize}" font-weight="bold" fill="${textFill}">${brand.label}</text></svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(svg);
});

// --- Auth ---

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  const row = db.prepare("SELECT value FROM settings WHERE key = 'admin_password'").get();
  const stored = row?.value || '';
  if (!stored || password !== stored) return res.status(401).json({ error: 'Wrong password' });
  const token = uuidv4();
  adminSessions.add(token);
  res.json({ token });
});

app.post('/api/logout', (req, res) => {
  adminSessions.delete(req.headers['x-admin-token']);
  res.json({ success: true });
});

app.get('/api/me', (req, res) => {
  const token = req.headers['x-admin-token'];
  res.json({ admin: token && adminSessions.has(token) });
});

// --- Settings ---

app.get('/api/settings', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  res.json(Object.fromEntries(rows.map(r => [r.key, r.value])));
});

app.put('/api/settings', requireAuth, (req, res) => {
  const update = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  const updateMany = db.transaction((data) => {
    for (const [key, value] of Object.entries(data)) update.run(key, value ?? '');
  });
  updateMany(req.body);
  res.json({ success: true });
});

// Logo proxy — stable URL used in all signatures; update logo_url once, all sigs reflect it
app.get('/logo', (req, res) => {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'company_logo_url'").get();
  const url = row?.value;
  if (!url) return res.status(404).send('No logo configured');
  if (!/^https?:\/\//i.test(url)) return res.status(400).send('Invalid logo URL');
  res.redirect(302, url);
});

// --- Employees ---

app.get('/api/employees', (req, res) => {
  const rows = db.prepare('SELECT * FROM employees ORDER BY name ASC').all();
  res.json(rows);
});

app.get('/api/employees/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Employee not found' });
  res.json(row);
});

app.post('/api/employees', requireAuth, (req, res) => {
  const id = uuidv4();
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  db.prepare(`
    INSERT INTO employees (id, name, email, accent_color, layout)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, name, email, '#0066CC', 1);

  res.status(201).json({ id });
});

app.put('/api/employees/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT id FROM employees WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Employee not found' });

  const fields = [
    'name','title','department','email','phone','mobile',
    'website','company','address','address2',
    'phone_label','mobile_label','address_label','website_label',
    'photo_url','additional_text',
    'social_linkedin','social_facebook','social_instagram',
    'social_youtube','social_twitter','social_tiktok','social_pinterest',
    'banner_url','banner_link','accent_color','layout',
    'photo_shape','icon_style',
    'label_color','company_color',
    'name_font','name_size','name_weight',
    'title_font','title_size','title_weight',
    'company_font','company_size','company_weight',
    'contact_font','contact_size',
  ];

  const setClauses = fields.map(f => `${f}=?`).join(', ') + ', updated_at=CURRENT_TIMESTAMP';
  const values = fields.map(f => req.body[f] ?? null);
  values.push(req.params.id);

  db.prepare(`UPDATE employees SET ${setClauses} WHERE id=?`).run(...values);
  res.json({ success: true });
});

app.delete('/api/employees/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT id FROM employees WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Employee not found' });
  db.prepare('DELETE FROM employees WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// --- Page routes ---

app.get('/edit/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'edit.html'));
});

app.get('/signature/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signature.html'));
});

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Email Signature App running at http://localhost:${PORT}`);
});
