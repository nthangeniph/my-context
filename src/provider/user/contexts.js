import React from "react";
import { createContext } from "react";





export const INITIAL_STATE={isLogin: false}
const UserContext = createContext(INITIAL_STATE);

const UserContextActions = createContext(null);



export {UserContext,UserContextActions};