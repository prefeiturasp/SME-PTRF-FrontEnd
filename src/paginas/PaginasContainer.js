import React, {useContext} from "react";
import {SidebarContext} from "../context/Sidebar";

export const PaginasContainer = ({children}) => {
    const sidebarStatus = useContext(SidebarContext);
    return (
        <div className={`page-content  p-5 ${!sidebarStatus.sideBarStatus ? "active" : ""}`} id="content">
            {children}
        </div>
    );
}