import * as path from 'path';

import {
   type Tree,
   formatFiles,
   generateFiles,
   names,
   readProjectConfiguration,
} from '@nrwl/devkit';

import { type ReactComponentGeneratorSchema } from './schema';

interface NormalizedSchema extends ReactComponentGeneratorSchema {
   componentName: string;
   target: string;
}

function normalizeOptions(
   tree: Tree,
   options: ReactComponentGeneratorSchema
): NormalizedSchema {
   const pascalCaseComponentName = names(options.name).className;
   const project = readProjectConfiguration(tree, options.project);
   const destination = `${project.sourceRoot}/${options.directory}/`;

   return {
      ...options,
      target: destination,
      componentName: pascalCaseComponentName,
   };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
   const templateOptions = {
      ...options,
      ...names(options.name),
      template: '',
   };
   generateFiles(
      tree,
      path.join(__dirname, 'files'),
      options.target,
      templateOptions
   );

   for (const file of tree.listChanges()) {
      if (options.skipTests && /.*spec.tsx/.test(file.path)) {
         tree.delete(file.path);
      }
   }
}

export default async function (
   tree: Tree,
   options: ReactComponentGeneratorSchema
) {
   const normalizedOptions = normalizeOptions(tree, options);
   addFiles(tree, normalizedOptions);
   await formatFiles(tree);
}
