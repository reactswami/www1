# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# [0.0.10] - 2022-12-13

Improve the bundling configuration (i.e. webpack).
There was 4.7 MB of unused dependencies being shipped (faker, msw).

Now there still are bundled, but not requested by the browser.
Ideally, we don't want to bundle them at all // TODO
# [0.0.9] - 2022-11-24

Improvement of the UX/UI, especially around the settings pages.
Improvement of the performance of the data tables: adding column filters, view mode, fix pagination.
Bugs fixes as described on [Jira](https://jira.statseeker.com/browse/BAU-4052)

## Add

- Add a helper text on the status pill (tooltip),
- Add background to match Statseeker's and improve  styling around 'cards' (white background, shadow, border radius),

## Modify

- Cancel buttons are now of type ghost
- The alert badge for the poller status is not visible on the wizard page anymore,
- Modify the query key for the layout badge and the global config so modifying the global config invalidate the layout badge and force a re-fetch,
- Improve the row selection on change,
- Add highlight color to selected rows,
- Modify the settings to a one column layout for accessibility and UX reasons,
- Modify the settings section to be collapsible,
- Improve "look and feel" for better integration in the existing product (i.e. mainly a gray background),
- Improve the performance on the tables,
- Added info tooltip where required: global search to indicate regexp support, status in the network table, network rules,

## Fixes

- List the existing rules in the bulk actions of the organizations,
- Review and fix the color of the status pill,
- Fix the issue where the default values in the network rule form weren't set up properly,
- Fix the 'go to page' pagination feature,
- fix issues and bug throughout the application, see BAU-4052 for an exhaustive list,

# [0.0.8] - 2022-09-29

Majors refactoring, reorganization and improvement of the UX/UI as per the two rounds of reviews.

This includes:

- Removing ui-library components in favor of plain Chakra components (this is part of the strategy to avoid maintaining an internal component library),
- Multiple bug fixes throughout the product,
- Uplifting the table UX, especially around the bulk actions,
- Improving the table performance,
- Upgrading the table dependency to v8 (previously v7),
- Add the feature to assign to existing rules,
- Rename components and reorganize folders in an attempt to standarize the naming,
- Various bug fixes, improvements and minor refactoring,

# ⚠️ Important note

Given the amount of time left for the project, the refactoring has been cut short. They are part of the projects that would enjoy a bit of tidying up.
Feel free to reorganize/break down components and files as required to make it more maintainable/organised.

# [0.0.7] - 2022-09-20

Review of the settings page as per review.

## MODIFY

- Review main settings page as per review: merge both settings pages together,

## ADD

- Add styling to the settings page and shared components,
- Add a 'test' connection button and related hooks/tests,

# [0.0.6] - 2022-09-19

## MODIFY

- Review the UX workflow around the initial set up wizard as per UI/UX review,
- Modify tests accordingly,
- Refactor code to improve readability,

## ADD

- Add styling,

# [0.0.5] - 2022-09-14

Network custom rules management: add, edit, explore.
Plus general refactoring, cleaning up, bug fixs.

## ADD

- Add the add a custom rule feature,
- Add the edit a custom rule feature,

## MODIFY

- Modify the AppConfig to add rules,
- Group the default values together,
- General cleanup, refactoring, breaking down components,
- useCall API now returns the data from the API call,

# [0.0.4] - 2022-09-09

## ADD

- Add organizations explorer feature, along with tests, hooks and components as required
- Add networks explorer feature, along with tests, hooks and components as required

### MODIFIED

- Add `tsconfig` path alias for shorter import statement,
- Modify paths accordingly,
- General refactoring: move the API calls into the `api/` folder, consolidate changes and modify code to improve consistency,
- State updates are now (mostly) done in the custom hooks calls,

# [0.0.3] - 2022-09-09

Feature: add the main navigation page, the settings pages and the default polling configuration pages.

## Add

- Default polling configuration page (GlobalConfiguration), including tests, types, etc.
- General setting page (Settings), including tests, types, etc.
- Main navigation page (menu), including tests, types, etc.

## Modified

- Improve the 'first-visit' workflow
- Modify types according to the API requirements
- General cleanup and refactoring throughout the application, due to the two points above.

## [0.0.2] - 2022-09-02

Feature: add the API prompt on first visit.
Set up global context provider, reducers, routing, form management, etc. as required.

### ADD

- Add API prompt / Connection setup feature,
- Add `react-hook-form` for managing form,
- Add `globalContext` to provide configuration through the application, pairing with a global reducer,
- Detect if it's the first visit. If so, redirect to the API prompt,
- Add test cases for all components, hooks, features, etc. Add handlers as required,
- Setup a CI/CD pipeline to staging environment,
- Add `staging` environment configuration file,

## [0.0.1] - 2022-09-02

Initial scaffolding, setting up of the structure, development and testing environment.

### ADD

- set up folders structure,
- set up dependencies,
- set up environment variables,
- set up the testing environment,
- set up mocked server,
