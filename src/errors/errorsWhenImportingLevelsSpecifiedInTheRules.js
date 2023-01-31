const lengthPathToFile = require("../helpers/lengthPathToFile");
const absolutePathToFile = require("../helpers/absolutePathToFile");
const PathToCurrentFileWithOutContent = require("../helpers/pathToCurrentFileWithoutContent");
const setModuleByName = require("../helpers/setModuleByName");
const comparisonOfIndexes = require("../helpers/comparisonOfIndexes");
const comparisonOfLength = require("../helpers/comparisonOfLength");
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
    equalityOfParents(configurationOfTargetModule, currentModuleLevelConfiguration) &&
    comparisonOfIndexes(configurationOfTargetModule, currentModuleLevelConfiguration)
  ) {
    errorMessage = `Cannot import ${importLevel} from ${currentModuleLevel}`;
  } else if (
    uniqualityFirstParent(configurationOfTargetModule, currentModuleLevelConfiguration) &&
    comparisonOfIndexes(firstParentConfigurationOfTargetModule, firstParentCurrentModuleLevelConfiguration)
  ) {
    errorMessage = `Cannot import ${importLevel} from ${currentModuleLevel}`;
  } else if (
    equalityOfFirstParents(configurationOfTargetModule, currentModuleLevelConfiguration) &&
    comparisonOfLength(pathToCurrentModule, absolutePathToTargetModule)
  ) {
    errorMessage = `Cannot import ${importLevel} from ${currentModuleLevel}`;
  }

  return errorMessage;
}

function uniqualityFirstParent (targetModule, currentModule) {
  return targetModule.firstParent !== currentModule.firstParent
}

function equalityOfParents (targetModule, currentModule) {
  return targetModule.parents === currentModule.parents
}

function equalityOfFirstParents (targetModule, currentModule) {
  return targetModule.firstParent === currentModule.firstParent
}

function absolutePathTo(pathToModule, importDefinitionPath) {
  return absolutePathToFile(PathToCurrentFileWithOutContent(pathToModule), importDefinitionPath);
}

