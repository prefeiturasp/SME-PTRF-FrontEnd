import React from "react";
import { NavLink } from 'react-router-dom';

export const MenuInterno = () => {
    return (
        <>
            <nav className="nav mb-4 mt-2 menu-interno">
                <li className="nav-item"><NavLink to='/dados-da-associacao' activeClassName="active">Dados da associação</NavLink></li>
                <li className="nav-item" ><NavLink to='/membros-da-associacao' activeClassName="active">Membros</NavLink></li>
                <li className="nav-item"><NavLink to='/lista-de-receitas' activeClassName="active">Dados das contas</NavLink></li>
            </nav>
        </>
    );
}