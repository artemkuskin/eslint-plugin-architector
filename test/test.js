const validateHierarchy = require("../src");

describe("Validate hierarchy with default config", () => {
  const filePath = "/home/artem/my-app/src/A/A1/A2/A22/A22.jsx";

  const hierarchy = {
    file: [
      {
        level: "D",
        children: [],
      },
      {
        level: "ui-lib",
        children: [],
      },
      {
        level: "A",
        children: [
          {
            level: "A1",
            children: [
              {
                level: "A2",
                children: [],
              },
            ],
          },
          {
            level: "A3",
            children: [],
          },
        ],
      },
      {
        level: "B",
        children: [
          {
            level: "B1",
            children: [],
          },
        ],
      },
      {
        level: "C",
        children: [],
      },
    ],
  };

  const componentFolder = "src";

  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: "/home/artem/my-app/src/ui-lib/inde.jsx",
  //     importDefinitionPath: "../A/A1/A1",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });
  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: "/home/artem/my-app/src/ui-lib/inde.jsx",
  //     importDefinitionPath: "../B/B",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });

  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: filePath,
  //     importDefinitionPath: "../../../../public/asd",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });
  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: filePath,
  //     importDefinitionPath: "A/A",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });
  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: filePath,
  //     importDefinitionPath: "C/C.jsx",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });
  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: filePath,
  //     importDefinitionPath: "B3/B3",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });
  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: filePath,
  //     importDefinitionPath: "B1/B1",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });
  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: filePath,
  //     importDefinitionPath: "../../../../B/B",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });
  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: filePath,
  //     importDefinitionPath: "../../../../D",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });
  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: filePath,
  //     importDefinitionPath: "../A2",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });
  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: filePath,
  //     importDefinitionPath: "../../A1",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });
  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: "/home/artem/my-app/src/D.jsx",
  //     importDefinitionPath: "./A/A.jsx",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });

  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: "filePath",
  //     importDefinitionPath: "./A/A3/A3.jsx",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });
  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: "/home/artem/my-app/src/D.jsx",
  //     importDefinitionPath: "./B/B",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });

  it("allow downward import", () => {
    const errors = validateHierarchy({
      pathToCurrentModule: "/home/artem/my-app/src/A/A1/A1.jsx",
      importDefinitionPath: "A3/A3.jsx",
      levelsConfiguration: hierarchy,
      rootDirectory: componentFolder,
    });
    expect(errors).toEqual(undefined);
  });
  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: "/home/artem/my-app/src/A/A.jsx",
  //     importDefinitionPath: "./A1/A2/A2.jsx",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });
  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: "/home/artem/my-app/src/A/A.jsx",
  //     importDefinitionPath: "A3/A3.jsx",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });

  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: "/home/artem/my-app/src/D.jsx",
  //     importDefinitionPath: "./A/A.jsx",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });
  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: "/home/artem/my-app/src/D.jsx",
  //     importDefinitionPath: "A3/A3.jsx",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });
  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: "/home/artem/my-app/src/D.jsx",
  //     importDefinitionPath: "./A/A1/A2/A22/A22.jsx",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });
  // it("allow downward import", () => {
  //   const errors = validateHierarchy({
  //     pathToCurrentModule: "/home/artem/my-app/src/D.jsx",
  //     importDefinitionPath: "./B/B",
  //     levelsConfiguration: hierarchy,
  //     rootDirectory: componentFolder,
  //   });
  //   expect(errors).toEqual(undefined);
  // });
});
