const fs = require("fs");
const path = require("path");
const TreeModel = require("tree-model");

module.exports = validateIfImportIsAllowed;

const architectureConfigTree = [];
let jsConfigFileContent = undefined;
function setJsConfigFile() {
  try {
    jsConfigFileContent = require(path.resolve("jsconfig.json"));
  } catch {
    jsConfigFileContent = null;
  }
}
/**
 *  This function is running by eslint every time.
 * @param {String} pathToCurrentModule - module in which we write import definition
 * @param {String} importDefinitionPath
 * @param {Object} levelsConfiguration
 * @param {String} rootDirectory
 */

function validateIfImportIsAllowed(pathToCurrentModule, importDefinitionPath, levelsConfiguration, rootDirectory) {
  getJsConfug();

  if (Boolean(getParentFolder(rootDirectory, pathToCurrentModule))) {
    const configurationTree = getArchitectureConfigurationTree(
      levelsConfiguration.file,
      levelsConfiguration,
      rootDirectory
    );
    const targetModuleLevel = checkTargetModuleLevel(configurationTree, importDefinitionPath);

    if (jsConfigFileContent) {
      const targetAliasModule = getLevelAlias(rootDirectory).find(
        (elem) => elem.key === importDefinitionPath.split("/")[0]
      );
      if (targetAliasModule) {
        return errorOutputWhenUsingAliases(
          targetAliasModule,
          importDefinitionPath,
          pathToCurrentModule,
          rootDirectory,
          configurationTree
        );
      }
    }

    if (targetModuleLevel) {
      return errorIfNotAlias(configurationTree, pathToCurrentModule, importDefinitionPath, rootDirectory);
    }
  }
}

function getJsConfug() {
  if (jsConfigFileContent === undefined) {
    setJsConfigFile();
  }
}

function errorIfNotAlias(configurationTree, pathToCurrentModule, importDefinitionPath, rootDirectory) {
  const currentModuleLevel = setCurrentLevel(pathToCurrentModule);
  const importLevel = setCurrentLevel(importDefinitionPath);
  const currentModuleLevelConfiguration = setModuleByName(configurationTree, currentModuleLevel);
  const configurationOfTargetModule = setModuleByName(configurationTree, importLevel);
  if (configurationOfTargetModule && currentModuleLevelConfiguration) {
    return outputOfErrorsWhenImportingLevelsSpecifiedInTheRules(
      currentModuleLevelConfiguration,
      configurationOfTargetModule,
      importLevel,
      currentModuleLevel,
      configurationTree
    );
  } else {
    return errorWhenImportingLevelsNotIncludedInRules(
      configurationTree,
      rootDirectory,
      pathToCurrentModule,
      importDefinitionPath,
      importLevel,
      currentModuleLevel
    );
  }
}

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

function setModuleByName(configurationTree, name) {
  return configurationTree.find((elem) => elem.name === name);
}

function setCurrentLevel(pathToModule) {
  return pathToModule.split("/")[pathToModule.split("/").length - 2];
}
/**
 *
 * @param {String} pathToCurrentModule
 * @param {String} importDefinitionPath
 * @param {String} rootDirectory
 * @param {Array} configurationTree
 */

/**
 *
 * @param {Object} currentModuleLevelConfiguration
 * @param {Object} configurationOfTargetModule
 * @param {String} importLevel
 * @param {String} currentModuleLevel
 * @param {Array} configurationTree
 */
function outputOfErrorsWhenImportingLevelsSpecifiedInTheRules(
  currentModuleLevelConfiguration,
  configurationOfTargetModule,
  importLevel,
  currentModuleLevel,
  configurationTree
) {
  if (currentModuleLevelConfiguration.parents === configurationOfTargetModule.parents) {
    if (configurationOfTargetModule.index >= currentModuleLevelConfiguration.index) {
      return `Cannot import ${importLevel} from ${currentModuleLevel}`;
    }
  } else if (currentModuleLevelConfiguration.firstParent !== configurationOfTargetModule.firstParent) {
    const firstParentCurrentModuleLevelConfiguration = setModuleByName(
      configurationTree,
      currentModuleLevelConfiguration.firstParent
    );
    const firstParentConfigurationOfTargetModule = setModuleByName(
      configurationTree,
      configurationOfTargetModule.firstParent
    );
    if (firstParentConfigurationOfTargetModule.index >= firstParentCurrentModuleLevelConfiguration.index) {
      return `${path.resolve("jsconfig.json")}`;
    }
  }
}

