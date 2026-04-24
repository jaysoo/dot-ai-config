-- ~/.config/nvim/init.lua
-- Modern Neovim configuration - Updated September 2025
-- Requires Neovim 0.11+

-- Set leader key first
vim.g.mapleader = " "
vim.g.maplocalleader = ","

-- Check Neovim version
if vim.fn.has("nvim-0.11") == 0 then
	vim.notify("This config requires Neovim 0.11+. Please upgrade!", vim.log.levels.ERROR)
	return
end

-- Basic editor settings
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.mouse = "a"
vim.opt.showmode = false
vim.opt.clipboard = "unnamedplus"
vim.opt.breakindent = true
vim.opt.undofile = true
vim.opt.ignorecase = true
vim.opt.smartcase = true
vim.opt.signcolumn = "yes"
vim.opt.updatetime = 250
vim.opt.timeoutlen = 300
vim.opt.splitright = true
vim.opt.splitbelow = true
vim.opt.list = true
vim.opt.listchars = { tab = "» ", trail = "·", nbsp = "␣" }
vim.opt.inccommand = "split"
vim.opt.cursorline = true
vim.opt.scrolloff = 10
vim.opt.hlsearch = true

-- Enable LSP inlay hints (new in 0.11)
vim.lsp.inlay_hint.enable(true)

-- Bootstrap lazy.nvim plugin manager
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not (vim.uv or vim.loop).fs_stat(lazypath) then
	local lazyrepo = "https://github.com/folke/lazy.nvim.git"
	local out = vim.fn.system({ "git", "clone", "--filter=blob:none", "--branch=stable", lazyrepo, lazypath })
	if vim.v.shell_error ~= 0 then
		vim.api.nvim_echo({
			{ "Failed to clone lazy.nvim:\n", "ErrorMsg" },
			{ out, "WarningMsg" },
			{ "\nPress any key to exit..." },
		}, true, {})
		vim.fn.getchar()
		os.exit(1)
	end
end
vim.opt.rtp:prepend(lazypath)

