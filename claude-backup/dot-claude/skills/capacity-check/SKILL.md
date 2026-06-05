# Capacity Check — Team Member Workload Analysis

Cross-reference Basecamp todos, Everhour time actuals, and Slack standup history to produce a capacity table and written verdict for a single team member at Digital Resource.

## When to use

- Richard asks for a capacity check or workload analysis on a team member
- Invoked as `/capacity-check [name]`
- Read-only. Never modify anything in Basecamp, Everhour, or Slack.

---

## Team member reference

| Name | Basecamp Person ID | Everhour User ID | Slack User ID |
|------|--------------------|------------------|---------------|
| Dexter Ramos | 44800252 | 1327353 | U01S46XJU8G |
| Lezly Norman | (look up) | (look up) | U070TFVNNSK |
| Gabriela Bolivar | (look up) | (look up) | U07JJEF0KCY |
| Odette Yermenos | (look up) | (look up) | U08LAH3CA12 |
| Melany Salazar | (look up) | (look up) | U07RXRYNEMQ |
| Debi Giwa | (look up) | (look up) | U0B0JNXGTKQ |

If Basecamp person ID is unknown, run:
```bash
basecamp api get /projects/1/people.json
```
Or search the todo's `assignee` field from a known todo assigned to that person.

If Everhour user ID is unknown, pull time from any known task assigned to them and inspect `userId` in the entries.

---

## Phase 1 — Pull active Basecamp todos

```bash
basecamp todos list --assignee {BASECAMP_PERSON_ID} --status active
```

For each todo returned, record:
- `id` (the todo ID number)
- `title`
- `due_on` (Basecamp formal due date, if set — unreliable, often not used)
- `bucket.name` (project/client name)
- `url` (full Basecamp URL to the todo)

Also pull completed todos for historical context:
```bash
basecamp todos list --assignee {BASECAMP_PERSON_ID} --status completed
```
Limit historical pull to todos completed in the last 60 days.

---

## Phase 2 — Extract PDD / HDD / EST from comment threads

For each todo ID, pull comments:
```bash
basecamp comments list --todo {TODO_ID}
```

Scan comments by **Richard Vargas** or **Brittney Davis** only. Look for these labels (case-insensitive, may be on same line or separate lines):

- `PDD` = Projected Due Date (target date Richard set)
- `HDD` = Hard Due Date (client-facing or firm deadline)
- `EST` = Estimated time to complete (e.g., `1h`, `30m`, `2.5h`, `1 hr`)

Comment format examples:
```
PDD: 5/15
HDD: 5/20
EST: 2h
```
```
EST 1.5hr | PDD 5/10 | HDD 5/17
```

Parse whatever format appears. If no comment from Richard or Brittney exists, mark PDD/HDD/EST as `—`.

**Important**: The `assigned_date` for the task is the date of the first comment from Richard or Brittney that contains PDD/HDD/EST. If no such comment exists, use the todo's `created_at` date.

---

## Phase 3 — Pull Everhour time actuals

Everhour is the actual time tracking system. Basecamp's built-in time fields are NOT accessible via CLI.

**API pattern:**
```python
import urllib.request, json, os

API_KEY = os.environ.get("EVERHOUR_API_KEY", "4b16-1fcd-4f8025-459451-58303029")

def get_task_time(todo_id):
    url = f"https://api.everhour.com/tasks/b3:{todo_id}/time"
    req = urllib.request.Request(url, headers={"X-Api-Key": API_KEY})
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except Exception as e:
        return {"error": str(e)}
```

Response fields:
- `time` — total seconds logged on the task (all users combined)
- `users` — dict of `{userId: seconds}` per user
- `estimates` — Everhour estimate in seconds (may differ from comment EST)

**Convert seconds to h/m:** `f"{s//3600}h {(s%3600)//60}m"`

Run for every active todo. Separate the target person's logged seconds from other users' logged seconds.

If a task has significant time from OTHER users, flag it — either someone covered for the assignee, or the task is collaborative and shouldn't be counted as 100% the assignee's capacity burden.

---

## Phase 4 — Pull standup history from Slack

Channel: `#creativesassemble` (ID: `C016DNBSQ2W`)

Use Slack MCP:
```
slack_read_channel(channel="C016DNBSQ2W", limit=100)
```

Pull the last 4–6 weeks of messages. Filter to messages from the target person (match by Slack user ID).

**Standup format:**
- Each standup lists client/task names followed by time declarations
- Time formats: `1h`, `30m`, `1.5hr`, `45min`, `2-3h` (ranges), `HR` for hours
- Status indicators: 🔴 = at full capacity, 🟡 = moderate, 🟢 = available

For each standup message, extract:
- Date
- Clients/tasks mentioned
- Hours declared per client
- Capacity status (🔴/🟡/🟢)

Map standup mentions to Basecamp todos by client name. A todo with client name "Drift Dental" should match standup entries mentioning "Drift Dental."

---

## Phase 5 — Build the capacity table

One row per active todo. Columns:

| Task | Client | Assigned | PDD | HDD | EST | Everhour (Assignee) | Everhour (Others) | Delta | Standup Mentions | Days Since Assigned | Flags |
|------|--------|----------|-----|-----|-----|---------------------|-------------------|-------|-----------------|---------------------|-------|

**Delta** = Everhour (assignee) minus EST. Positive = over estimate.

**Flags** (apply any that fit):
- `OVER_EST` — logged time exceeds EST by more than 50%
- `NEVER_IN_STANDUP` — task has significant time logged but no standup mentions
- `OTHERS_LOGGED` — other users logged material time on this task
- `NO_HDD` — no hard due date found in comments
- `NO_EST` — no estimate found in comments
- `PAST_HDD` — HDD has passed and task is still open
- `PAST_PDD` — PDD has passed and task is still open

---

## Phase 6 — Write the analysis

After the table, provide a written verdict covering:

1. **Total logged time** — assignee total vs. combined total vs. sum of ESTs
2. **Overrun tasks** — which tasks are significantly over estimate and by how much
3. **Invisible work** — tasks with logged time that never appeared in standups
4. **Standup pattern** — is the capacity status (🔴/🟡/🟢) consistent with the data? Flag if 🔴 every day for 3+ consecutive weeks with no variation
5. **Collaborative tasks** — tasks where others are logging significant time (possible coverage or handoff issues)
6. **Verdict** — is this person genuinely at capacity, or is the data pattern misleading?

---

## Known gaps / limitations

- **Historical todos**: Completed todos older than 60 days are not pulled by default — extend the window if deeper history is needed
- **Everhour estimates vs. comment EST**: These are set separately. Comment EST = what Richard/Brittney scoped. Everhour estimate = what was entered in Everhour. They often differ. Both are useful; note when they diverge significantly.
- **Standup-to-task matching**: Done by fuzzy client name match, not a formal link. Review ambiguous matches manually.
- **Basecamp formal time fields**: The Basecamp UI shows "Time Reported" and "Progress" — these are Everhour data surfaced via the plugin, not native Basecamp fields. The CLI cannot read them directly. Always use the Everhour API.
- **Person IDs**: If a team member's Basecamp/Everhour ID is not in the table above, derive it from a known task before running the full analysis.

---

## Example invocation

```
/capacity-check Dexter
/capacity-check Lezly
/capacity-check Gabriela
```

Pass only the first name. Match to the team reference table above.
