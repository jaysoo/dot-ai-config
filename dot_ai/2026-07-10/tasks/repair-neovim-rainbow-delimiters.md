# Repair Neovim Rainbow Delimiters

## Goal

Eliminate the rainbow-delimiters crash when Oil opens a buffer.

## Plan

1. [x] Read the active rainbow-delimiters integration and identify why its parser is absent for Oil buffers.
2. [x] Update the source Neovim configuration with a compatible, scoped fix.
3. [x] Sync the configuration and verify opening an Oil buffer does not report an error.
4. [x] Record the result and archive the completed task.

## Progress

- The error occurs in rainbow-delimiters while Oil triggers a `FileType` event, where its parser is `nil`.
- Oil virtual-directory buffers are not syntax trees. Rainbow-delimiters 687ef75 does not safely handle its missing parser, so the configuration now blacklists the `oil` filetype before it attaches.
- `nvim --headless` successfully loaded rainbow-delimiters, Oil, and an Oil buffer with no traceback.

## Expected Outcome

Opening Oil buffers and regular files no longer produces a rainbow-delimiters traceback.
