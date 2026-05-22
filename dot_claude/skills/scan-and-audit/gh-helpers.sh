#!/usr/bin/env bash
# GitHub REST/GraphQL helpers used by the scan-and-audit skill and the
# scan/audit commands it orchestrates. Each function emits JSON in the same
# shape the legacy `gh --json` output used, so downstream `jq` filters in
# the commands keep working unchanged.
#
# Requirements:
#   - $GITHUB_TOKEN exported (orchestrator reads it from 1Password via
#     `op read op://Employee/API Keys/github_token`).
#   - `jq` and `curl` on PATH.
#
# Why curl: the `gh` CLI is banned on this machine
# (see ~/.claude/CLAUDE.md "NEVER use the gh GitHub CLI").

GH_API="${GH_API:-https://api.github.com}"

_gh_require_token() {
  if [ -z "${GITHUB_TOKEN:-}" ]; then
    echo "gh-helpers: GITHUB_TOKEN is empty. Source \$SCAN_DATA_DIR/gh-env.sh or export it." >&2
    return 1
  fi
}

_gh_curl() {
  _gh_require_token || return 1
  curl -sS --fail \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "$@"
}

# urlencode a single value via jq
_gh_uri() { printf '%s' "$1" | jq -sRr @uri; }

# gh release list --repo X --limit N --json tagName,publishedAt,body
gh_release_list() {
  local repo="$1" limit="${2:-15}"
  _gh_curl "$GH_API/repos/$repo/releases?per_page=$limit" \
    | jq '[.[] | {tagName: .tag_name, publishedAt: .published_at, body: .body}]'
}

# gh release view <tag> --repo X --json tagName,body,publishedAt
gh_release_view() {
  local repo="$1" tag="$2"
  _gh_curl "$GH_API/repos/$repo/releases/tags/$(_gh_uri "$tag")" \
    | jq '{tagName: .tag_name, publishedAt: .published_at, body: .body}'
}

# gh issue list --repo X --state Y --limit N
#   --json number,title,createdAt,comments,labels,reactions
gh_issue_list_with_meta() {
  local repo="$1" state="${2:-open}" limit="${3:-200}"
  _gh_curl "$GH_API/repos/$repo/issues?state=$state&per_page=$limit" \
    | jq '[.[] | select(.pull_request == null)
          | {number, title, createdAt: .created_at, comments, labels, reactions}]'
}

# gh issue list --repo X --state all --limit N
#   --json number,title,state,createdAt,closedAt
gh_issue_list_state() {
  local repo="$1" state="${2:-all}" limit="${3:-200}"
  _gh_curl "$GH_API/repos/$repo/issues?state=$state&per_page=$limit" \
    | jq '[.[] | select(.pull_request == null)
          | {number, title, state, createdAt: .created_at, closedAt: .closed_at}]'
}

# gh issue view N --repo X --json state,closedAt
gh_issue_view() {
  local repo="$1" number="$2"
  _gh_curl "$GH_API/repos/$repo/issues/$number" \
    | jq '{state, closedAt: .closed_at}'
}

# gh repo view X --json name
gh_repo_view() {
  local repo="$1"
  _gh_curl "$GH_API/repos/$repo" | jq '{name}'
}

# gh api <endpoint>  — raw REST passthrough (no shape transform).
# endpoint can include query string, e.g. 'repos/nrwl/nx/issues?state=open'.
gh_api() {
  local endpoint="$1"
  _gh_curl "$GH_API/$endpoint"
}

# gh api <endpoint> --paginate  — follow Link: rel=next, concatenate arrays.
# Returns a single JSON array containing every page's items.
gh_api_paginate() {
  local endpoint="$1"
  local url="$GH_API/$endpoint"
  local tmp out
  tmp=$(mktemp)
  out=$(mktemp)
  echo '[]' >"$out"

  while [ -n "$url" ]; do
    _gh_require_token || { rm -f "$tmp" "$out"; return 1; }
    local headers body
    headers=$(mktemp)
    body=$(curl -sS --fail -D "$headers" \
      -H "Authorization: Bearer $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github+json" \
      -H "X-GitHub-Api-Version: 2022-11-28" \
      "$url") || { rm -f "$tmp" "$out" "$headers"; return 1; }

    printf '%s' "$body" >"$tmp"
    jq -s '.[0] + .[1]' "$out" "$tmp" >"$out.next" && mv "$out.next" "$out"

    # Parse next URL from Link header
    url=$(grep -i '^link:' "$headers" | tr ',' '\n' \
          | awk '/rel="next"/{print}' \
          | sed -E 's/.*<([^>]+)>.*/\1/' | head -1)
    rm -f "$headers"
  done

  cat "$out"
  rm -f "$tmp" "$out"
}

# gh api graphql -f query='...'
gh_api_graphql() {
  local query="$1"
  _gh_curl -X POST -H "Content-Type: application/json" \
    --data "$(jq -nc --arg q "$query" '{query: $q}')" \
    "$GH_API/graphql"
}

# gh search repos QUERY --sort=stars --limit=N
#   --json name,description,stargazersCount,updatedAt
gh_search_repos() {
  local query="$1" limit="${2:-10}" sort="${3:-stars}"
  local q
  q=$(_gh_uri "$query")
  _gh_curl "$GH_API/search/repositories?q=$q&sort=$sort&order=desc&per_page=$limit" \
    | jq '[.items[] | {name, description, stargazersCount: .stargazers_count, updatedAt: .updated_at}]'
}
