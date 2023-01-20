import { A } from "../A/A.jsx";
import { A1 } from "../A/A1/A1.jsx";
import { C } from "../C/C.jsx";
import { B1 } from "./B1/B1.jsx";

export const B = () => {
  return (
    <div>
      <A />
      <C />
      <A1/>
      <B1/>
    </div>
  );
};
