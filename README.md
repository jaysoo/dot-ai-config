# dot-ai-config

Setup:

```
# From this repo
ln -s ../../hooks/pre-push .git/hooks/pre-push

# From other work repos
ln -s $HOME/projects/dot-ai-config/dot_ai .ai
```

Any pushes will sync up local AI preferences, and all dictations, plans, scripts, etc. will be in this repo and tracked in git.

