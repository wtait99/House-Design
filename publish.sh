#!/usr/bin/env bash
# Publish the house dashboard to GitHub Pages (wtait99/House-Design).
#
# Usage:
#   GITHUB_DASHBOARD_TOKEN must already be set in the environment.
#   ./publish.sh
#
# Optional:
#   SOURCE=/path/to/howell-main-house-prototype ./publish.sh
#   MESSAGE="Describe the update" ./publish.sh
#
# Do not run this script with bash -x or GIT_TRACE. The token is read from
# the environment at push time and must never be printed, logged, or stored
# in .git/config or the remote URL.

# Never xtrace; a trace would leak the token on the push line.
set +x
set -euo pipefail
# If a caller enabled xtrace, turn it off and keep it off.
trap 'set +x' DEBUG
set +x

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE="${SOURCE:-/workspace/howell-main-house-prototype}"
REMOTE_URL="https://github.com/wtait99/House-Design.git"
MESSAGE="${MESSAGE:-Update house dashboard}"
OWNER="wtait99"
REPO_NAME="House-Design"

log() { printf '%s\n' "$*"; }
die() { printf 'publish.sh: %s\n' "$*" >&2; exit 1; }

if [[ ! -d "$SOURCE" ]]; then
  die "source directory not found: $SOURCE"
fi
if [[ ! -f "$SOURCE/index.html" ]]; then
  die "source does not look like the dashboard (no index.html): $SOURCE"
fi
if [[ -z "${GITHUB_DASHBOARD_TOKEN:-}" ]]; then
  die "GITHUB_DASHBOARD_TOKEN is not set"
fi

if [[ ! -d "$SOURCE" ]] || [[ "$SOURCE" -ef "$REPO_DIR" ]]; then
  die "refusing to rsync; source must be a different directory from the publish clone"
fi

log "rsync from $SOURCE -> $REPO_DIR"
rsync -a --delete \
  --exclude '.git/' \
  --exclude '.git' \
  --exclude '.netlify/' \
  --exclude 'netlify/' \
  --exclude 'netlify.toml' \
  --exclude '*.pre-*' \
  --exclude '*.zip' \
  --exclude 'node_modules/' \
  --exclude '.env' \
  --exclude '.env.*' \
  --exclude '*.pem' \
  --exclude '*.key' \
  --exclude 'publish.sh' \
  --exclude '.publish/' \
  --exclude '.nojekyll' \
  --exclude '.gitignore' \
  --exclude 'README.md' \
  --exclude 'js/config.js' \
  "$SOURCE"/ "$REPO_DIR"/

python3 "$REPO_DIR/.publish/apply_patch.py"

# Secret scan: fail if known secret names with values, token-like strings,
# or the current env secret values appear in the publish tree.
python3 - "$REPO_DIR" << 'PY'
import os, re, sys
from pathlib import Path

repo = Path(sys.argv[1])
skip_dirs = {".git", "node_modules", ".publish"}
# Flag assigned values, not bash/Python references to the variable names.
# Skip publish tooling files for name-pattern checks; still scan their
# contents for the live env secret values below.
patterns = [
    re.compile(r"(?i)(?:export\s+)?(NETLIFY_AUTH_TOKEN|RENDER_WEBHOOK_KEY|RENDER_PASSCODE|GITHUB_DASHBOARD_TOKEN)\s*=\s*['\"]?[A-Za-z0-9._\-]{8,}"),
    re.compile(r"(?i)\b(github_pat|ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{20,}"),
    re.compile(r"(?i)\b(sk-live|sk-proj|nf_)[A-Za-z0-9_\-]{16,}"),
]
skip_pattern_files = {"publish.sh"}
# Literal env values, checked without printing them.
env_secrets = []
for name in (
    "GITHUB_DASHBOARD_TOKEN",
    "NETLIFY_AUTH_TOKEN",
    "RENDER_WEBHOOK_KEY",
    "RENDER_PASSCODE",
    "RENDER_WEBHOOK_URL",
):
    val = os.environ.get(name) or ""
    if len(val) >= 8:
        env_secrets.append(name)

hits = []
for path in repo.rglob("*"):
    if not path.is_file():
        continue
    if any(part in skip_dirs for part in path.parts):
        continue
    try:
        data = path.read_bytes()
    except OSError:
        continue
    if b"\0" in data[:4096]:
        continue
    try:
        text = data.decode("utf-8")
    except UnicodeDecodeError:
        continue
    rel = path.relative_to(repo).as_posix()
    for i, line in enumerate(text.splitlines(), 1):
        if path.name not in skip_pattern_files:
            matched = False
            for pat in patterns:
                if pat.search(line):
                    hits.append(f"{rel}:{i}")
                    matched = True
                    break
            if matched:
                continue
        for name in env_secrets:
            val = os.environ.get(name) or ""
            if val and val in line:
                hits.append(f"{rel}:{i} (env secret {name})")

if hits:
    print("publish.sh: secret-like content found; not committing:", file=sys.stderr)
    for h in hits[:50]:
        print("  " + h, file=sys.stderr)
    sys.exit(1)
print("secret scan: clean")
PY

# Ensure this is a git repo pointed at the public GitHub remote, with no
# token stored in the remote URL or in config.
if [[ ! -d "$REPO_DIR/.git" ]]; then
  git -C "$REPO_DIR" init -b main
fi
git -C "$REPO_DIR" config --local user.name "House Design publisher"
git -C "$REPO_DIR" config --local user.email "wtait99@users.noreply.github.com"

if git -C "$REPO_DIR" remote get-url origin >/dev/null 2>&1; then
  current="$(git -C "$REPO_DIR" remote get-url origin)"
  case "$current" in
    *:@*|*"${GITHUB_DASHBOARD_TOKEN}"*|*:x-access-token*|*"github_pat_"*|*"ghp_"*)
      die "origin remote looks like it contains credentials; refusing to continue"
      ;;
  esac
  if [[ "$current" != "$REMOTE_URL" ]]; then
    git -C "$REPO_DIR" remote set-url origin "$REMOTE_URL"
  fi
else
  git -C "$REPO_DIR" remote add origin "$REMOTE_URL"
fi

# Belt and suspenders: never persist a credential helper or extraheader.
git -C "$REPO_DIR" config --local --unset-all http.extraheader >/dev/null 2>&1 || true
git -C "$REPO_DIR" config --local --unset-all credential.helper >/dev/null 2>&1 || true

git -C "$REPO_DIR" add -A
if git -C "$REPO_DIR" diff --cached --quiet; then
  log "no changes to commit"
else
  git -C "$REPO_DIR" commit -m "$MESSAGE"
  log "committed $(git -C "$REPO_DIR" rev-parse --short HEAD)"
fi

# Push with a one-shot askpass helper that reads the token from the
# environment. Do not store it in .git/config or the remote URL. Do not
# use GIT_TRACE, curl -v, or set -x around this call.
set +x
export GIT_TERMINAL_PROMPT=0
export GIT_ASKPASS="$REPO_DIR/.publish/git-askpass.sh"
export SSH_ASKPASS="$GIT_ASKPASS"
export GIT_USERNAME="x-access-token"
# Prefer the askpass helper over any inherited credential helper.
git -C "$REPO_DIR" \
  -c credential.helper= \
  -c "credential.https://github.com.username=x-access-token" \
  push -u origin main
unset GIT_ASKPASS SSH_ASKPASS

log "pushed $(git -C "$REPO_DIR" rev-parse HEAD) to $REMOTE_URL"
