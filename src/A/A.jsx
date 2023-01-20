import { B1 } from "../B/B1/B1.jsx";
import {B} from "../B/B.jsx";
import {C} from "../C/C.jsx";
import { A1 } from "./A1/A1.jsx";

export const A = () => {
  return <div>
    <B/>
    <A1/>
    <C/>
    <B1/>
  </div>;
};
