export const environment = {
  production: false,
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  version: require('../../package.json').version,
  buildDate: '{BUILD-DATE}', // populated during pipeline
  gitCommitHash: '{GIT-COMMIT-HASH}', // populated during pipeline
  gitTag: '{GIT-TAG}', // populated during pipeline
  gitBranchName: '{GIT-BRANCH-NAME}', // populated during pipeline
  sfWaterFlow: 4,
  waterFlowUnits: 'm3/day',
  sfExcessWater: 4,
  excessWaterUnits: 'm3/day',
  sfWaterQuality: 5,
  waterQualityUnits: 'µg/l',
};
