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
        const lastParent = getAllParentThisNode(levelsConfiguration.file, architectureConfigRules[key].level);
        architectureConfigTree.push({
          name: architectureConfigRules[key].level,
          index: key,
          parents: lastParent || rootDirectory
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
   // console.log(currentModuleLevel);
    
    if (currentModuleLevel) {
      const configurationTree = getArchitectureConfigurationTree(levelsConfiguration.file);
      //console.log(configurationTree);

      const currentModuleLevelConfiguration = configurationTree.find((elem) => elem.name === currentModuleLevel);

      const targetModuleLevel = checkTargetModuleLevel(configurationTree, importDefinitionPath)
      if (targetModuleLevel) {
        const parentTargetModule = configurationTree.find((elem) => elem.name === targetModuleLevel[1]);
        const partsOfPathToTargetModule = importDefinitionPath.split("/");
        const importLevel = partsOfPathToTargetModule[partsOfPathToTargetModule.length - 2]; //куда импортим
       // console.log(partsOfPathToTargetModule);
        const configurationOfTargetModule = configurationTree.find((elem) => elem.name === importLevel);
        //console.log(configurationOfTargetModule);
       console.log(currentModuleLevelConfiguration);
       console.log(configurationOfTargetModule);
       console.log(parentTargetModule);
        if (configurationOfTargetModule) {

        if (currentModuleLevelConfiguration.parents === configurationOfTargetModule.parents) {
          if (configurationOfTargetModule.index >= currentModuleLevelConfiguration.index) {
            return `Cannot import ${importLevel} from ${currentModuleLevel}`;
          }
        } else if (currentModuleLevelConfiguration.name !== configurationOfTargetModule.parents) {
          return `import prohibited due to different nesting levels`;
         }
         } else {
          if (currentModuleLevelConfiguration.parents === parentTargetModule.parents) {
              if (parentTargetModule.index >=  currentModuleLevelConfiguration.index) {
                return `???????????????????????`
              }
            } else if (currentModuleLevelConfiguration.name !== configurationOfTargetModule.parents) {
              return "xzxxxxxxxxxxx"
            }
            // } else if (currentModuleLevelConfiguration.parents !== parentTargetModule.parents)
         } //else if (currentModuleLevelConfiguration.parents !== configurationOfTargetModule.parents) {
        //   if (parentTargetModule.index >=  currentModuleLevelConfiguration.index) {
        //     return `???????????????????????`
        //   }
        // }
      }
    }
  }
}

function checkTargetModuleLevel  (configurationTree, importDefinitionPath)  {
  const levelsNames = configurationTree.map((levelConfiguration) => levelConfiguration.name);

  const levelsNamesString = levelsNames.reduce((acc, cur) => {
    return `${acc}|${cur}`;
  });

  const targetModuleLevel = new RegExp(`(${levelsNamesString})`, "g").exec(importDefinitionPath);
  //console.log(targetModuleLevel);
  return targetModuleLevel
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
  
  return parents[parents.length - 2];
}

// const architectureConfigTree = [];
// function getArchitectureConfigurationTree(architectureConfigRules) {
//   for (let key in architectureConfigRules) {
//     const lastParent = getAllParentThisNode(architectureConfigRules, architectureConfigRules[key].level);
//     architectureConfigTree.push({ name: architectureConfigRules[key].level, index: key, parents: lastParent || "" });
//     if (architectureConfigRules[key].children.length !== 0) {
//       getArchitectureConfigurationTree(architectureConfigRules[key].children);
//     }
//   }

//   return architectureConfigTree;
// };
//console.log(architectureConfigTree);







// const TreeModel = require("tree-model");

// function getAllParentThisNode(dataset, nodeLevel) {
//   let parents = [];
//   tree = new TreeModel();
//   dataset.forEach((element) => {
//     let rootMain = tree.parse(element);
//     rootMain.walk(function (node) {
//       if (node.model.level === nodeLevel) {
//         let x = node.getPath();
//         x.forEach((element) => {
//           parents.push(element.model.level);
//         });
//       }
//     });
//   });
//   return parents[parents.length - 2];
// }

// function validateHierarchy(filePath, importPath, hierarchy, componentFolder) {
//   const rootFolder = new RegExp(`${componentFolder}\\/(\\w+)`, "g").exec(filePath);
//   const pathFolder = filePath.split("/");
//   if (rootFolder) {
//     const fileLevel = pathFolder[pathFolder.length - 2];
//     const allFiles = [];
//     const searchChildren = (arr) => {
//       for (let key in arr) {
//         const lastParent = getAllParentThisNode(hierarchy.file, arr[key].level);
//         allFiles.push({ name: arr[key].level, index: key, parents: lastParent || "" });
//         if (arr[key].children.length !== 0) {
//           searchChildren(arr[key].children);
//         }
//       }
//       console.log(allFiles);
//       return allFiles;
//     };
//     const result = searchChildren(hierarchy.file);

//     const importFolder = result.find((elem) => elem.name === fileLevel);
//     if (fileLevel) {
//       const files = [];
//       for (let key in result) {
//         files.push(result[key].name);
//       }
//       const levelsGroup = files.reduce((acc, cur) => {
//         return `${acc}|${cur}`;
//       });

//       const res = new RegExp(`(${levelsGroup})`, "g").exec(importPath);
//       if (res) {
//         const nameFile = importPath.split("/");
//         const importLevel = nameFile[nameFile.length - 2]; //куда импортим
//         const importFromFile = result.find((elem) => elem.name === importLevel);
//         if (importFolder.parents === importFromFile.parents) {
//           if (importFromFile.index >= importFolder.index) {
//             return `Cannot import ${importLevel} from ${fileLevel}`;
//           }
//         } else if (importFolder.name !== importFromFile.parents) {
//           return `Cannot import ${importLevel} from ${fileLevel}`;
//         }
//       }
//     }
//   }
// }

// module.exports = validateHierarchy;