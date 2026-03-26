function pm_clear_cache
 pnpm store prune --force && rm -rf ~/Library/Caches/pnpm && npm cache clean --force && rm -rf ~/.npm/_npx
end
