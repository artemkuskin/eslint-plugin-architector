const validateHierarchy = require("../src/rules/helper");

describe("Validate hierarchy with default config", () => {
  const filePath = "/home/artem/my-app/src/A/A1/A2/A2.jsx";
 

  const hierarchy =  [
      {
        level: "src",
        children: [
          {
            level: "A",
            children: [
              {
                level: "A1",
                children: [],
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
              }
              //   {
              //     level: "B1",
              //     children: [
              //       {
              //         level: "B2",
              //         children: []
              //         },
              //     ]
              //     },
              //     {
              //       level: "B3",
              //       children: []
              //       },
              // ]
            ],
          },
          {
            level: "C",
            children: [],
          },
        ],
      },
      // {
      //   level: "templates",
      //   children: [],
      // },
    ]
    // atoms: 0,
    // molecules: 1,
    // organisms: 2,
    // templates: 3,
    // pages: 4
  

  const componentFolder = "src";

  it("allow downward import", () => {
    const errors = validateHierarchy(filePath, "../../A", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });
  it("allow downward import", () => {
    const errors = validateHierarchy(filePath, "../A1.jsx", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });
})