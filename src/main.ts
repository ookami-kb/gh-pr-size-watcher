import * as core from '@actions/core'
import {context, getOctokit} from '@actions/github'
import {Checker, Result} from './checker'
import {getInputAsArray} from './utils'

async function run(): Promise<void> {
  try {
    const GITHUB_TOKEN = core.getInput('githubToken', {required: true})
    const gitHub = getOctokit(GITHUB_TOKEN)
    const pr = context.payload.pull_request
    if (!pr) {
      core.setFailed('This is not a PR')
      return
    }

    const errorSize = parseInt(core.getInput('errorSize'), 10)
    const errorMessage = core.getInput('errorMessage')
    const warningSize = parseInt(core.getInput('warningSize'), 10)
    const warningMessage = core.getInput('warningMessage')
    const excludeTitle = core.getInput('excludeTitle')
    const excludePaths = getInputAsArray('excludePaths')
    const excludeLabels = getInputAsArray('excludeLabels')

    const checker = new Checker({
      errorSize,
      warningSize,
      excludeTitle: excludeTitle.length === 0 ? undefined : new RegExp(excludeTitle),
      excludePaths,
      excludeLabels
    })

    const prParams = {
      ...context.repo,
      pull_number: pr.number
    }
    const response = await gitHub.rest.pulls.listFiles(prParams)
    const pullRequest = await gitHub.rest.pulls.get(prParams)

    const result = checker.check({
      title: pullRequest.data.title,
      files: response.data,
      labels: pullRequest.data.labels.map(it => it.name)
    })

    switch (result) {
      case Result.ok:
        break
      case Result.warning:
        await gitHub.rest.issues.createComment({
          ...context.repo,
          issue_number: pr.number,
          body: format(warningMessage, warningSize)
        })
        break
      case Result.error:
        await gitHub.rest.issues.createComment({
          ...context.repo,
          issue_number: pr.number,
          body: format(errorMessage, errorSize)
        })
        core.setFailed('Maximum PR size exceeded')
        break
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof Error) core.error(error)
    else core.setFailed(error.toString())
  }
}

function format(message: string, allowed: number): string {
  return message.replace('{allowed}', allowed.toString(10))
}

run()
