import React from 'react';
import {PaginasContainer} from '../../../PaginasContainer';
import {Receita} from '../../../../componentes/escolas/Receitas';

export const EdicaoDeReceita = props => {
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Edição do Crédito</h1>
            <div className="page-content-inner ">
                <h2 className="subtitulo-itens-painel">Dados do documento</h2>
                <Receita {...props}/>
            </div>
        </PaginasContainer>
    )
}