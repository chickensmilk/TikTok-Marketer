"""
Team Capacity Dashboard
Generates a live capacity summary for all 7 designers using Basecamp + Everhour data.
Run this at the start of any session to see who has capacity and when.

Usage: python3 team_dashboard.py
Requires: EVERHOUR_API_KEY env var, basecamp CLI authenticated
"""

import subprocess, json, re, os
from datetime import date, timedelta

TODAY = date.today()
DAILY_CAP = 7.0
EH_KEY = os.environ.get('EVERHOUR_API_KEY', '')

HOLIDAYS_2026 = {
    date(2026,1,1), date(2026,2,16), date(2026,4,3), date(2026,5,25),
    date(2026,6,19), date(2026,7,3), date(2026,9,7), date(2026,10,12),
    date(2026,11,26), date(2026,12,25),
}

DESIGNERS = [
    {'name': 'Dexter',  'bc': 44800252, 'eh_rate': 6.7, 'color': '🔵'},
    {'name': 'Lezly',   'bc': 45896266, 'eh_rate': 7.4, 'color': '🟣'},
    {'name': 'Gaby',    'bc': 46567979, 'eh_rate': 7.0, 'color': '🟠'},
    {'name': 'Odette',  'bc': 48051100, 'eh_rate': 8.0, 'color': '🟡'},
    {'name': 'Debi',    'bc': 52244353, 'eh_rate': 2.4, 'color': '🟢'},
    {'name': 'Maria C', 'bc': 52471282, 'eh_rate': 0,   'color': '⚪'},
    {'name': 'Melany',  'bc': 46905124, 'eh_rate': 0,   'color': '🔴'},
]

# Tasks with these keywords are skipped (admin/internal/recurring)
SKIP = ['meeting hours', 'weekly overdue', 'creative sales', 'goals', 'vector files',
        'cowork', '🔁', '🚩 weekly', 'bi-weekly', 'maternity', 'check-in', 'power bi']

ASSIGNERS = {'richard', 'richard vargas', 'rich', 'brittney', 'brittney davis', 'brittany'}

# Only count tasks due within this many weeks (avoid far-future tasks inflating load)
LOOKAHEAD_WEEKS = 4


def is_workday(d):
    return d.weekday() < 5 and d not in HOLIDAYS_2026


def workdays_from(start, n=20):
    days, d = [], start
    while len(days) < n:
        if is_workday(d): days.append(d)
        d += timedelta(days=1)
    return days


def strip_html(t):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', t)).strip()


def parse_hdd(text):
    m = re.search(r'HDD\s*:?\s*(\d{1,2})/(\d{1,2})', text, re.IGNORECASE)
    if not m: return None
    try: return date(TODAY.year, int(m.group(1)), int(m.group(2)))
    except: return None


def get_comments(tid):
    r = subprocess.run(['basecamp', 'comments', 'list', str(tid),
                        '--account', '5471057', '-j'], capture_output=True, text=True)
    try: return json.loads(r.stdout).get('data', [])
    except: return []


def eh_logged(tid):
    r = subprocess.run(['curl', '-s', '-H', f'X-Api-Key: {EH_KEY}',
                        f'https://api.everhour.com/tasks/b3:{tid}'],
                       capture_output=True, text=True)
    try:
        d = json.loads(r.stdout)
        return round((d.get('time', {}).get('total', 0) or 0) / 3600, 2)
    except: return 0.0


