const validateHierarchy = require("../helper");

describe("Validate hierarchy with default config", () => {
  const filePath = "src/components/organisms/ComponentX";
  const filePathOutsideComponentsFolder = "src/components-alt/molecules/ComponentX";

  const hierarchy = {
    file: [
      {
        level: "atomsMAin",
        children: [],
      },
      {
        level: "molecules",
        children: [
          {
            level: "atoms1",
            children: [
              {
                level: "atoms2",
                children: [
                  {
                    level: "atoms4444",
                    children: [],
                  },
                ],
              },
              {
                level: "ato",
                children: [
                  {
                    level: "atoms5555",
                    children: [],
                  },
                ],
              },
              {
                level: "aaaaaaa",
                children: [
                  {
                    level: "atoms77777",
                    children: [],
                  },
                ],
              },
              {
                level: "atoms2dsad",
                children: [
                  {
                    level: "atoms88888",
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            level: "atoms5",
            children: [
              {
                level: "atoms6",
                children: [
                  {
                    level: "atoms7",
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            level: "atoms8",
            children: [
              {
                level: "atoms9",
                children: [
                  {
                    level: "atoms0",
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: "organisms",
        children: [],
      },
      {
        level: "templates",
        children: [],
      },
    ],
    // atoms: 0,
    // molecules: 1,
    // organisms: 2,
    // templates: 3,
    // pages: 4
  };

  const componentFolder = "components";

  it("allow downward import", () => {
    const errors = validateHierarchy(filePath, "../atomsMAin/asdas/asd/ComponentB", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });

  it("allow downward import", () => {
    const errors = validateHierarchy(filePath, "../templates/ComponentA", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });

  it("allow downward import", () => {
    const errors = validateHierarchy(filePath, "../molecules/ComponentA", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });

  it("disallow upward import", () => {
    const errors = validateHierarchy(filePath, "../organisms/ComponentB", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });
  
  it("allow horizontal import", () => {
    const errors = validateHierarchy(filePath, "./ComponentY", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });

  it("disallow upward import", () => {
    const errors = validateHierarchy("src/components/molecules/atoms2/ComponentA", "../ato/ComponentB", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });


  it("disallow upward import", () => {
    const errors = validateHierarchy("src/components/molecules/atoms5/ComponentA", "../atoms6/ComponentB",hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });

  it("disallow upward import", () => {
    const errors = validateHierarchy("src/components/molecules/atoms1/ComponentA", "../atoms5/ComponentB", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });

  it("disallow upward import", () => {
    const errors = validateHierarchy("src/components/molecules/atoms5/ComponentA", "../atoms1/ComponentB", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });

  it("disallow upward import", () => {
    const errors = validateHierarchy("src/components/molecules/atoms5/atoms6/ComponentA", "../atoms5/ComponentB", hierarchy, componentFolder);
    expect(errors).toEqual(undefined);
  });

});

// describe('Validate hierarchy with custom components folder', () => {
//     const filePath = 'src/components-alt/molecules/ComponentX';
//     const filePathOutsideComponentsFolder = 'src/components/molecules/ComponentX';

//     const hierarchy = {
//         atoms: 0,
//         molecules: 1,
//         organisms: 2,
//         templates: 3,
//         pages: 4
//     };

//     const componentFolder = 'components-alt';

//     it('allow downward import', () => {
//         const errors = validateHierarchy(filePath, '../atoms/ComponentA', hierarchy, componentFolder);
//         expect(errors).toEqual(undefined);
//     });

//     it('allow horizontal import', () => {
//         const errors = validateHierarchy(filePath, './ComponentY', hierarchy, componentFolder);
//         expect(errors).toEqual(undefined);
//     });

//     it('disallow upward import', () => {
//         const errors = validateHierarchy(filePath, '../organisms/ComponentB', hierarchy, componentFolder);
//         expect(errors).toEqual('Cannot import organisms from molecules');
//     });

//     it('ignore source files outside of components folder', () => {
//         const errors = validateHierarchy(filePathOutsideComponentsFolder, '../organisms/ComponentB', hierarchy, componentFolder);
//         expect(errors).toEqual(undefined);
//     });
// });

// describe('Validate hierarchy with custom hierarchy names', () => {
//     const filePath = 'src/components/levelTwo/ComponentX';
//     const filePathOutsideComponentsFolder = 'src/components-alt/levelTwo/ComponentX';

//     const hierarchy = {
//         levelOne: 0,
//         levelTwo: 1,
//         levelThree: 2,
//         levelFour: 3,
//         levelFive: 4
//     };

//     const componentFolder = 'components';

//     it('allow downward import', () => {
//         const errors = validateHierarchy(filePath, '../levelOne/ComponentA', hierarchy, componentFolder);
//         expect(errors).toEqual(undefined);
//     });

//     it('allow horizontal import', () => {
//         const errors = validateHierarchy(filePath, './ComponentY', hierarchy, componentFolder);
//         expect(errors).toEqual(undefined);
//     });

//     it('disallow upward import', () => {
//         const errors = validateHierarchy(filePath, '../levelThree/ComponentB', hierarchy, componentFolder);
//         expect(errors).toEqual('Cannot import levelThree from levelTwo');
//     });

//     it('ignore source files outside of components folder', () => {
//         const errors = validateHierarchy(filePathOutsideComponentsFolder, '../levelThree/ComponentB', hierarchy, componentFolder);
//         expect(errors).toEqual(undefined);
//     });
// });

// describe('Validate hierarchy with custom hierarchy levels', () => {
//     const filePath = 'src/components/particles/ComponentX';

//     const hierarchy = {
//         atoms: 0,
//         particles: 1,
//         molecules: 1,
//         organisms: 2,
//         templates: 3,
//         pages: 4
//     };

//     const componentFolder = 'components';

//     it('allow downward import', () => {
//         const errors = validateHierarchy(filePath, '../atoms/ComponentA', hierarchy, componentFolder);
//         expect(errors).toEqual(undefined);
//     });

//     it('allow horizontal import of same type', () => {
//         const errors = validateHierarchy(filePath, './ComponentY', hierarchy, componentFolder);
//         expect(errors).toEqual(undefined);
//     });

//     it('allow horizontal import of different type', () => {
//         const errors = validateHierarchy(filePath, '../molecules/ComponentB', hierarchy, componentFolder);
//         expect(errors).toEqual(undefined);
//     });

//     it('disallow upward import', () => {
//         const errors = validateHierarchy(filePath, '../organisms/ComponentC', hierarchy, componentFolder);
//         expect(errors).toEqual('Cannot import organisms from particles');
//     });
// });
