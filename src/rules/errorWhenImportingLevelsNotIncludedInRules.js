const absolutePathToFile = require("./absolutePathToFile");
const getParentFolder = require("./getParentFolder");
const PathToCurrentFileWithoutContent = require("./pathToCurrentFileWithoutContent");
const setModuleByName = require("./setModuleByName");

function errorWhenImportingLevelsNotIncludedInRules(
  configurationTree,
  rootDirectory,
  pathToCurrentModule,
  importDefinitionPath,
  importLevel,
  currentModuleLevel,
  targetAliasModule
) {
  if (targetAliasModule) {
    const absolutePathtoTheFileAlias = absolutePathToFile(
      PathToCurrentFileWithoutContent(targetAliasModule.path),
      importDefinitionPath
    );
    const moduleTargetLevelAliasFirstParent = setModuleByName(
      configurationTree,
      getParentFolder(rootDirectory, absolutePathtoTheFileAlias)
    );
    const moduleCurentLevelFirstParent = setModuleByName(
      configurationTree,
      getParentFolder(rootDirectory, PathToCurrentFileWithoutContent(pathToCurrentModule))
    );

    if (moduleTargetLevelAliasFirstParent.name !== moduleCurentLevelFirstParent.name) {
      if (moduleTargetLevelAliasFirstParent.index > moduleCurentLevelFirstParent.index) {
        return "/////////////////////////////////////////";
      }
    }
  } else {
    const moduleTargetLevelFirstParent = setModuleByName(
      configurationTree,
      getParentFolder(
        rootDirectory,
        absolutePathToFile(PathToCurrentFileWithoutContent(pathToCurrentModule), importDefinitionPath)
      )
    );
    const moduleCurrentLevelFirstParent = setModuleByName(
      configurationTree,
      getParentFolder(rootDirectory, PathToCurrentFileWithoutContent(pathToCurrentModule))
    );
    if (
      moduleTargetLevelFirstParent.name !== moduleCurrentLevelFirstParent.name &&
      moduleCurrentLevelFirstParent.index < moduleTargetLevelFirstParent.index
    ) {
      return `Cannot import ${importLevel} from ${currentModuleLevel}`;
    }
    if (
      moduleTargetLevelFirstParent.name === moduleCurrentLevelFirstParent.name &&
      pathToCurrentModule.split("/").length >
        absolutePathToFile(PathToCurrentFileWithoutContent(pathToCurrentModule), importDefinitionPath).split("/").length
    ) {
      return "qwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww";
    }
  }
}

module.exports = errorWhenImportingLevelsNotIncludedInRules;
