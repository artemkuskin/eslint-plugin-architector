const absolutePathToFile = require("./helpers/absolutePathToFile")
const PathToCurrentFileWithOutContent = require("./helpers/pathToCurrentFileWithoutContent")
const setCurrentLevel = require("./helpers/setCurrentLevel")
const setModuleByName = require("./helpers/setModuleByName")
module.exports = test
function test (importDefinitionPath, configurationTree, pathToCurrentModule) {
    const searchCurrentModuleLevelInConfigTree = (params) =>  {
        const currentModuleLevel1 = setModuleByName(configurationTree, setCurrentLevel(params)) 
        if(currentModuleLevel1 === undefined) {
          let result = params.split("/").slice(0, params.split("/").length - 1).join("/")
         return  searchCurrentModuleLevelInConfigTree(result)
        } else {
    
          return currentModuleLevel1
        }
        //console.log(currentModuleLevel1);
      }
      const asd = (params) => {
        const targetModulePath  = absolutePathToFile(pathToCurrentModule, PathToCurrentFileWithOutContent(params))
        const targetLevel = setModuleByName(configurationTree, setCurrentLevel(targetModulePath)) 
        if (targetLevel === undefined) {
          let result = params.split("/").slice(0, params.split("/").length - 1).join("/")
          return asd(result)
        } else {
          return targetLevel
        }
      
      }

        const targetModulePath  = absolutePathToFile(PathToCurrentFileWithOutContent(pathToCurrentModule), importDefinitionPath).split("/")
        const currentModulePath = pathToCurrentModule.split('/')
        let generalLevel = targetModulePath.filter(x => currentModulePath.indexOf(x) !== -1)
        const current = configurationTree.find((elem) => elem.parents === generalLevel[generalLevel.length -1]) //НЕ ПРАВИЛЬНО НАДО ПЕРЕПИСАТЬ
        const target = configurationTree.find((elem) => elem.parents === generalLevel[generalLevel.length -1] && elem.name === targetModulePath[targetModulePath.length -2])
        console.log(current, target);
        
      
      return {a: searchCurrentModuleLevelInConfigTree(pathToCurrentModule), b: asd(importDefinitionPath)}
}