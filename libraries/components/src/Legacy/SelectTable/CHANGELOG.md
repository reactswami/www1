# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2022-08-02

Migrate to library

### MODIFIED

-  migrate the whole folder to the library system.

### ADDED

-  add a changelog, review the readme
-  the stylesheet has been added as a source file that can be directly used by library users.

## [2.0.0]: Initial refactoring of SelectTableV1

-  Review the architecture of the component. The Select Table is now composed of three main parts:
   -  The selector: exposes methods to be used by the body to handle different selection modes: multi, single and view only,
   -  The DOM classes: create/render the data on the screen,
   -  The controller (index): entry point of the select table. Holds the state and is in charge of re-rendering the data when needed, as well as connecting the different components.
-  Migration to TypeScript,
-  Add a 'view' only and 'single' only mode,
-  Correction of minors bugs,
-  Migration to class syntax with private fields,
-  Add unit test cases,
-  Remove unused code,
-  Extract the data fetching to the module user,
-  Expose lifecycle callback such as onError, onUpdate and onSelect,
-  Migrate to a more declarative API (using callbacks),
-  Add a pagination mode,
-  Add a legacy wrapper to use V2.0.0 in the previous code (hint: it works, but it is not enough since the previous code was tapping in internal methods a lot),

## Room for improvement / Roadmap

Unfortunately, the refactoring has been taking longer than expected so I had to leave some room for improvement!

-  Unit tests: it's a great start, but there's more to cover,
-  the architecture is still very much based on V1, there might be some improvement to be done there. Index.ts (the main class), is growing into a god class with multiple areas of responsibility which increase the coupling,
-  There is a double in re-render between select/focus, (they will both re-render dumbly without taking into account each other),
-  Some methods are repetitive and could use some refactoring,
-  The API might need improvement in the future, depending on how we use the module,
-  The code using V1 is using a lot of the internal methods, therefore I haven't been able to replace them yet with V2,
-  The build pipeline could be improved,
-  The styling could be greatly improved,
-  The stylesheet should ideally live with the module, not in the global `css/` folder,

## [1.0.0]: 'Legacy' version

The SelectTable is a multi-selection table in multiple parts of Statseeker.
It was well built but only for a narrow application.
The API was quite open and a lot of the 'inner' methods of the table could be accessed from the outside.
Also, the table has been built using ES5 and older Javascript.
V2. is an attempt to make it more reusable, generic and maintainable so we can continue building on top of it. -->
