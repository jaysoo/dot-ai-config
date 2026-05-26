#!/bin/bash

YOUR_TOKEN="$(op read 'op://Employee/API Keys/github_token')"

curl -s \
  -H "Authorization: Bearer $YOUR_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/nrwl/nx/commits/$SHA" \
  | jq '{author: .author.login, committer: .committer.login, message: .commit.message}'

curl -s \
  -H "Authorization: Bearer $YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.github.com/graphql" \
  -d '{
  "query": "{ repository(owner: \"nrwl\", name: \"nx\") { object(oid: \"$SHA\") { ... on Commit { author { name email user { login } } associatedPullRequests(first: 5) { nodes { number title state author { login } headRefName headRepository { nameWithOwner isFork } baseRepository { nameWithOwner } } } } } } }"
  }' | jq .