def build_designer_schedule(bc_id, eh_rate):
    cutoff = TODAY + timedelta(weeks=LOOKAHEAD_WEEKS)

    r = subprocess.run(['basecamp', 'reports', 'assigned', str(bc_id),
                        '--account', '5471057', '-j'], capture_output=True, text=True)
    try:
        todos = [t for t in json.loads(r.stdout)['data']['todos']
                 if not t.get('completed') and t.get('due_on')]
    except:
        return {}, None

    tasks = []
    for t in todos:
        title = t['content']
        if any(s in title.lower() for s in SKIP): continue
        if '🚥' in title: continue

        # Get HDD from most recent comment, fall back to title
        comments = get_comments(t['id'])
        hdd = None
        for c in reversed(comments):
            hdd = parse_hdd(strip_html(c.get('content', '')))
            if hdd: break
        if not hdd: hdd = parse_hdd(title)
        if not hdd: continue

        # Cap lookahead — skip tasks too far out
        if hdd > cutoff: continue

        # EST from first CM comment
        est, revs = None, 0
        for c in comments:
            n = c.get('creator', {}).get('name', '').lower().split()
            text = strip_html(c.get('content', ''))
            if re.search(r'EST\s*:?\s*[\d]', text, re.IGNORECASE):
                if n and n[0] in ASSIGNERS:
                    me = re.search(r'EST\s*:?\s*(\d+\.?\d*)', text, re.IGNORECASE)
                    mr = re.search(r'REV\s*:?\s*(\d+\.?\d*)', text, re.IGNORECASE)
                    if me: est = float(me.group(1))
                    if mr: revs = float(mr.group(1))
                    break

        logged = eh_logged(t['id'])
        full = (est or 0) + revs if (est or revs) else 2.0
        remaining = max(0, full - logged) if logged > 0 else full

        tasks.append({'hdd': hdd, 'remaining': remaining, 'title': title[:45]})

    tasks.sort(key=lambda x: x['hdd'])
    workdays = workdays_from(TODAY, 20)
    day_used = {d: 0.0 for d in workdays}

    for task in tasks:
        rem = task['remaining']
        for d in workdays:
            if rem <= 0: break
            avail = DAILY_CAP - day_used[d]
            if avail <= 0: continue
            used = min(rem, avail)
            day_used[d] += used
            rem -= used

    first_open = next((d for d in workdays if day_used[d] < 1.0 and d >= TODAY), None)
    return day_used, first_open, workdays


def run_dashboard():
    WEEKS = [
        ('This Wk',   TODAY,                  TODAY + timedelta(days=6)),
        ('Next Wk',   TODAY + timedelta(days=7), TODAY + timedelta(days=13)),
        ('Wk 3',      TODAY + timedelta(days=14), TODAY + timedelta(days=20)),
        ('Wk 4',      TODAY + timedelta(days=21), TODAY + timedelta(days=27)),
    ]

    print(f"\n╔{'═'*68}╗")
    print(f"║  TEAM CAPACITY DASHBOARD — {TODAY.strftime('%-m/%-d/%Y'):<40}║")
    print(f"╠{'═'*68}╣")
    print(f"║  {'':2}{'Designer':<10} {'This Wk':>8} {'Next Wk':>9} {'Wk 3':>7} {'Wk 4':>7}  {'Opens':>8}  ║")
    print(f"╠{'═'*68}╣")

    for d_info in DESIGNERS:
        name = d_info['name']
        result = build_designer_schedule(d_info['bc'], d_info['eh_rate'])
        if len(result) == 3:
            day_used, first_open, workdays = result
        else:
            day_used, first_open, workdays = {}, None, []

        fo_s = first_open.strftime('%-m/%-d') if first_open else 'full ⚠️'
        weekly = []
        for lbl, ws, we in WEEKS:
            wh = sum(day_used.get(d, 0) for d in workdays if ws <= d <= we)
            cap = 7 * sum(1 for d in workdays if ws <= d <= we)
            flag = '⚠️' if cap and wh / cap >= 0.9 else ''
            weekly.append(f"{wh:.0f}h{flag}")

        print(f"║ {d_info['color']} {name:<9} {weekly[0]:>8} {weekly[1]:>9} {weekly[2]:>7} {weekly[3]:>7}  {fo_s:>8}  ║")

    print(f"╠{'═'*68}╣")
    print(f"║  7h/day · 35h/week · 1h buffer · {LOOKAHEAD_WEEKS}-week lookahead window        ║")
    print(f"║  ⚠️ = week ≥ 90% booked                                          ║")
    print(f"╚{'═'*68}╝\n")


if __name__ == '__main__':
    run_dashboard()
