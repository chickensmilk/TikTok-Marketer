import subprocess, json, re, os
from datetime import date, datetime, timedelta

TODAY = date(2026, 6, 4)
DAILY_CAP = 7.0
STALE_WARN = 7
STALE_CRIT = 14

EH_API_KEY = os.environ.get('EVERHOUR_API_KEY', '')

# Everhour user IDs per designer (Basecamp ID -> Everhour ID, daily_rate)
EH_USERS = {
    44800252: {'eh_id': 1327353, 'rate': 6.7,  'name': 'Dexter'},
    45896266: {'eh_id': 1336550, 'rate': 7.4,  'name': 'Lezly'},
    46567979: {'eh_id': 1422085, 'rate': 7.0,  'name': 'Gaby'},
    48051100: {'eh_id': 1403017, 'rate': 8.0,  'name': 'Odette'},
    52244353: {'eh_id': 1445224, 'rate': 2.4,  'name': 'Debi'},
}
ACTIVE_LOGGER_THRESHOLD = 5.0  # h/day — above this, 0 logged = not started

def get_everhour_logged(todo_id):
    """Return hours logged against a Basecamp todo via Everhour."""
    result = subprocess.run(
        ['curl', '-s', '-H', f'X-Api-Key: {EH_API_KEY}',
         f'https://api.everhour.com/tasks/b3:{todo_id}'],
        capture_output=True, text=True
    )
    try:
        d = json.loads(result.stdout)
        secs = d.get('time', {}).get('total', 0) or 0
        return round(secs / 3600, 2)
    except:
        return 0.0

HOLIDAYS = {
    date(2026,6,19), date(2026,7,3), date(2026,9,7),
    date(2026,10,12), date(2026,11,26), date(2026,12,25),
}

def is_workday(d):
    return d.weekday() < 5 and d not in HOLIDAYS

def workdays_from(start, n=20):
    days, d = [], start
    while len(days) < n:
        if is_workday(d): days.append(d)
        d += timedelta(days=1)
    return days

