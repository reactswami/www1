import * as path from 'path';

import {
   type TargetConfiguration,
   type Tree,
   addProjectConfiguration,
   formatFiles,
   generateFiles,
   getWorkspaceLayout,
   joinPathFragments,
   logger,
   names,
   offsetFromRoot,
} from '@nrwl/devkit';
import { type ReactAppGeneratorSchema } from './schema';

interface NormalizedSchema extends ReactAppGeneratorSchema {
   projectName: string;
   projectRoot: string;
   offsetFromRoot: string;
   projectDirectory: string;
   parsedTags: string[];
}

function normalizeOptions(tree: Tree, options: ReactAppGeneratorSchema): NormalizedSchema {
   const name = names(options.name).fileName;
   const projectDirectory = options.directory
      ? `${names(options.directory).fileName}/${name}`
      : name;
   const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
   const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
   const parsedTags = options.tags ? options.tags.split(',').map((s) => s.trim()) : [];

   return {
      ...options,
      projectName,
      projectRoot,
      offsetFromRoot: offsetFromRoot(projectRoot),
      projectDirectory,
      parsedTags,
   };
}

function addFiles(tree: Tree, options: NormalizedSchema) {

   const templateOptions = {
      ...options,
      ...names(options.name),
      rootTsConfigPath: `${options.offsetFromRoot}tsconfig.base.json`,
      offsetFromRoot: offsetFromRoot(options.projectRoot),
      template: '',
   };
   generateFiles(tree, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}

export default async function (tree: Tree, options: ReactAppGeneratorSchema) {
   const normalizedOptions = normalizeOptions(tree, options);
   addProjectConfiguration(
      tree,
      normalizedOptions.projectName,
      {
         root: normalizedOptions.projectRoot,
         projectType: 'application',
         sourceRoot: `${normalizedOptions.projectRoot}/src`,
         targets: {
            build: createBuildTarget(normalizedOptions),
            lint: createLintTarget(normalizedOptions),
         },
         tags: normalizedOptions.parsedTags,
      },
      true
   );
   addFiles(tree, normalizedOptions);
   await formatFiles(tree);

   return () => {
      logger.info('🎉 Success 🎉');
      logger.info(
         "Project successfully created. Don't forget to run `yarn` to install the dependencies."
      );
   };
}

function createBuildTarget(options: NormalizedSchema): TargetConfiguration {
   return {
      executor: '@nx/vite:build',
      options: {
         outputPath: joinPathFragments('dist/packages', options.projectName),
         deleteOutputPath: true, // Note: Important we keep this set to true. Builds to cached directory and we don't want stale files from older or newer branches getting into the current build.
         tsConfig: joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
      }
   };
}

function createLintTarget(options: NormalizedSchema): TargetConfiguration {
   return {
      executor: 'nx:run-commands',
      outputs: ['{options.outputFile}'],
      options: {
         command: 'eslint . --quiet',
         cwd: joinPathFragments(options.projectRoot, 'src'),
         lintFilePatterns: [joinPathFragments(options.projectRoot, '**/*.{ts,tsx,js,jsx}')],
      },
   };
}
