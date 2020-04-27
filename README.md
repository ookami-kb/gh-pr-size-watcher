# PR Size Watcher

Checks PR for a total number of additions. To use the action put this into your Workflows file:
x
2 additions: OK
3 additions: warning
4 additions: error

```yaml
name: PR Size Watcher
on: [pull_request]

jobs:
  build:
    name: Check PR size
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: ookami-kb/gh-pr-size-watcher
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

You can specify additional options:

```yaml
with:
    errorSize: 500
    errorMessage: ':no_entry: PR has more than **{allowed} additions**. Split it into smaller PRs.'
    warningSize: 300
    warningMessage: ':warning: PR has more than **{allowed} additions**. Consider splitting it into smaller PRs.'
```
