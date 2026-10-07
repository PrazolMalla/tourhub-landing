/**
 * Conventional Commits rules for Nepal Yatra Tours & Travels — frontend.
 *
 * Format:  <type>(optional scope): <subject>
 * Example: feat(tours): add itinerary accordion
 *          fix(contact): trim whitespace before submit
 *
 * See https://www.conventionalcommits.org
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // a new feature
        'fix', // a bug fix
        'docs', // documentation only changes
        'style', // formatting, no code change
        'refactor', // code change that neither fixes a bug nor adds a feature
        'perf', // performance improvement
        'test', // adding or fixing tests
        'build', // build system or dependencies
        'ci', // CI configuration
        'chore', // other changes that don't modify src or test files
        'revert', // reverts a previous commit
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};
