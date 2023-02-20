const getPathToCurrentFileWithoutExtension = require("../../convertPath/pathToCurrentFileWithoutContent");
module.exports = targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel;
/**
 *  таргет и каррент на одном уровне вложенности?
 */
function targetModuleLevelAndCurrentModuleLevelAtTheSameNestingLevel(targetLevel, currentLevel) {
  if (targetLevel && currentLevel) {
    const pathEqual = Boolean(
      getPathToCurrentFileWithoutExtension(targetLevel.architectorPath) ===
        getPathToCurrentFileWithoutExtension(currentLevel.architectorPath)
    );
    return pathEqual;
  }
}