def strip_html(text):
    text = re.sub(r'<[^>]+>', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()

def parse_hours(text):
    m = re.search(r'(\d+\.?\d*)', str(text))
    return float(m.group(1)) if m else None

def parse_hdd_date(val):
    m = re.search(r'(\d{1,2})/(\d{1,2})(?:/\d{2,4})?', str(val))
    if not m:
        return None
    month, day = int(m.group(1)), int(m.group(2))
    year = 2027 if month < 3 and TODAY.month > 9 else 2026
    try:
        return date(year, month, day)
    except:
        return None

def parse_dt(raw):
    try:
        raw = raw.replace('Z', '+00:00')
        raw = re.sub(r'\.(\d+)([+-])', lambda m: '.'+m.group(1).ljust(3,'0')+m.group(2), raw)
        return datetime.fromisoformat(raw).date()
    except:
        return None

def parse_title_hdd(title):
    m = re.search(r'HDD\s*:?\s*(\d{1,2}/\d{1,2}(?:/\d{2,4})?)', title, re.IGNORECASE)
    return parse_hdd_date(m.group(1)) if m else None

def parse_comment_fields(text):
    result = {}
    for field in ['HDD', 'PDD', 'EST', 'REVS']:
        m = re.search(rf'{field}\s*:?\s*([^\s,\n<]+)', text, re.IGNORECASE)
        if not m:
            continue
        val = m.group(1).strip('.')
        if field in ('HDD', 'PDD'):
            result[field.lower()] = parse_hdd_date(val)
        else:
            result[field.lower()] = parse_hours(val)
    return result

def get_comments(todo_id):
    r = subprocess.run(
        ['basecamp', 'comments', 'list', str(todo_id), '--account', '5471057', '-j'],
        capture_output=True, text=True
    )
    try:
        return json.loads(r.stdout).get('data', [])
    except:
        return []

def bc_get(url):
    r = subprocess.run(
        ['basecamp', 'api', 'get', url, '--account', '5471057'],
        capture_output=True, text=True
    )
    try:
        return json.loads(r.stdout).get('data', {})
    except:
        return {}

SKIP = ['meeting hours', 'weekly overdue', 'creative sales', 'goals',
        'vector files', 'cowork', 'claude cowork', 'weekly overdue check']

_todolist_cache = {}

def is_sitemap_todolist(todolist_id, bucket_id):
    if todolist_id in _todolist_cache:
        return _todolist_cache[todolist_id]
    tl = bc_get(f'/buckets/{bucket_id}/todolists/{todolist_id}.json')
    parent_title = tl.get('parent', {}).get('title', '')
    result = 'sitemap' in parent_title.lower()
    _todolist_cache[todolist_id] = result
    return result

# Pull Dexter's tasks
r = subprocess.run(
    ['basecamp', 'reports', 'assigned', '44800252', '--account', '5471057', '-j'],
    capture_output=True, text=True
)
todos = [t for t in json.loads(r.stdout)['data']['todos']
         if not t.get('completed') and t.get('due_on')]

print(f"Processing {len(todos)} tasks...\n")

# First pass: identify potential parent tasks per bucket
parent_tasks = {}
raw_tasks = []

for t in todos:
    title = t['content']
    if any(s in title.lower() for s in SKIP):
        continue
    if '🚥' in title:
        continue
    raw_tasks.append(t)
    bucket_id = t.get('bucket', {}).get('id')
    if ('hi-fi mockup' in title.lower() and 'internal pages' in title.lower()
            and parse_title_hdd(title)):
        parent_tasks[bucket_id] = t

# Second pass: process each task
tasks = []
external = []

for t in raw_tasks:
    title = t['content']
    todo_id = t['id']
    bucket_id = t.get('bucket', {}).get('id')
    url = t['app_url']
    parent_ref = t.get('parent', {})
    todolist_id = parent_ref.get('id') if parent_ref.get('type') == 'Todolist' else None

    comments = get_comments(todo_id)

    # EST/REVS: first CM comment with these fields
    est, revs, assigned_at, assigner = None, 0, None, None
    for c in comments:
        name = c.get('creator', {}).get('name', '')
        first = name.lower().split()[0] if name else ''
        text = strip_html(c.get('content', ''))
        if re.search(r'(EST|REVS)\s*:?\s*[\d]', text, re.IGNORECASE):
            if first in {'richard', 'brittney', 'brittany', 'rich'}:
                fields = parse_comment_fields(text)
                est = fields.get('est')
                revs = fields.get('revs') or 0
                assigned_at = parse_dt(c.get('created_at', ''))
                assigner = name
                break

    # HDD: most recent comment with HDD wins; fall back to title
    hdd = None
    for c in reversed(comments):
        text = strip_html(c.get('content', ''))
        m = re.search(r'HDD\s*:?\s*(\d{1,2}/\d{1,2}(?:/\d{2,4})?)', text, re.IGNORECASE)
        if m:
            hdd = parse_hdd_date(m.group(1))
            break
    if not hdd:
        hdd = parse_title_hdd(title)

    days_sitting = (TODAY - assigned_at).days if assigned_at else None

    # Everhour logged hours
    logged_h = get_everhour_logged(todo_id)

    # Sitemap child detection
    is_sitemap = False
    if todolist_id and bucket_id and re.match(r'^\[Design\]', title):
        is_sitemap = is_sitemap_todolist(todolist_id, bucket_id)

    if is_sitemap:
        parent_t = parent_tasks.get(bucket_id)
        if parent_t:
            parent_hdd = parse_title_hdd(parent_t['content'])
            p_comments = get_comments(parent_t['id'])
            for c in reversed(p_comments):
                text = strip_html(c.get('content', ''))
                m = re.search(r'HDD\s*:?\s*(\d{1,2}/\d{1,2})', text, re.IGNORECASE)
                if m:
                    parent_hdd = parse_hdd_date(m.group(1))
                    break
            if not assigned_at:
                for c in p_comments:
                    name = c.get('creator', {}).get('name', '')
                    first = name.lower().split()[0] if name else ''
                    text = strip_html(c.get('content', ''))
                    if re.search(r'(EST|REVS|HDD|PDD)\s*:?\s*[\d]', text, re.IGNORECASE):
                        if first in {'richard', 'brittney', 'brittany', 'rich'}:
                            assigned_at = parse_dt(c.get('created_at', ''))
                            days_sitting = (TODAY - assigned_at).days if assigned_at else None
                            break
            sitemap_est  = 1.0
            sitemap_revs = 0.5
            sitemap_total = sitemap_est + sitemap_revs
            remaining = max(0.0, sitemap_total - logged_h) if logged_h > 0 else sitemap_total
            tasks.append({
                'title':        title[:52],
                'hdd':          parent_hdd or hdd,
                'est':          sitemap_est,
                'revs':         sitemap_revs,
                'logged':       logged_h,
                'remaining':    remaining,
                'total':        remaining,
                'no_est':       False,
                'days_sitting': days_sitting,
                'assigner':     assigner or '?',
                'url':          url,
                'sitemap':      True,
            })
        else:
            external.append({'title': title[:60], 'url': url,
                             'assigner': assigner or 'unknown', 'hdd': hdd,
                             'reason': 'sitemap child — no parent found'})
        continue

    if not hdd:
        external.append({'title': title[:60], 'url': url,
                         'assigner': assigner or 'unknown', 'hdd': None,
                         'reason': 'no HDD found'})
        continue

    if not est and (not assigner or
                    assigner.lower().split()[0] not in {'richard', 'brittney', 'brittany', 'rich'}):
        external.append({'title': title[:60], 'url': url,
                         'assigner': assigner or 'unknown', 'hdd': hdd,
                         'reason': 'no EST / not assigned by CM'})

    # Calculate remaining using Everhour logged hours
    designer_rate = EH_USERS.get(44800252, {}).get('rate', 0)
    full_est = (est or 0) + revs if (est or revs) else 2.0

    if logged_h > 0:
        remaining = max(0.0, full_est - logged_h)
        eh_status = 'partial'
    elif est and designer_rate >= ACTIVE_LOGGER_THRESHOLD:
        remaining = full_est  # active logger + 0 logged = not started
        eh_status = 'not_started'
    else:
        remaining = full_est  # sparse logger — use full EST, flag it
        eh_status = 'uncertain'

    tasks.append({
        'title':        title[:52],
        'hdd':          hdd,
        'est':          est,
        'revs':         revs,
        'logged':       logged_h,
        'remaining':    remaining,
        'total':        remaining,
        'no_est':       est is None,
        'eh_status':    eh_status,
        'days_sitting': days_sitting,
        'assigner':     assigner or '?',
        'url':          url,
        'sitemap':      False,
    })

# Sort by HDD ascending
tasks.sort(key=lambda x: x['hdd'])

# Stack into 7h/day blocks
workdays = workdays_from(TODAY, 20)
day_used = {d: 0.0 for d in workdays}
schedule = {d: [] for d in workdays}

for task in tasks:
    remaining = task['total']
    for d in workdays:
        if remaining <= 0:
            break
        avail = DAILY_CAP - day_used[d]
        if avail <= 0:
            continue
        chunk = min(remaining, avail)
        day_used[d] += chunk
        schedule[d].append({**task, 'chunk': chunk,
                             'continued': remaining < task['total']})
        remaining -= chunk

# Output
print("=" * 70)
print("DEXTER — Schedule (HDD priority, 7h/day, 1h buffer)")
print("=" * 70)

first_open = None
for d in workdays:
    used = day_used[d]
    free = round(DAILY_CAP - used, 1)
    dtasks = schedule[d]

    if not dtasks and first_open is None and d >= TODAY:
        first_open = d
        open_tag = "  ✅ FIRST OPEN SLOT"
    else:
        open_tag = ""

    print(f"\n  {d.strftime('%a %-m/%-d')}   {used:.1f}h used  {free:.1f}h free{open_tag}")
    print(f"  {'─'*66}")

    if not dtasks:
        print("  (open)")
        continue

    for tk in dtasks:
        hdd_s  = tk['hdd'].strftime('%-m/%-d')
        est_s  = f"EST:{tk['est']}h" if tk['est'] else "EST:⚠️"
        revs_s = f" REVS:{tk['revs']}h" if tk['revs'] else ""
        cont   = " cont'd" if tk['continued'] else ""
        noest  = " ⚠️" if tk['no_est'] else ""
        smap   = " [sitemap]" if tk['sitemap'] else ""

        # Everhour display
        logged = tk.get('logged', 0)
        eh_st  = tk.get('eh_status', '')
        if logged > 0:
            eh_s = f"  logged:{logged}h→{tk['remaining']:.1f}h left"
        elif eh_st == 'uncertain':
            eh_s = "  ⚠️unverified"
        else:
            eh_s = ""

        sit = tk['days_sitting']
        if sit is None:
            stale = ""
        elif sit >= STALE_CRIT:
            stale = f"  🚨{sit}d"
        elif sit >= STALE_WARN:
            stale = f"  ⏱{sit}d"
        else:
            stale = f"  {sit}d"

        print(f"  • {tk['title']:<50} HDD:{hdd_s}  {est_s}{revs_s}{eh_s}  →{tk['chunk']:.1f}h{cont}{noest}{smap}{stale}")

print(f"\n{'='*70}")
if first_open:
    print(f"✅ First open slot: {first_open.strftime('%a %-m/%-d')}")
else:
    print("⚠️  No open slots in next 20 workdays")

if external:
    print(f"\n{'─'*70}")
    print(f"🚩 Needs review ({len(external)}):")
    for f in external:
        hdd = f['hdd'].strftime('%-m/%-d') if f['hdd'] else 'no HDD'
        print(f"  • {f['title']}")
        print(f"    {f.get('reason','')}  |  {f['assigner']}  |  HDD:{hdd}")
        print(f"    {f['url']}")
