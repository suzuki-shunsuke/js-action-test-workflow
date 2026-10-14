# js-action-test-workflow

[Workflow](.github/workflows/test.yaml)

GitHub Actions Reusable Workflow for testing JavaScript Actions

1. Install npm packages through [Takumi Guard](https://github.com/flatt-security/setup-takumi-guard-npm) with [download-npm-package-action](https://github.com/suzuki-shunsuke/download-npm-package-action) in a job with `id-token: write`
2. Restore `node_modules` and run `npm run lint` and `npm test` in a job without `id-token: write`. Each script is run only if it's defined in package.json

## How to use

```yaml
jobs:
  test:
    uses: suzuki-shunsuke/js-action-test-workflow/.github/workflows/test.yaml@main
    permissions:
      contents: read
      id-token: write # For Takumi Guard
    secrets:
      TAKUMI_GUARD_BOT_ID: ${{secrets.TAKUMI_GUARD_BOT_ID}}
```

### Inputs

- `working_directory`: The directory where package.json and package-lock.json exist. The default is `.`
- `node-version-file`: The default is `.node-version`
- `npm_artifact_name`: See below

### Share node_modules with other jobs

By default, the workflow installs npm packages in its own job.
If you want to share `node_modules` with other jobs, install them with [download-npm-package-action](https://github.com/suzuki-shunsuke/download-npm-package-action) in the caller workflow and pass the artifact name via `npm_artifact_name`.
Then the workflow skips installing npm packages.

```yaml
jobs:
  npm:
    uses: suzuki-shunsuke/download-npm-package-action/.github/workflows/download.yaml@main
    permissions:
      contents: read
      id-token: write
    with:
      artifact_name: node_modules
    secrets:
      TAKUMI_GUARD_BOT_ID: ${{secrets.TAKUMI_GUARD_BOT_ID}}

  test:
    needs: [npm]
    uses: suzuki-shunsuke/js-action-test-workflow/.github/workflows/test.yaml@main
    with:
      npm_artifact_name: node_modules
    permissions:
      contents: read
      id-token: write # The skipped npm job still requires this permission
```

The workflow uses the artifact name `node_modules-test` by default, and artifact names must be unique in a workflow run.
If you call this workflow multiple times in a workflow run, install npm packages in the caller and pass different `npm_artifact_name`.
