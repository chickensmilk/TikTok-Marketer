#!/bin/bash
# Daily Claude backup — copies .claude, .claude-account2, claude-projects then commits

BACKUP_DIR="$HOME/claude-backup"
LOG="$BACKUP_DIR/backup.log"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting backup..." >> "$LOG"

# Sync each directory into backup (delete files removed from source)
rsync -a --delete \
  --exclude='.git/' \
  --exclude='**/[0-9a-f][0-9a-f][0-9a-f][0-9a-f]*/' \
  --exclude='**/tool-results/' \
  --exclude='**/__pycache__/' \
  --exclude='**/node_modules/' \
  --exclude='**/graphify-out/' \
  --exclude='*.wav' --exclude='*.mp3' --exclude='*.mp4' --exclude='*.mov' \
  "$HOME/.claude/" "$BACKUP_DIR/dot-claude/"

rsync -a --delete \
  --exclude='.git/' \
  --exclude='**/node_modules/' \
  "$HOME/.claude-account2/" "$BACKUP_DIR/dot-claude-account2/"

rsync -a --delete \
  --exclude='.git/' \
  --exclude='**/[0-9a-f][0-9a-f][0-9a-f][0-9a-f]*/' \
  --exclude='**/tool-results/' \
  --exclude='**/__pycache__/' \
  --exclude='**/node_modules/' \
  --exclude='**/graphify-out/' \
  --exclude='*.wav' --exclude='*.mp3' --exclude='*.mp4' --exclude='*.mov' \
  "$HOME/claude-projects/" "$BACKUP_DIR/claude-projects/"

# Strip any nested .git dirs so git doesn't see them as submodules
find "$BACKUP_DIR" -mindepth 2 -name ".git" -type d -exec rm -rf {} + 2>/dev/null || true

cd "$BACKUP_DIR" || exit 1

# Only commit if something changed
if git diff --quiet && git diff --staged --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] No changes — skipping commit." >> "$LOG"
  exit 0
fi

git add -A
git commit -m "auto-backup $(date '+%Y-%m-%d %H:%M')"
git push origin main >> "$LOG" 2>&1

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup pushed." >> "$LOG"
