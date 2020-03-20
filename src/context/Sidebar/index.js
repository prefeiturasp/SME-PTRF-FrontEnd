import React, {useState, createContext} from "react";

export const SidebarContext = createContext( {
    sideBarStatus: '',
    setSideBarStatus(){},
});

export const SidebarContextProvider = ({children}) => {
    const [sideBarStatus, setSideBarStatus] = useState(true)
    return (
        <SidebarContext.Provider value={ { sideBarStatus, setSideBarStatus } }>
            {children}
        </SidebarContext.Provider>
    )
}