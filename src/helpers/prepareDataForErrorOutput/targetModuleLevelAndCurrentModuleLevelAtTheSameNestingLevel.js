const getPathToCurrentFileWithoutExtension = require("../convertPath/pathToCurrentFileWithoutContent");
module.exports = targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel;
/**
 *  таргет и каррент на одном уровне вложенности?
 */
function targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel(targetLevel, currentLevel) {
  if (targetLevel && currentLevel) {
    return (
      getPathToCurrentFileWithoutExtension(targetLevel.architectorPath) ===
      getPathToCurrentFileWithoutExtension(currentLevel.architectorPath)
    );
  }
}
