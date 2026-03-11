### CM-001 — Scaffolding Fails When Workspace Is Not Empty

**Symptom**
- Project scaffolding (e.g., React + Vite) fails, hangs, or produces partial output.
- Codex becomes confused by existing folders/files.
- Generated structure is inconsistent or incomplete.

**Impact**
- Broken project layout
- Manual cleanup required
- Lost setup time
- Increased risk of subtle config errors

**Root Cause**
- Scaffolding tools expect an empty directory.
- Existing workspace files interfere with initialization logic.

**Prevention**
- Scaffold into a temporary directory first.
- Verify output in isolation.
- Move final structure into the main workspace after validation.

**Recommended Workflow**
1) Create a temporary folder (e.g., `.tmp-scaffold/`).
2) Run the generator inside that folder.
3) Validate structure and config.
4) Move files into project root.
5) Remove temporary folder.

**Detection**
- Unexpected nested folders (e.g., `project/project/src`)
- Missing config files
- Errors during `npm install` or `npm run dev`

**Notes**
- Always prefer isolated scaffolding over in-place generation.
- Especially important for React/Vite/Tauri templates.