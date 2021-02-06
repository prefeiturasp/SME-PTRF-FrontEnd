import React, {useCallback, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import "../parametrizacoes-edica-de-textos.scss"
import TabelaFiqueDeOlho from "./TabelaFiqueDeOlho";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {getFiqueDeOlho} from "../../../../../services/escolas/PrestacaoDeContas.service";

export const FiqueDeOlho = ()=>{

    const initalTextos = {
        textoAssociacao:'',
        textoDre: ''
    };

    const [textoFiqueDeOlho, setTextosFiqueDeOlho] = useState(initalTextos)

    const carregaTextos = useCallback(async ()=>{

    }, []);

    useState(()=>{
        carregaTextos()
    }, []);

    const handleEditarTextos = useCallback(async (tipo_texto)=>{
        console.log(" handleEditarTextos ", tipo_texto)

    }, []);

    const acoesTemplate = (tipo_texto) =>{
        return (
            <div>
                <button className="btn-editar-membro" onClick={()=>handleEditarTextos(tipo_texto)}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faEdit}
                    />
                </button>
            </div>
        )
    };

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Textos do Fique de Olho </h1>
            <div className="page-content-inner">
                <TabelaFiqueDeOlho
                    acoesTemplate={acoesTemplate}
                />
            </div>
        </PaginasContainer>
    );

};