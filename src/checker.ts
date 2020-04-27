export enum Result {
  ok,
  warning,
  error
}

export class Checker {
  private readonly errorSize: number
  private readonly warningSize: number
  private readonly excludeTitle: RegExp | undefined

  constructor(errorSize: number, warningSize: number, excludeTitle?: RegExp | undefined) {
    this.errorSize = errorSize
    this.warningSize = warningSize
    this.excludeTitle = excludeTitle
  }

  check(pr: {title: string; files: {additions: number}[]}): Result {
    if (this.shouldSkip(pr.title)) return Result.ok

    const additions = Checker.getAdditions(pr.files)
    if (additions > this.errorSize) return Result.error
    if (additions > this.warningSize) return Result.warning
    return Result.ok
  }

  private shouldSkip(title: string): boolean {
    return this.excludeTitle?.test(title) ?? false
  }

  private static getAdditions(data: {additions: number}[]): number {
    return data.map(v => v.additions).reduce((acc, v) => acc + v, 0)
  }
}