function PathToCurrentFileWithoutContent(relativePath) {
  return relativePath
    .split("/")
    .slice(0, relativePath.split("/").length - 1)
    .join("/");
}

function absolutePathToFile(pathToCurrentModule, importDefinitionPath) {
  return path.resolve(pathToCurrentModule, importDefinitionPath);
}

/**
 *
 * @param {Object} targetAliasModule
 * @param {String} importDefinitionPath
 * @param {String} pathToCurrentModule
 * @param {String} rootDirectory
 * @param {Array} configurationTree
 */
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

/**
 *
 * @param {Array} architectureConfigRules
 * @param {Array} levelsConfiguration
 * @param {String} rootDirectory
 * @returns
 */
function getArchitectureConfigurationTree(architectureConfigRules, levelsConfiguration, rootDirectory) {
  for (let key in architectureConfigRules) {
    const lastParent = getAllParentThisNode(levelsConfiguration.file, architectureConfigRules[key].level).lastParent;
    const firstParent = getAllParentThisNode(levelsConfiguration.file, architectureConfigRules[key].level).firstParent;
    architectureConfigTree.push({
      name: architectureConfigRules[key].level,
      index: key,
      parents: lastParent || rootDirectory,
      firstParent: firstParent,
      children: architectureConfigRules[key].children,
    });
    if (architectureConfigRules[key].children.length !== 0) {
      getArchitectureConfigurationTree(architectureConfigRules[key].children, levelsConfiguration, rootDirectory);
    }
  }
  let resultarchitectureFree = architectureConfigTree.reduce(
    (acc, file) => {
      if (acc.map[file.name]) return acc;
      acc.map[file.name] = true;
      acc.resultarchitectureFree.push(file);
      return acc;
    },
    {
      map: {},
      resultarchitectureFree: [],
    }
  ).resultarchitectureFree;
  return resultarchitectureFree;
}
/**
 *
 * @param {String} rootDirectory
 * @param {String} absolutePathToTheFile
 * @returns
 */
function getParentFolder(rootDirectory, absolutePathToTheFile) {
  let parent = new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(absolutePathToTheFile);
  return parent[1];
}
/**
 *
 * @param {String} rootDirectory
 */
function getLevelAlias(rootDirectory) {
  const parentsAlias = [];
  for (let key in jsConfigFileContent.compilerOptions.paths) {
    parentsAlias.push({ name: jsConfigFileContent.compilerOptions.paths[key].toString(), key: [key].toString() });
  }
  const configurationTreeAlias = [];
  for (let key in parentsAlias) {
    configurationTreeAlias.push({
      key: PathToCurrentFileWithoutContent(parentsAlias[key].key),
      path: path
        .resolve(
          parentsAlias[key].name.split("/").splice(0, parentsAlias[key].name.split("/").length).join("/"),
          rootDirectory
        )
        .split("/")
        .splice(
          0,
          absolutePathToFile(PathToCurrentFileWithoutContent(parentsAlias[key].name), rootDirectory).split("/").length -
            1
        )
        .join("/"),
    });
  }
  return configurationTreeAlias;
}

/**
 *
 * @param {Array} configurationTree
 * @param {String} importDefinitionPath
 * @returns
 */
function checkTargetModuleLevel(configurationTree, importDefinitionPath) {
  const levelsNames = configurationTree.map((levelConfiguration) => levelConfiguration.name);

  const levelsNamesString = levelsNames.reduce((acc, cur) => {
    return `${acc}|${cur}`;
  });

  const targetModuleLevel = new RegExp(`(${levelsNamesString})`, "g").exec(importDefinitionPath);
  return targetModuleLevel;
}

/**
 *
 * @param {Array} dataset
 * @param {String} nodeLevel
 * @returns
 */
function getAllParentThisNode(dataset, nodeLevel) {
  let parents = [];
  tree = new TreeModel();
  dataset.forEach((element) => {
    let rootMain = tree.parse(element);
    rootMain.walk(function (node) {
      if (node.model.level === nodeLevel) {
        let x = node.getPath();
        x.forEach((element) => {
          parents.push(element.model.level);
        });
      }
    });
  });

  return { lastParent: parents[parents.length - 2], firstParent: parents[0] };
}
