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
    currentModuleLevel
  ) {
    const moduleTargetLevelFirstName = setModuleByName(
      configurationTree,
      getParentFolder(
        rootDirectory,
        absolutePathToFile(PathToCurrentFileWithoutContent(pathToCurrentModule), importDefinitionPath)
      )
    );
    const moduleCurrentLevelFirstName = setModuleByName(
      configurationTree,
      getParentFolder(rootDirectory, PathToCurrentFileWithoutContent(pathToCurrentModule))
    );
    if (
      moduleTargetLevelFirstName.name !== moduleCurrentLevelFirstName.name &&
      moduleCurrentLevelFirstName.index < moduleTargetLevelFirstName.index
    ) {
      return `Cannot import ${importLevel} from ${currentModuleLevel}`;
    }
    if (
      moduleTargetLevelFirstName.name === moduleCurrentLevelFirstName.name &&
      pathToCurrentModule.split("/").length >
        absolutePathToFile(PathToCurrentFileWithoutContent(pathToCurrentModule), importDefinitionPath).split("/").length
    ) {
      return "qwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww";
    }
  }

  module.exports = errorWhenImportingLevelsNotIncludedInRules