-- Plugin specifications
require("lazy").setup({
	-- LSP Configuration - Fixed for Neovim 0.11
	{
		"neovim/nvim-lspconfig",
		dependencies = {
			{ "williamboman/mason.nvim", config = true },
			"williamboman/mason-lspconfig.nvim",
			"WhoIsSethDaniel/mason-tool-installer.nvim",
			{ "j-hui/fidget.nvim", opts = {} },
		},
		config = function()
			-- LSP attach autocmd
			vim.api.nvim_create_autocmd("LspAttach", {
				group = vim.api.nvim_create_augroup("kickstart-lsp-attach", { clear = true }),
				callback = function(event)
					local map = function(keys, func, desc)
						vim.keymap.set("n", keys, func, { buffer = event.buf, desc = "LSP: " .. desc })
					end

					-- LSP keybindings
					-- map("gd", require("telescope.builtin").lsp_definitions, "[G]oto [D]efinition")
					-- map("gr", require("telescope.builtin").lsp_references, "[G]oto [R]eferences")
					-- map("gI", require("telescope.builtin").lsp_implementations, "[G]oto [I]mplementation")
					-- map("<leader>D", require("telescope.builtin").lsp_type_definitions, "Type [D]efinition")
					map("gd", vim.lsp.buf.definition, "[G]oto [D]efinition")
					map("gr", vim.lsp.buf.references, "[G]oto [R]eferences")
					map("gI", vim.lsp.buf.implementation, "[G]oto [I]mplementation")
					map("<leader>D", vim.lsp.buf.type_definition, "Type [D]efinition")
					map("<leader>ds", require("telescope.builtin").lsp_document_symbols, "[D]ocument [S]ymbols")
					map(
						"<leader>ws",
						require("telescope.builtin").lsp_dynamic_workspace_symbols,
						"[W]orkspace [S]ymbols"
					)
					map("<leader>rn", vim.lsp.buf.rename, "[R]e[n]ame")
					map("<leader>ca", vim.lsp.buf.code_action, "[C]ode [A]ction")
					map("K", vim.lsp.buf.hover, "Hover Documentation")
					map("gD", vim.lsp.buf.declaration, "[G]oto [D]eclaration")

					-- Enable inlay hints if supported
					local client = vim.lsp.get_client_by_id(event.data.client_id)
					if client and client.supports_method("textDocument/inlayHint") then
						vim.lsp.inlay_hint.enable(true, { bufnr = event.buf })
					end
				end,
			})

			-- Server configurations
			local servers = {
				-- TypeScript/JavaScript/React
				ts_ls = {
					settings = {
						typescript = {
							inlayHints = {
								includeInlayParameterNameHints = "all",
								includeInlayParameterNameHintsWhenArgumentMatchesName = false,
								includeInlayFunctionParameterTypeHints = true,
								includeInlayVariableTypeHints = true,
								includeInlayPropertyDeclarationTypeHints = true,
								includeInlayFunctionLikeReturnTypeHints = true,
								includeInlayEnumMemberValueHints = true,
							},
						},
					},
				},
				-- Rust
				rust_analyzer = {
					settings = {
						["rust-analyzer"] = {
							cargo = { allFeatures = true },
							checkOnSave = { command = "clippy" },
						},
					},
				},
				-- Python
				pyright = {},
				-- Ruby
				solargraph = {},
				-- Lua (for Neovim config)
				lua_ls = {
					settings = {
						Lua = {
							completion = { callSnippet = "Replace" },
							diagnostics = { globals = { "vim" } },
							workspace = {
								checkThirdParty = false,
								library = { vim.env.VIMRUNTIME },
							},
						},
					},
				},
				-- Astro
				astro = {},
			}

			-- Setup Mason
			require("mason").setup()

			local ensure_installed = vim.tbl_keys(servers or {})
			vim.list_extend(ensure_installed, { "stylua" })
			require("mason-tool-installer").setup({ ensure_installed = ensure_installed })

			-- Setup servers using traditional lspconfig approach (still recommended)
			require("mason-lspconfig").setup({
				ensure_installed = vim.tbl_keys(servers),
				automatic_installation = true,
				handlers = {
					function(server_name)
						local server_config = servers[server_name] or {}
						require("lspconfig")[server_name].setup(server_config)
					end,
				},
			})
		end,
	},

	-- Modern completion engine - blink.cmp (faster than nvim-cmp)
	{
		"saghen/blink.cmp",
		version = "1.*",
		build = "cargo build --release",
		opts = {
			keymap = {
				preset = "default",
				["<Tab>"] = { "accept", "fallback" },
				["<S-Tab>"] = { "select_prev", "fallback" },
				["<C-n>"] = { "select_next", "fallback" },
				["<C-p>"] = { "select_prev", "fallback" },
				["<C-y>"] = { "accept" },
				["<C-e>"] = { "cancel" },
				["<C-d>"] = { "scroll_documentation_down", "fallback" },
				["<C-u>"] = { "scroll_documentation_up", "fallback" },
			},
			appearance = {
				use_nvim_cmp_as_default = true,
				nerd_font_variant = "mono",
			},
			sources = {
				default = { "lsp", "path", "snippets", "buffer" },
			},
			completion = {
				accept = {
					auto_brackets = {
						enabled = true,
					},
				},
				menu = {
					auto_show = true,
					draw = {
						treesitter = { "lsp" },
					},
				},
				documentation = {
					auto_show = true,
					auto_show_delay_ms = 200,
				},
			},
		},
	},

	-- GitHub Copilot integration
	{
		"github/copilot.vim",
		event = "InsertEnter",
		config = function()
			vim.g.copilot_no_tab_map = true
			vim.g.copilot_assume_mapped = true
			-- Use Ctrl-J to accept Copilot suggestions
			vim.keymap.set("i", "<C-J>", 'copilot#Accept("\\<CR>")', {
				expr = true,
				replace_keycodes = false,
				desc = "Accept Copilot suggestion",
			})
		end,
	},

	-- Copilot Chat for conversational AI
	{
		"CopilotC-Nvim/CopilotChat.nvim",
		branch = "main",
		dependencies = {
			{ "github/copilot.vim" },
			{ "nvim-lua/plenary.nvim" },
		},
		build = "make tiktoken",
		opts = {
			debug = false,
		},
		keys = {
			{ "<leader>cc", "<cmd>CopilotChatToggle<cr>", desc = "Toggle Copilot Chat" },
			{ "<leader>ce", "<cmd>CopilotChatExplain<cr>", desc = "Copilot Explain" },
			{ "<leader>cf", "<cmd>CopilotChatFixDiagnostic<cr>", desc = "Copilot Fix Diagnostic" },
		},
	},

	-- Fuzzy Finder
	{
		"nvim-telescope/telescope.nvim",
		event = "VimEnter",
		branch = "0.1.x",
		dependencies = {
			"nvim-lua/plenary.nvim",
			{
				"nvim-telescope/telescope-fzf-native.nvim",
				build = "make",
				cond = function()
					return vim.fn.executable("make") == 1
				end,
			},
			{ "nvim-telescope/telescope-ui-select.nvim" },
			{ "nvim-tree/nvim-web-devicons", enabled = vim.g.have_nerd_font },
		},
		config = function()
			require("telescope").setup({
				defaults = {
					file_ignore_patterns = { "node_modules", ".git/" },
					vimgrep_arguments = {
						"rg",
						"--color=never",
						"--no-heading",
						"--with-filename",
						"--line-number",
						"--column",
						"--smart-case",
						"--hidden",
						"--glob=!.git/",
					},
					-- Remove the problematic mappings entirely
					mappings = {
						i = {
							["<C-u>"] = false,
							["<C-d>"] = false,
						},
					},
				},
				pickers = {
					find_files = {
						find_command = { "rg", "--files", "--hidden", "--glob", "!**/.git/*" },
					},
				},
				extensions = {
					["ui-select"] = { require("telescope.themes").get_dropdown() },
				},
			})

			pcall(require("telescope").load_extension, "fzf")
			pcall(require("telescope").load_extension, "ui-select")

			local builtin = require("telescope.builtin")
			vim.keymap.set("n", "<leader>sh", builtin.help_tags, { desc = "[S]earch [H]elp" })
			vim.keymap.set("n", "<leader>sk", builtin.keymaps, { desc = "[S]earch [K]eymaps" })
			vim.keymap.set("n", "<leader>sf", builtin.find_files, { desc = "[S]earch [F]iles" })
			vim.keymap.set("n", "<leader>ss", builtin.builtin, { desc = "[S]earch [S]elect Telescope" })
			vim.keymap.set("n", "<leader>sw", builtin.grep_string, { desc = "[S]earch current [W]ord" })
			vim.keymap.set("n", "<leader>sg", builtin.live_grep, { desc = "[S]earch by [G]rep" })
			vim.keymap.set("n", "<leader>sd", builtin.diagnostics, { desc = "[S]earch [D]iagnostics" })
			vim.keymap.set("n", "<leader>sr", builtin.resume, { desc = "[S]earch [R]esume" })
			vim.keymap.set("n", "<leader>s.", builtin.oldfiles, { desc = "[S]earch Recent Files" })
			vim.keymap.set("n", "<leader><leader>", builtin.buffers, { desc = "[ ] Find existing buffers" })
		end,
	},

	-- File Explorer
	{
		"nvim-tree/nvim-tree.lua",
		version = "*",
		lazy = false,
		dependencies = { "nvim-tree/nvim-web-devicons" },
		config = function()
			require("nvim-tree").setup({
				filters = { dotfiles = false, git_ignored = false },
				git = { enable = true, ignore = false },
				renderer = { highlight_git = true, icons = { show = { git = true } } },
			})
			vim.keymap.set("n", "<leader>e", "<cmd>NvimTreeFindFile<cr>", { desc = "Find file in [E]xplorer" })
			vim.keymap.set("n", "<leader>w", "<cmd>NvimTreeToggle<cr>", { desc = "Toggle file [E]xplorer" })
		end,
	},

	-- Syntax highlighting and parsing (async in 0.11)
	{
		"nvim-treesitter/nvim-treesitter",
		build = ":TSUpdate",
		opts = {
			ensure_installed = {
				"bash",
				"c",
				"diff",
				"html",
				"lua",
				"luadoc",
				"markdown",
				"vim",
				"vimdoc",
				"typescript",
				"javascript",
				"tsx",
				"rust",
				"python",
				"ruby",
				"json",
				"yaml",
				-- Git-related parsers (install these to avoid git session conflicts)
				"gitcommit",
				"git_rebase",
				"gitignore",
				"gitattributes",
			},
			auto_install = true,
			highlight = { enable = true, additional_vim_regex_highlighting = { "ruby" } },
			indent = { enable = true, disable = { "ruby" } },
			incremental_selection = {
				enable = true,
				keymaps = {
					init_selection = "<C-space>",
					node_incremental = "<C-space>",
					scope_incremental = false,
					node_decremental = "<bs>",
				},
			},
		},
		config = function(_, opts)
			require("nvim-treesitter.install").prefer_git = true
			require("nvim-treesitter.configs").setup(opts)
		end,
	},

	-- Rainbow brackets
	{
		"HiPhish/rainbow-delimiters.nvim",
		dependencies = "nvim-treesitter/nvim-treesitter",
		event = "VeryLazy",
		config = function()
			local rainbow_delimiters = require("rainbow-delimiters")
			vim.g.rainbow_delimiters = {
				strategy = {
					[""] = rainbow_delimiters.strategy["global"],
					vim = rainbow_delimiters.strategy["local"],
				},
				query = {
					[""] = "rainbow-delimiters",
					lua = "rainbow-blocks",
				},
				highlight = {
					"RainbowDelimiterRed",
					"RainbowDelimiterYellow",
					"RainbowDelimiterBlue",
					"RainbowDelimiterOrange",
					"RainbowDelimiterGreen",
					"RainbowDelimiterViolet",
					"RainbowDelimiterCyan",
				},
			}
		end,
	},

	-- Better text objects
	{
		"nvim-treesitter/nvim-treesitter-textobjects",
		dependencies = "nvim-treesitter/nvim-treesitter",
		config = function()
			require("nvim-treesitter.configs").setup({
				textobjects = {
					select = {
						enable = true,
						lookahead = true,
						keymaps = {
							["af"] = "@function.outer",
							["if"] = "@function.inner",
							["ac"] = "@class.outer",
							["ic"] = "@class.inner",
							["aa"] = "@parameter.outer",
							["ia"] = "@parameter.inner",
						},
					},
					move = {
						enable = true,
						set_jumps = true,
						goto_next_start = { ["]m"] = "@function.outer", ["]]"] = "@class.outer" },
						goto_next_end = { ["]M"] = "@function.outer", ["]["] = "@class.outer" },
						goto_previous_start = { ["[m"] = "@function.outer", ["[["] = "@class.outer" },
						goto_previous_end = { ["[M"] = "@function.outer", ["[]"] = "@class.outer" },
					},
				},
			})
		end,
	},

	-- Status line
	{
		"nvim-lualine/lualine.nvim",
		dependencies = { "nvim-tree/nvim-web-devicons" },
		config = function()
			require("lualine").setup({
				options = {
					icons_enabled = vim.g.have_nerd_font,
					theme = "auto",
					component_separators = "|",
					section_separators = "",
				},
			})
		end,
	},

	-- Git integration
	{
		"lewis6991/gitsigns.nvim",
		opts = {
			signs = {
				add = { text = "+" },
				change = { text = "~" },
				delete = { text = "_" },
				topdelete = { text = "‾" },
				changedelete = { text = "~" },
			},
			current_line_blame = true, -- GitLens-like blame on current line
			current_line_blame_opts = {
				virt_text = true,
				virt_text_pos = "eol", -- 'eol' | 'overlay' | 'right_align'
				delay = 300,
				ignore_whitespace = false,
			},
			current_line_blame_formatter = "<author>, <author_time:%R> - <summary>",
			on_attach = function(bufnr)
				local gitsigns = require("gitsigns")
				local function map(mode, l, r, opts)
					opts = opts or {}
					opts.buffer = bufnr
					vim.keymap.set(mode, l, r, opts)
				end
				-- Navigation
				map("n", "]c", function()
					if vim.wo.diff then
						vim.cmd.normal({ "]c", bang = true })
					else
						gitsigns.nav_hunk("next")
					end
				end, { desc = "Next git hunk" })
				map("n", "[c", function()
					if vim.wo.diff then
						vim.cmd.normal({ "[c", bang = true })
					else
						gitsigns.nav_hunk("prev")
					end
				end, { desc = "Previous git hunk" })
				-- Actions
				map("n", "<leader>hs", gitsigns.stage_hunk, { desc = "Stage hunk" })
				map("n", "<leader>hr", gitsigns.reset_hunk, { desc = "Reset hunk" })
				map("v", "<leader>hs", function()
					gitsigns.stage_hunk({ vim.fn.line("."), vim.fn.line("v") })
				end, { desc = "Stage hunk" })
				map("v", "<leader>hr", function()
					gitsigns.reset_hunk({ vim.fn.line("."), vim.fn.line("v") })
				end, { desc = "Reset hunk" })
				map("n", "<leader>hS", gitsigns.stage_buffer, { desc = "Stage buffer" })
				map("n", "<leader>hu", gitsigns.undo_stage_hunk, { desc = "Undo stage hunk" })
				map("n", "<leader>hR", gitsigns.reset_buffer, { desc = "Reset buffer" })
				map("n", "<leader>hp", gitsigns.preview_hunk, { desc = "Preview hunk" })
				map("n", "<leader>hb", function()
					gitsigns.blame_line({ full = true })
				end, { desc = "Blame line" })
				map("n", "<leader>tb", gitsigns.toggle_current_line_blame, { desc = "Toggle git blame" })
				map("n", "<leader>hd", gitsigns.diffthis, { desc = "Diff this" })
				map("n", "<leader>hD", function()
					gitsigns.diffthis("~")
				end, { desc = "Diff this ~" })
				map("n", "<leader>td", gitsigns.toggle_deleted, { desc = "Toggle deleted" })
				-- Text object
				map({ "o", "x" }, "ih", ":<C-U>Gitsigns select_hunk<CR>", { desc = "Select hunk" })
			end,
		},
	},

	-- Advanced Git blame and history
	{
		"f-person/git-blame.nvim",
		event = "VeryLazy",
		opts = {
			enabled = false, -- Start disabled, toggle with :GitBlameToggle
			message_template = " <summary> • <date> • <author>",
			date_format = "%r",
			virtual_text_column = 1,
		},
		keys = {
			{ "<leader>gb", "<cmd>GitBlameToggle<cr>", desc = "Toggle Git Blame" },
		},
	},

	-- Better git diff view + merge conflict resolution
	{
		"sindrets/diffview.nvim",
		dependencies = "nvim-lua/plenary.nvim",
		cmd = { "DiffviewOpen", "DiffviewClose", "DiffviewFileHistory", "DiffviewToggleFiles" },
		keys = {
			{
				"<leader>gd",
				function()
					local base = vim.fn
						.system("git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null")
						:gsub("%s+", "")
					if base == "" then
						base = vim.fn.system("git rev-parse --verify origin/main 2>/dev/null"):gsub("%s+", "") ~= ""
								and "origin/main"
							or "origin/master"
					end
					vim.cmd("DiffviewOpen " .. base .. "...HEAD")
				end,
				desc = "Diff branch vs base (committed)",
			},
			{ "<leader>gu", "<cmd>DiffviewOpen<cr>", desc = "Diff uncommitted + untracked" },
			{ "<leader>gD", "<cmd>DiffviewClose<cr>", desc = "Close Diffview" },
			{ "<leader>gh", "<cmd>DiffviewFileHistory<cr>", desc = "File History" },
			{ "<leader>gH", "<cmd>DiffviewFileHistory %<cr>", desc = "Current File History" },
			{ "<leader>gm", "<cmd>DiffviewOpen<cr>", desc = "Merge conflicts (during merge/rebase)" },
		},
		opts = {
			enhanced_diff_hl = true,
			view = {
				merge_tool = {
					layout = "diff3_mixed",
					disable_diagnostics = true,
				},
			},
			keymaps = {
				view = {
					{ "n", "<leader>co", "<cmd>diffget //2<cr>", { desc = "Choose OURS" } },
					{ "n", "<leader>ct", "<cmd>diffget //3<cr>", { desc = "Choose THEIRS" } },
				},
			},
		},
	},

	-- GitHub PR review
	{
		"pwntester/octo.nvim",
		dependencies = {
			"nvim-lua/plenary.nvim",
			"nvim-telescope/telescope.nvim",
			"nvim-tree/nvim-web-devicons",
		},
		cmd = "Octo",
		keys = {
			{ "<leader>gp", "<cmd>Octo pr list<cr>", desc = "List PRs" },
			{ "<leader>gP", "<cmd>Octo pr search<cr>", desc = "Search PRs" },
			{ "<leader>gi", "<cmd>Octo issue list<cr>", desc = "List Issues" },
			{ "<leader>gI", "<cmd>Octo issue search<cr>", desc = "Search Issues" },
			{ "<leader>gr", "<cmd>Octo review start<cr>", desc = "Start PR Review" },
			{ "<leader>gR", "<cmd>Octo review submit<cr>", desc = "Submit PR Review" },
			{ "<leader>gc", "<cmd>Octo comment add<cr>", desc = "Add PR comment" },
			{ "<leader>ga", "<cmd>Octo review comments<cr>", desc = "Add review comment" },
		},
		config = function()
			require("octo").setup({
				enable_builtin = true,
				picker = "telescope",
				default_merge_method = "squash",
				default_delete_branch = false,
				reviews = {
					auto_show_threads = true,
				},
				suppress_missing_scope = {
					projects_v2 = true,
				},
			})
			-- Register treesitter markdown for octo buffers
			vim.treesitter.language.register("markdown", "octo")
		end,
	},

	-- Sticky lines / context (like IntelliJ)
	{
		"nvim-treesitter/nvim-treesitter-context",
		dependencies = "nvim-treesitter/nvim-treesitter",
		opts = {
			enable = true,
			max_lines = 3,
			min_window_height = 20,
			line_numbers = true,
			multiline_threshold = 1,
			trim_scope = "outer",
			mode = "cursor",
			-- ... rest of your patterns config
		},
		config = function(_, opts)
			require("treesitter-context").setup(opts)
			require("treesitter-context").enable()
			-- Correct way to toggle context
			vim.keymap.set("n", "<leader>tc", function()
				require("treesitter-context").toggle()
			end, { desc = "Toggle Treesitter Context" })
		end,
	},

	-- Key mapping helper
	{
		"folke/which-key.nvim",
		event = "VimEnter",
		config = function()
			require("which-key").setup()
			require("which-key").add({
				{ "<leader>c", group = "[C]ode" },
				{ "<leader>d", group = "[D]ocument" },
				{ "<leader>r", group = "[R]ename" },
				{ "<leader>s", group = "[S]earch" },
				{ "<leader>w", group = "[W]orkspace" },
			})
		end,
	},

	-- Comment plugin
	{ "numToStr/Comment.nvim", opts = {} },

	-- Auto pairs
	{ "windwp/nvim-autopairs", event = "InsertEnter", config = true },

	-- Code formatting with conform.nvim
	{
		"stevearc/conform.nvim",
		opts = {
			notify_on_error = false,
			format_on_save = function(bufnr)
				-- Disable "format_on_save lsp_fallback" for languages that don't
				-- have a well standardized coding style. You can add additional
				-- languages here or re-enable it for the disabled ones.
				local disable_filetypes = { c = true, cpp = true }
				return {
					timeout_ms = 500,
					lsp_fallback = not disable_filetypes[vim.bo[bufnr].filetype],
				}
			end,
			formatters_by_ft = {
				lua = { "stylua" },
				-- Conform can also run multiple formatters sequentially
				python = { "isort", "black" },
				--
				-- You can use stop_after_first to run until a formatter is found
				javascript = { "prettierd", "prettier", "oxfmt", stop_after_first = true },
				typescript = { "prettierd", "prettier", "oxfmt", stop_after_first = true },
				javascriptreact = { "prettierd", "prettier", "oxfmt", stop_after_first = true },
				typescriptreact = { "prettierd", "prettier", "oxfmt", stop_after_first = true },
				json = { "prettierd", "prettier", stop_after_first = true },
				html = { "prettierd", "prettier", stop_after_first = true },
				css = { "prettierd", "prettier", stop_after_first = true },
				scss = { "prettierd", "prettier", stop_after_first = true },
				markdown = { "prettierd", "prettier", stop_after_first = true },
				yaml = { "prettierd", "prettier", stop_after_first = true },
				-- Use biome for JS/TS projects that have biome.json
				-- javascript = { 'biome' },
				-- typescript = { 'biome' },
				rust = { "rustfmt" },
				go = { "gofmt" },
			},
		},
		keys = {
			{
				"<leader>f",
				function()
					require("conform").format({ async = true, lsp_fallback = true })
				end,
				mode = "",
				desc = "[F]ormat buffer",
			},
		},
	},

	-- Better diagnostics with virtual lines (new in 0.11)
	{
		"folke/trouble.nvim",
		opts = {},
		cmd = "Trouble",
		keys = {
			{ "<leader>xx", "<cmd>Trouble diagnostics toggle<cr>", desc = "Diagnostics (Trouble)" },
			{ "<leader>xX", "<cmd>Trouble diagnostics toggle filter.buf=0<cr>", desc = "Buffer Diagnostics (Trouble)" },
		},
	},

	-- Better diagnostics with virtual lines (new in 0.11)
	{
		"folke/trouble.nvim",
		opts = {},
		cmd = "Trouble",
		keys = {
			{ "<leader>xx", "<cmd>Trouble diagnostics toggle<cr>", desc = "Diagnostics (Trouble)" },
			{ "<leader>xX", "<cmd>Trouble diagnostics toggle filter.buf=0<cr>", desc = "Buffer Diagnostics (Trouble)" },
		},
	},

	-- Modern colorscheme
	{
		"folke/tokyonight.nvim",
		priority = 1000,
		init = function()
			vim.cmd.colorscheme("tokyonight-night")
			vim.cmd.hi("Comment gui=none")
		end,
	},

	-- Directory navigation like a buffer
	{
		"stevearc/oil.nvim",
		opts = {
			default_file_explorer = false, -- Keep nvim-tree as default
			columns = {
				"icon",
				"permissions",
				"size",
				"mtime",
			},
			buf_options = {
				buflisted = false,
				bufhidden = "hide",
			},
			win_options = {
				wrap = false,
				signcolumn = "no",
				cursorcolumn = false,
				foldcolumn = "0",
				spell = false,
				list = false,
				conceallevel = 3,
				concealcursor = "nvic",
			},
			delete_to_trash = true,
			skip_confirm_for_simple_edits = true,
			view_options = {
				show_hidden = false,
				natural_order = true,
			},
		},
		keys = {
			{ "<leader>-", "<cmd>Oil<cr>", desc = "Open parent directory (Oil)" },
			{ "<C-Up>", "<cmd>Oil<cr>", desc = "Open parent directory (Oil)" }, -- Similar to Cmd+Up
		},
	},
	-- Modern test runner with great JS/TS support
	{
		"nvim-neotest/neotest",
		dependencies = {
			"nvim-neotest/nvim-nio",
			"nvim-lua/plenary.nvim",
			"antoinemadec/FixCursorHold.nvim",
			"nvim-treesitter/nvim-treesitter",
			-- Test adapters
			"nvim-neotest/neotest-jest",
			"marilari88/neotest-vitest",
			"nvim-neotest/neotest-plenary", -- For Neovim plugin testing
		},
		config = function()
			-- Function to find nearest package.json
			local function find_package_json(path)
				local current = path
				while current ~= "/" do
					local package_json = current .. "/package.json"
					if vim.fn.filereadable(package_json) == 1 then
						return current
					end
					current = vim.fn.fnamemodify(current, ":h")
				end
				return vim.fn.getcwd() -- fallback
			end
			require("neotest").setup({
				adapters = {
					require("neotest-jest")({
						jestCommand = "npx jest -u --no-cache",
						jestConfigFile = function(file)
							-- Find the nearest package.json directory
							local dir = find_package_json(vim.fn.fnamemodify(file, ":h"))

							-- Look for jest config files in order of preference
							local config_files = {
								dir .. "/jest.config.js",
								dir .. "/jest.config.cjs",
								dir .. "/jest.config.mjs",
								dir .. "/jest.config.cts",
								dir .. "/jest.config.ts",
								dir .. "/jest.config.json",
								dir .. "/package.json", -- fallback to package.json jest config
							}

							for _, config in ipairs(config_files) do
								if vim.fn.filereadable(config) == 1 then
									return config
								end
							end

							return nil -- let jest find it automatically
						end,
						env = { CI = true },
						cwd = function(file)
							-- Always use the directory with package.json
							return find_package_json(vim.fn.fnamemodify(file, ":h"))
						end,
					}),
					require("neotest-vitest")({
						filter_dir = function(name, rel_path, root)
							return name ~= "node_modules"
						end,
					}),
					require("neotest-plenary"),
				},
				discovery = {
					enabled = false, -- Don't auto-discover tests for better performance
				},
				running = {
					concurrent = true,
				},
				summary = {
					open = "botright vsplit | vertical resize 50",
					enabled = true,
					expand_errors = true,
					follow = true,
					mappings = {
						attach = "a",
						clear_marked = "M",
						clear_target = "T",
						debug = "d",
						debug_marked = "D",
						expand = { "<CR>", "<2-LeftMouse>" },
						expand_all = "e",
						help = "?",
						jumpto = "i",
						mark = "m",
						next_failed = "J",
						output = "o", -- Press 'o' on any test to see output
						prev_failed = "K",
						run = "r",
						run_marked = "R",
						short = "O",
						stop = "u",
						target = "t",
						watch = "w",
					},
				},
				output = {
					enabled = true,
					open_on_run = "short", -- Options: "short", "long", false
				},
				output_panel = {
					enabled = true,
					open = "botright split | resize 15", -- Always open output panel
				},
				status = {
					enabled = true,
					signs = true,
					virtual_text = true,
				},
			})
		end,
		keys = {
			-- Test current file
			{
				"<leader>tf",
				function()
					require("neotest").run.run(vim.fn.expand("%"))
					require("neotest").output_panel.open()
				end,
				desc = "Test File",
			},
			-- Test nearest test
			{
				"<leader>tn",
				function()
					require("neotest").run.run()
					vim.defer_fn(function()
						require("neotest").output.open({ enter = true, auto_close = false })
					end, 100)
				end,
				desc = "Test Nearest",
			},
			-- Test with debugging
			{
				"<leader>td",
				function()
					require("neotest").run.run({ strategy = "dap" })
				end,
				desc = "Debug Test",
			},
			-- Test suite/all tests
			{
				"<leader>ts",
				function()
					require("neotest").run.run(vim.fn.getcwd())
				end,
				desc = "Test Suite",
			},
			-- Toggle test summary
			{
				"<leader>to",
				function()
					require("neotest").summary.toggle()
				end,
				desc = "Toggle Test Summary",
			},
			-- Show test output
			{
				"<leader>tO",
				function()
					require("neotest").output.open({ enter = true, auto_close = true })
				end,
				desc = "Show Test Output",
			},
			-- Stop running tests
			{
				"<leader>tS",
				function()
					require("neotest").run.stop()
				end,
				desc = "Stop Tests",
			},
			-- Watch tests (re-run on file changes)
			{
				"<leader>tw",
				function()
					require("neotest").watch.toggle(vim.fn.expand("%"))
				end,
				desc = "Watch Tests",
			},
		},
	},

	-- In your lazy.setup({...}) list, add:

	-- Markdown slide presentations
	{
		"https://github.com/sotte/presenting.nvim",
		config = function()
			require("presenting").setup({
				options = {
					width = vim.o.columns - 12,
					height = vim.o.lines - 12,
				},
			})
		end,
		cmd = { "Presenting" },
	},

	-- Distraction-free / zen mode
	{
		"folke/zen-mode.nvim",
		opts = {
			window = {
				width = 120,
        height = 0.95,
				options = {
					number = false,
					relativenumber = false,
					signcolumn = "no",
					cursorline = false,
				},
			},
			plugins = {
				options = { laststatus = 0 },
				twilight = { enabled = false },
				gitsigns = { enabled = false },
				tmux = { enabled = true }, -- hides tmux statusbar too
			},
		},
		keys = {
			{ "<leader>z", "<cmd>ZenMode<cr>", desc = "Toggle [Z]en Mode" },
		},
	},
}, {
	ui = {
		icons = vim.g.have_nerd_font and {} or {
			cmd = "⌘",
			config = "🛠",
			event = "📅",
			ft = "📂",
			init = "⚙",
			keys = "🗝",
			plugin = "🔌",
			runtime = "💻",
			require = "🌙",
			source = "📄",
			start = "🚀",
			task = "📌",
			lazy = "💤 ",
		},
	},
})

