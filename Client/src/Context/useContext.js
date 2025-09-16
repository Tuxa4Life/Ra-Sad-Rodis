import { useContext } from "react";
import UserContext from "./userContext";
import SocketContext from "./socketContext";

const useUserContext = () => { return useContext(UserContext)} 
const useSockets = () => { return useContext(SocketContext) }

export { useUserContext, useSockets }