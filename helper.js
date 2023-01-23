const path = require("path");
const TreeModel = require("tree-model");
module.exports = validateIfImportIsAllowed;

function validateIfImportIsAllowed(pathToCurrentModule, importDefinitionPath, levelsConfiguration, rootDirectory) {
  const currentModuleIsInRootDirectory = Boolean(
    new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(pathToCurrentModule)
  );

  if (currentModuleIsInRootDirectory) {
    const partsOfPathToCurrentModule = pathToCurrentModule.split("/");
    const architectureConfigTree = [];
    function getArchitectureConfigurationTree(architectureConfigRules) {
      for (let key in architectureConfigRules) {
        const lastParent = getAllParentThisNode(
          levelsConfiguration.file,
          architectureConfigRules[key].level
        ).lastParent;
        const firstParent = getAllParentThisNode(
          levelsConfiguration.file,
          architectureConfigRules[key].level
        ).firstParent;
        architectureConfigTree.push({
          name: architectureConfigRules[key].level,
          index: key,
          parents: lastParent || rootDirectory,
          firstParent: firstParent,
          children: architectureConfigRules[key].children,
        });
        if (architectureConfigRules[key].children.length !== 0) {
          getArchitectureConfigurationTree(architectureConfigRules[key].children);
        }
      }
      return architectureConfigTree;
    }

    // не все папки указаны в конфиге!
    // модуль может не принадлежать ни одному уровню!

    const currentModuleLevel = partsOfPathToCurrentModule[partsOfPathToCurrentModule.length - 2];

    if (currentModuleLevel) {
      const configurationTree = getArchitectureConfigurationTree(levelsConfiguration.file);

      const currentModuleLevelConfiguration = configurationTree.find((elem) => elem.name === currentModuleLevel);
      console.log(currentModuleLevel);

      const targetModuleLevel = checkTargetModuleLevel(configurationTree, importDefinitionPath);
      if (targetModuleLevel) {
        const parentTargetModule = configurationTree.find((elem) => elem.name === targetModuleLevel[1]);
        const partsOfPathToTargetModule = importDefinitionPath.split("/");
        const importLevel = partsOfPathToTargetModule[partsOfPathToTargetModule.length - 2];
        const configurationOfTargetModule = configurationTree.find((elem) => elem.name === importLevel);

        if (configurationOfTargetModule && currentModuleLevelConfiguration) {
          if (currentModuleLevelConfiguration.parents === configurationOfTargetModule.parents) {
            if (configurationOfTargetModule.index >= currentModuleLevelConfiguration.index) {
              return `Cannot import ${importLevel} from ${currentModuleLevel}`;
            }
          } else if (currentModuleLevelConfiguration.firstParent !== configurationOfTargetModule.firstParent) {
            const firstParentCurrentModuleLevelConfiguration = configurationTree.find(
              (elem) => elem.name === currentModuleLevelConfiguration.firstParent
            );
            const firstParentConfigurationOfTargetModule = configurationTree.find(
              (elem) => elem.name === configurationOfTargetModule.firstParent
            );
            if (firstParentConfigurationOfTargetModule.index >= firstParentCurrentModuleLevelConfiguration.index) {
              return "qqqqqqqqqqqqqqqqqqqqqqqqqqqq";
            }
          }
        } else {
          const pathToCurrentFile = pathToCurrentModule
            .split("/")
            .splice(0, pathToCurrentModule.split("/").length - 1)
            .join("/");
          const configurationTree = getArchitectureConfigurationTree(levelsConfiguration.file);
          const absolutePathToTheFile = path.resolve(pathToCurrentFile, importDefinitionPath);
          const firstParent = new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(absolutePathToTheFile);
          const moduleTargetLevelFirstName = configurationTree.find((elem) => elem.name === firstParent[1]); //что импортим
          const firstParentcCurrentLevel = new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(pathToCurrentFile);
          const firstParentAliasTargetLevel = new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(importDefinitionPath)
          const moduleAliasTargetLevelFirstName = configurationTree.find((elem) => elem.name === firstParentAliasTargetLevel[1]); //что импортим
          const moduleCurrentLevelFirstName = configurationTree.find(
            (elem) => elem.name === firstParentcCurrentLevel[1]
          ); //куда
          console.log(firstParentAliasTargetLevel, firstParentcCurrentLevel);
          if (moduleTargetLevelFirstName.name !== moduleCurrentLevelFirstName.name) {
            if (moduleCurrentLevelFirstName.index < moduleTargetLevelFirstName.index) {
              return `adasdasdasdasd`;
            }
          } 
          if (moduleTargetLevelFirstName.name === moduleCurrentLevelFirstName.name) {
            const pathToCurrentFile = pathToCurrentModule
            .split("/")
            .splice(0, pathToCurrentModule.split("/").length - 1)
            .join("/");
            const absolutePathToTheFile = path.resolve(pathToCurrentFile, importDefinitionPath);
            if (pathToCurrentModule.split("/").length > absolutePathToTheFile.split("/").length) {
              return "qwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
            }

          }
          else if (moduleCurrentLevelFirstName.name !== moduleAliasTargetLevelFirstName.name) {
           if (moduleCurrentLevelFirstName.index > moduleAliasTargetLevelFirstName.index) {
            return "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
           }
          }
        }
      }
    }
  }
}

function checkTargetModuleLevel(configurationTree, importDefinitionPath) {
  const levelsNames = configurationTree.map((levelConfiguration) => levelConfiguration.name);

  const levelsNamesString = levelsNames.reduce((acc, cur) => {
    return `${acc}|${cur}`;
  });

  const targetModuleLevel = new RegExp(`(${levelsNamesString})`, "g").exec(importDefinitionPath);
  return targetModuleLevel;
}

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

// const fs = require('fs');
// const path = require('path');

// function flatten(lists) {
//   return lists.reduce((a, b) => a.concat(b), []);
// }

// function getDirectories(srcpath) {
//   return fs.readdirSync(srcpath)
//     .map(file => path.join(srcpath, file))
//     .filter(path => fs.statSync(path).isDirectory());
// }

// function getDirectoriesRecursive(srcpath) {
//   return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
// }

// const foldersName =  getDirectoriesRecursive(path.resolve(__dirname, "MyFolder"))
// const arr = []
// const formStructur = () => {
//     for (let key in foldersName) {
//  const targetFolder = foldersName[key].split('/')
//  console.log(targetFolder);
//     arr.push({level: targetFolder[targetFolder.length-1], index:key, parents: targetFolder[targetFolder.length-2]} )
// // console.log(targetFolder[targetFolder.length - 1]);
// }
// return arr
// }
// console.log(formStructur());