-- Enhanced diagnostics with virtual lines (new feature in 0.11)
vim.diagnostic.config({
	virtual_text = true,
	virtual_lines = false, -- Toggle with <leader>tl
	signs = true,
	underline = true,
	update_in_insert = false,
	severity_sort = false,
})

-- Toggle virtual lines for diagnostics
vim.keymap.set("n", "<leader>tl", function()
	local config = vim.diagnostic.config()
	vim.diagnostic.config({ virtual_lines = not config.virtual_lines })
end, { desc = "Toggle diagnostic virtual lines" })

-- Clear search highlighting on ESC
vim.keymap.set("n", "<Esc>", "<cmd>nohlsearch<CR>")

-- Diagnostic keymaps
vim.keymap.set("n", "[d", vim.diagnostic.goto_prev, { desc = "Go to previous [D]iagnostic message" })
vim.keymap.set("n", "]d", vim.diagnostic.goto_next, { desc = "Go to next [D]iagnostic message" })
vim.keymap.set("n", "<leader>q", vim.diagnostic.setloclist, { desc = "Open diagnostic [Q]uickfix list" })

-- Exit terminal mode
vim.keymap.set("t", "<Esc><Esc>", "<C-\\><C-n>", { desc = "Exit terminal mode" })

-- Highlight when yanking text
vim.api.nvim_create_autocmd("TextYankPost", {
	desc = "Highlight when yanking (copying) text",
	group = vim.api.nvim_create_augroup("kickstart-highlight-yank", { clear = true }),
	callback = function()
		vim.highlight.on_yank()
	end,
})

