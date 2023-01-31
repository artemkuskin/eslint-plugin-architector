const lengthPathToFile = require("../helpers/lengthPathToFile");
const absolutePathToFile = require("../helpers/absolutePathToFile");
const PathToCurrentFileWithOutContent = require("../helpers/pathToCurrentFileWithoutContent");
const setModuleByName = require("../helpers/setModuleByName");
module.exports = outputOfErrorsWhenImportingLevelsSpecifiedInTheRules;

function outputOfErrorsWhenImportingLevelsSpecifiedInTheRules(
  currentModuleLevelConfiguration,
  configurationOfTargetModule,
  importLevel,
  currentModuleLevel,
  configurationTree,
  importDefinitionPath,
  pathToCurrentModule
) {
  let errorMessage = undefined;
  const firstParentCurrentModuleLevelConfiguration = setModuleByName(
    configurationTree,
    currentModuleLevelConfiguration.firstParent
  );
  const firstParentConfigurationOfTargetModule = setModuleByName(
    configurationTree,
    configurationOfTargetModule.firstParent
  );
  const absolutePathToTargetModule = absolutePathTo(pathToCurrentModule, importDefinitionPath);
  if (
    currentModuleLevelConfiguration.parents === configurationOfTargetModule.parents &&
    configurationOfTargetModule.index >= currentModuleLevelConfiguration.index
  ) {
    errorMessage = `Cannot import ${importLevel} from ${currentModuleLevel}`;
  } else if (
    currentModuleLevelConfiguration.firstParent !== configurationOfTargetModule.firstParent &&
    firstParentConfigurationOfTargetModule.index >= firstParentCurrentModuleLevelConfiguration.index
  ) {
    errorMessage = `Cannot import ${importLevel} from ${currentModuleLevel}`;
  } else if (
    currentModuleLevelConfiguration.firstParent === configurationOfTargetModule.firstParent &&
    lengthPathToFile(absolutePathToTargetModule) < lengthPathToFile(pathToCurrentModule)
  ) {
    errorMessage = `Cannot import ${importLevel} from ${currentModuleLevel}`;
  }

  return errorMessage;
}

function absolutePathTo(pathToModule, importDefinitionPath) {
  return absolutePathToFile(PathToCurrentFileWithOutContent(pathToModule), importDefinitionPath);
}

