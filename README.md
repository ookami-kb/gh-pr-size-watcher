# PR Size Watcher

Checks PR for a total number of additions.

If number of additions is greater than `errorSize` build will fail, and `errorMessage` will be added as a comment.

If number of additions is greater than `warningSize` then `warningMessage` will be added as a comment.

You can optionally specify `excludeTitle` regex that will skip this validation if PR title matches the regex.

You can optionally specify `excludeLabels`: it will skip this validation if PR labels contain one of the labels.

To exclude some files from being calculated use optional `excludePaths` parameter. It takes a "list" of globs (since GitHub actions don't support passing real yaml lists as input parameters, use syntax from the example below).

To use the action put this into your Workflows file:

```yaml
name: PR Size Watcher
on: [pull_request]

jobs:
  build:
    name: Check PR size
    runs-on: ubuntu-latest
    steps:
      - uses: ookami-kb/gh-pr-size-watcher@v1
        with:
          githubToken: ${{ secrets.GITHUB_TOKEN }} # required
          errorSize: 500 # optional
          errorMessage: ':no_entry: PR has more than **{allowed} additions**. Split it into smaller PRs.' # optional
          warningSize: 300 # optional
          warningMessage: ':warning: PR has more than **{allowed} additions**. Consider splitting it into smaller PRs.' # optional
          excludeTitle: 'PR_SIZE_SKIP' # to skip validation if PR title matches regex, optional
          excludePaths:  | # to exclude some files from calculation, optional
            README.md
            **/test/resources/*.json
          excludeLabels:  | # to skip validation if PR labels contain one of these, optional
            skip-size-check
```
