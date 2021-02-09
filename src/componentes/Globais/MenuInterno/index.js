import React, {Fragment} from "react";
import { NavLink } from 'react-router-dom';
import "./menu-interno.scss"

export const MenuInterno = ({caminhos_menu_interno}) => {
    return (
        <>
            <nav className="nav mb-4 mt-2 menu-interno">
                {caminhos_menu_interno && caminhos_menu_interno.map((item, index)=>{
                    return (
                        <Fragment key={index}>
                            {/*<li className="nav-item"><NavLink to={`/${item.url}`} activeClassName="active">{item.label}</NavLink></li>*/}
                            <li className="nav-item">

                                <NavLink
                                    to={`/${item.origem ? item.url + '/' + item.origem  + '/' : item.url}`}
                                    //to={`/${item.url}${item.origem ? '/' + item.origem}`}
                                >
                                    {item.label}
                                </NavLink>

                                {/*<NavLink
                                    to={{
                                    pathname: item.url,
                                    parametros: {
                                        origem: origem
                                    }
                                }}
                                    activeClassName="active"
                                >
                                    {item.label}
                                </NavLink>*/}
{/*
                                <NavLink
                                    to={`/${item.url}`}
                                    activeClassName="active"
                                >
                                    {item.label}
                                </NavLink>
*/}
                            </li>
                        </Fragment>
                    )
                })}
            </nav>
        </>
    );
};