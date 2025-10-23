# Update Nx.dev

This command works in the `nx` repo only.

CRITICAL: 
- If you are not in the `nx` repo, say so and stop working!
- If there are uncommitted/untracked files, say so and stop working!

## How to Update

1. Get the latest `master` and `website-22` branches: 
  - `git fetch origin master`
  - `git fetch origin website-22`
  - `git checkout master`
  - `git reset --hard origin/master`
  - `git checkout website-22`
  - `git reset --hard origin/website-22`
2. On `website-22`, get the last git commit message and store it into `/tmp/last-website-22-commit.txt`
3. Back on `master` find the git commit matching `/tmp/last-website-22-commit.txt` and remember the sha in `/tmp/last-master-sha.txt`
4. Still on `master` find all commits between the sha in `/tmp/last-master-sha.txt` and `HEAD`, filtered by only commits starting with `docs(` or `feat(nx-dev)`
  - Keep this list of commits in `/tmp/commits-to-cherry-pick.txt`
5. On `website-22` branch, starting from the earlist (bottom) commit to the latest (top) in `/tmp/commits-to-cherry-pick.txt`, run `git cherry-pick <sha>`
  - If any cherry-pick fails, record it in `/tmp/failed-to-cherry-pick.txt`, then abort the cherry pick and move on to the next one

When you are done, list out all of the successful commits that are cherry picked and then list any ones that failed.