-- Copy file to clipboard
vim.keymap.set("n", "<leader>cp", function()
	local path = vim.fn.expand("%:p") -- Full absolute path
	vim.fn.setreg("+", path)
	vim.notify("Copied: " .. path)
end, { desc = "[C]opy file [P]ath (absolute)" })

vim.keymap.set("n", "<leader>cr", function()
	local path = vim.fn.expand("%") -- Relative path from cwd
	vim.fn.setreg("+", path)
	vim.notify("Copied: " .. path)
end, { desc = "[C]opy file path ([R]elative)" })

-- Check if we have nerd font
vim.g.have_nerd_font = true

-- Indents
-- Set global defaults (2 spaces for web technologies)
vim.opt.expandtab = true
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.softtabstop = 2

-- Language-specific indentation following ecosystem standards
vim.api.nvim_create_autocmd("FileType", {
	pattern = {
		-- 2 spaces (web/frontend standards)
		"javascript",
		"javascriptreact",
		"typescript",
		"typescriptreact",
		"html",
		"css",
		"scss",
		"sass",
		"less",
		"json",
		"yaml",
		"yml",
		"astro",
		"vue",
		"svelte",
		"xml",
		"markdown",
		"sql",
	},
	callback = function()
		vim.opt_local.expandtab = true
		vim.opt_local.tabstop = 2
		vim.opt_local.shiftwidth = 2
		vim.opt_local.softtabstop = 2
	end,
})

vim.api.nvim_create_autocmd("FileType", {
	pattern = {
		-- 4 spaces (language ecosystem standards)
		"python",
		"java",
		"rust",
		"c",
		"cpp",
		"php",
		"ruby",
		"kotlin",
	},
	callback = function()
		vim.opt_local.expandtab = true
		vim.opt_local.tabstop = 4
		vim.opt_local.shiftwidth = 4
		vim.opt_local.softtabstop = 4
	end,
})

vim.api.nvim_create_autocmd("FileType", {
	pattern = { "go" },
	callback = function()
		-- Go uses actual tabs (gofmt/Go team standard)
		vim.opt_local.expandtab = false
		vim.opt_local.tabstop = 4
		vim.opt_local.shiftwidth = 4
		vim.opt_local.softtabstop = 4
	end,
})

vim.filetype.add({
	extension = {
		astro = "astro",
	},
})
