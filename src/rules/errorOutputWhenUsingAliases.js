// const absolutePathToFile = require("./absolutePathToFile");
// const getParentFolder = require("./getParentFolder");
// const PathToCurrentFileWithoutContent = require("./pathToCurrentFileWithoutContent");
// const setModuleByName = require("./setModuleByName");

// function errorOutputWhenUsingAliases(
//     targetAliasModule,
//     importDefinitionPath,
//     pathToCurrentModule,
//     rootDirectory,
//     configurationTree
//   ) {
//     const absolutePathtoTheFileAlias = absolutePathToFile(
//       PathToCurrentFileWithoutContent(targetAliasModule.path),
//       importDefinitionPath
//     );
//     const moduleTargetLevelAliasFirstParent = setModuleByName(
//       configurationTree,
//       getParentFolder(rootDirectory, absolutePathtoTheFileAlias)
//     );
//     const moduleCurentLevelFirstParent = setModuleByName(
//       configurationTree,
//       getParentFolder(rootDirectory, PathToCurrentFileWithoutContent(pathToCurrentModule))
//     );
//     if (moduleTargetLevelAliasFirstParent.name !== moduleCurentLevelFirstParent.name) {
//       if (moduleTargetLevelAliasFirstParent.index > moduleCurentLevelFirstParent.index) {
//         return "/////////////////////////////////////////";
//       }
//     }
//   }

//   module.exports = errorOutputWhenUsingAliases