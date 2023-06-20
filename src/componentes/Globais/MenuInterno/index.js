import React, {Fragment} from "react";
import {NavLink} from 'react-router-dom';
import "./menu-interno.scss"

export const MenuInterno = ({caminhos_menu_interno}) => {
    return (
        <>
            <nav className="nav mb-4 mt-2 menu-interno">
                {caminhos_menu_interno && caminhos_menu_interno.map((item, index) => {
                    return (
                        item.permissao !== false &&
                        <Fragment key={index}>
                            <li className="nav-item">
                                <NavLink
                                    to={`/${item.origem ? item.url + '/' + item.origem + '/' : item.url}`}
                                >
                                    {item.label}
                                    {item.iconRight ? item.iconRight :  null}
                                </NavLink>
                            </li>
                        </Fragment>
                    )
                })}
            </nav>
        </>
    );
};