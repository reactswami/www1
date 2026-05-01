# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.8] - 2022-12-20

Change the active background color of the primary button, it was an ugly blue 🤮

## [0.0.7] - 2022-11-28

Add the background color in the theme (same as the Dashboard)

## [0.0.6] - 2022-11-17

Improve the Form Label component to match the work done on the ui-library component.

## [0.0.5] - 2022-11-04

Add the form control component

## [0.0.4] - 2022-08-17

Reorganise code, remove dead code, and add Input styles.

### ADDED

-  Input styles (`components/Input`)

### MODIFIED

-  Remove dead code and reorganise around Chakra/Styled system naming: foundations for design tokens, components for ... you guessed it, components.

## [0.0.3] - 2022-08-09

Review colors, typography, Button styles and borderRadius.
Change library to non-buildable.

### ADDED

-  add border radii,
-  add `button` to typography,
-  add more colors shades to `primary` and `secondary`,
-  add `50` levels to all colors,

### MODIFIED

-  ui-theme is not buildable anymore: there are no advantages in doing so (only one project uses it) and it makes watch mode difficult,

## [0.0.2] - 2022-08-05

Minor changes to the typography, and spacing.

## MODIFIED

-  change the h4 and h5 title colors for more readability.

## ADDED

-  Add an extra layer to the spacing (`base`).

## [0.0.1] - 2022-08-03

Initial creation: first draft of the @statseeker/theme.

## ADDED

-  Add colors.
-  Add typography.
-  Add spacing.
-  Add tests and set up snapshots tests for the page 'color' and 'typography'.
