# ECC for GitHub Copilot

These workspace instructions adapt ECC workflows for this project. Copilot can use the instructions and prompts here; ECC runtime hooks, autonomous agents, and automatic command orchestration are not installed by this bundle.

## Working Principles

- Inspect nearby files and reuse the project's existing PHP, HTML, CSS, and JavaScript patterns before adding new abstractions.
- Keep changes scoped to the requested behavior and preserve existing routes, page structure, and visual conventions.
- For non-trivial changes, outline the approach before editing. For bug fixes, reproduce the issue or add a focused regression check when practical.
- Validate with the narrowest available check. For PHP changes, use PHP linting; for frontend changes, use the project's existing checks or verify the affected page and interaction.
- Do not claim tests, coverage, or build checks passed unless they were actually run. If no relevant automated test exists, say so and report the checks that were run.

## Security

- Treat user input, request parameters, uploaded files, and external content as untrusted.
- Use parameterized SQL for database operations; escape output for its HTML context.
- Check authorization on the server for sensitive operations. Do not expose secrets or sensitive details in responses or logs.
- Before security-sensitive edits, check input validation, authentication and authorization, CSRF protection, file handling, and error disclosure where applicable.

## GitHub Copilot Prompts

Use the prompts in `.github/prompts/` for focused workflows: `/plan`, `/tdd`, `/security-review`, `/build-fix`, and `/refactor`.