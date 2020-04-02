import React, {useContext} from "react";
import {SidebarContext} from "../context/Sidebar";

export const PaginasContainer = ({children}) => {
    const sidebarStatus = useContext(SidebarContext);
    return (
        <div className={`page-content  px-5 pt-0 pb-5 ${!sidebarStatus.sideBarStatus ? "active" : ""}`} id="content">
            {children}
        </div>
    );
}