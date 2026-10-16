---
agent: agent
description: Review code for security vulnerabilities before release or after security-sensitive changes
---

# Security Review

Review the selected code or changes. Prioritize actionable findings and cite the affected file and location where possible.

## Checklist

- **Secrets**: No credentials or private keys are committed or exposed in responses and logs.
- **Input and injection**: Validate request data; parameterize SQL; escape HTML output; constrain file paths and uploads.
- **Authentication and authorization**: Enforce access checks server-side for every sensitive operation.
- **Web protections**: Check CSRF protections for state-changing requests and avoid leaking stack traces or internal data.
- **Dependencies and configuration**: Use existing project tooling to identify relevant vulnerable dependencies or unsafe configuration; do not assume unrelated package managers are present.

## Response

List findings first, ordered by severity. For each, explain the risk and a concrete remediation. If no issues are found, say so and note any meaningful coverage gaps or checks that could not be performed.