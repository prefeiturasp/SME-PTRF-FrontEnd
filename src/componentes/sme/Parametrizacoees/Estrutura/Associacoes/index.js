import React, {useCallback, useEffect, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {UrlsMenuInterno} from "./UrlsMenuInterno";
import {MenuInterno} from "../../../../Globais/MenuInterno";
import {getAssociacoes} from "../../../../../services/sme/Parametrizacoes.service";
import {TabelaAssociacoes} from "./TabelaAssociacoes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";

export const Associacoes = () => {

    const [count, setCount] = useState(0);
    const [listaDeAssociacoes, setListaDeAssociacoes] = useState([]);

    const carregaTodasAsAssociacoes = useCallback(async () => {
        let todas_associacoes = await getAssociacoes();
        console.log("Associacoes ", todas_associacoes);
        setListaDeAssociacoes(todas_associacoes);
    }, []);

    useEffect(() => {
        carregaTodasAsAssociacoes();
    }, [carregaTodasAsAssociacoes]);
    
    // Tabela
    const rowsPerPage = 20;

    const handleEditFormModalAssociacoes = useCallback( async (rowData) =>{

        console.log("handleEditFormModalAssociacoes handleEditFormModalAssociacoes", rowData)

    }, []);

    const acoesTemplate = useCallback((rowData) =>{
        return (
            <div>
                <button className="btn-editar-membro" onClick={()=>handleEditFormModalAssociacoes(rowData)}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faEdit}
                    />
                </button>
            </div>
        )
    }, [handleEditFormModalAssociacoes]);
    

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Associações</h1>
            <div className="page-content-inner">
                <MenuInterno
                    caminhos_menu_interno={UrlsMenuInterno}
                />
                <button onClick={()=>setCount(prevState => prevState+1)}>Botão Sem Use Calback - {count}</button>
                <TabelaAssociacoes
                    rowsPerPage={rowsPerPage}
                    listaDeAssociacoes={listaDeAssociacoes}
                    acoesTemplate={acoesTemplate}
                />
            </div>
        </PaginasContainer>
    )
};