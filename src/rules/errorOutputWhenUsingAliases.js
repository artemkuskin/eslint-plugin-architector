const absolutePathToFile = require("./absolutePathToFile");
const getParentFolder = require("./getParentFolder");
const PathToCurrentFileWithoutContent = require("./pathToCurrentFileWithoutContent");
const setModuleByName = require("./setModuleByName");

function errorOutputWhenUsingAliases(
    targetAliasModule,
    importDefinitionPath,
    pathToCurrentModule,
    rootDirectory,
    configurationTree
  ) {
    const absolutePathtoTheFileAlias = absolutePathToFile(
      PathToCurrentFileWithoutContent(targetAliasModule.path),
      importDefinitionPath
    );
    const moduleTargetLevelAliasFirstName = setModuleByName(
      configurationTree,
      getParentFolder(rootDirectory, absolutePathtoTheFileAlias)
    );
    const moduleCurentLevelFirstName = setModuleByName(
      configurationTree,
      getParentFolder(rootDirectory, PathToCurrentFileWithoutContent(pathToCurrentModule))
    );
    if (moduleTargetLevelAliasFirstName.name !== moduleCurentLevelFirstName.name) {
      if (moduleTargetLevelAliasFirstName.index > moduleCurentLevelFirstName.index) {
        return "/////////////////////////////////////////";
      }
    }
  }

  module.exports = errorOutputWhenUsingAliases