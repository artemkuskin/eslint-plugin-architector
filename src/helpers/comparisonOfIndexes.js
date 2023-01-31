function comparisonOfIndexes(targetModule, currentModule) {
    return targetModule.index >= currentModule.index;
  }

  module.exports = comparisonOfIndexes