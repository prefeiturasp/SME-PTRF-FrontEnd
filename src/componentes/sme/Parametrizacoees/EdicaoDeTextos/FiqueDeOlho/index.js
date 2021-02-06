import React, {useCallback, useEffect, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import "../parametrizacoes-edica-de-textos.scss"
import TabelaFiqueDeOlho from "./TabelaFiqueDeOlho";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {getFiqueDeOlhoPrestacoesDeContas} from "../../../../../services/escolas/PrestacaoDeContas.service";
import {getFiqueDeOlhoRelatoriosConsolidados} from "../../../../../services/dres/RelatorioConsolidado.service";
import EditorDeTexto from "./EditorDeTexto";

export const FiqueDeOlho = ()=>{

    const initalTextos = {
        textoAssociacao:'',
        textoDre: ''
    };

    const [textosFiqueDeOlho, setTextosFiqueDeOlho] = useState(initalTextos);
    const [tipoDeTexto, setTipoDeTexto] = useState('');
    const [textoSelecionado, setTextoSelecionado] = useState('');

    const carregaTextos = useCallback(async ()=>{
        let fique_de_olho_associacao = await getFiqueDeOlhoPrestacoesDeContas();
        let fique_de_olho_dre = await getFiqueDeOlhoRelatoriosConsolidados();

        setTextosFiqueDeOlho({
            textoAssociacao:fique_de_olho_associacao,
            textoDre: fique_de_olho_dre,
        })

    }, []);

    useEffect(()=>{
        carregaTextos()
    }, [carregaTextos]);

    const handleEditarTextos = useCallback(async (tipo_texto)=>{
        setTipoDeTexto(tipo_texto);
        if (tipo_texto === 'associacoes'){
            setTextoSelecionado(textosFiqueDeOlho.textoAssociacao.detail)
        }else if (tipo_texto === 'dre'){
            setTextoSelecionado(textosFiqueDeOlho.textoDre.detail)
        }

    }, [textosFiqueDeOlho]);

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

    const handleSubmitTexto = useCallback(async ()=>{
        console.log("handleSubmitTexto")
    }, []);

    console.log("TipoDeTexto ", tipoDeTexto);
    console.log("Textos Fique de Olho ", textosFiqueDeOlho);
    console.log("Textos Selecionado ", textoSelecionado);

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Textos do Fique de Olho </h1>
            <div className="page-content-inner">
                {!textoSelecionado ? (
                    <TabelaFiqueDeOlho
                        acoesTemplate={acoesTemplate}
                    />
                ):
                    <EditorDeTexto
                        textoSelecionado={textoSelecionado}
                        handleSubmitTexto={handleSubmitTexto}
                    />
                }

            </div>
        </PaginasContainer>
    );

};