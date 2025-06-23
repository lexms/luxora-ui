# Semantic Release Configuration

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning and publishing.

## How It Works

Semantic release automatically:
- Analyzes commit messages to determine the version bump type
- Generates a changelog
- Creates a git tag
- Publishes to npm
- Creates a GitHub release

## Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature (triggers minor version bump)
- **fix**: A bug fix (triggers patch version bump)
- **docs**: Documentation only changes (triggers patch version bump)
- **style**: Changes that do not affect the meaning of the code (triggers patch version bump)
- **refactor**: A code change that neither fixes a bug nor adds a feature (triggers patch version bump)
- **perf**: A code change that improves performance (triggers patch version bump)
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files

### Breaking Changes

To trigger a major version bump, include `BREAKING CHANGE:` in the commit footer or use `!` after the type:

```bash
feat!: remove deprecated API
```

or

```bash
feat: add new API

BREAKING CHANGE: The old API has been removed
```

## Examples

```bash
# Patch release (1.0.0 -> 1.0.1)
fix: resolve input validation issue

# Minor release (1.0.0 -> 1.1.0)
feat: add new Button component

# Major release (1.0.0 -> 2.0.0)
feat!: restructure component API

# No release
docs: update README
```

## Branch Configuration

- **main/master**: Production releases
- **beta**: Beta pre-releases (e.g., 1.0.0-beta.1)
- **alpha**: Alpha pre-releases (e.g., 1.0.0-alpha.1)

## Manual Release

To test releases locally:

```bash
# Dry run (see what would happen)
pnpm run release:dry-run

# Actual release (requires proper git setup and npm credentials)
pnpm run release
```

## GitHub Secrets Setup

For the automated release workflow to work, set up these secrets in your GitHub repository:

1. **NPM_TOKEN**: Your npm automation token
   - Go to npmjs.com → Profile → Access Tokens
   - Create an "Automation" token
   - Add it to GitHub Secrets

2. **GITHUB_TOKEN**: Automatically provided by GitHub Actions (no setup needed)

## First Release

For the initial release, you can either:

1. Use semantic-release (recommended):
   ```bash
   git commit -m "feat: initial release"
   git push origin main
   ```

2. Or manually set the version and then let semantic-release take over:
   ```bash
   npm version 1.0.0
   git push origin main --tags
   ```

## Configuration Files

- `.releaserc.json`: Main semantic-release configuration
- `.github/workflows/release.yml`: GitHub Actions workflow for releases
- `.github/workflows/ci.yml`: GitHub Actions workflow for CI checks

## Changelog

The changelog is automatically generated and maintained in `CHANGELOG.md` based on your commit messages.

## Package.json Configuration

Key fields for semantic-release:
- `version`: Automatically managed by semantic-release
- `repository`: Must be set for GitHub releases
- `main`, `module`, `types`: Entry points for the published package
- `files`: Specifies which files to include in the npm package 