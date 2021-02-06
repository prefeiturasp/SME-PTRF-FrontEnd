import React, {useCallback, useEffect, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import "../parametrizacoes-edica-de-textos.scss"
import TabelaFiqueDeOlho from "./TabelaFiqueDeOlho";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {getFiqueDeOlhoPrestacoesDeContas} from "../../../../../services/escolas/PrestacaoDeContas.service";
import {getFiqueDeOlhoRelatoriosConsolidados} from "../../../../../services/dres/RelatorioConsolidado.service";
import {patchAlterarFiqueDeOlhoPrestacoesDeContas, patchAlterarFiqueDeOlhoRelatoriosConsolidadosDre} from "../../../../../services/sme/Parametrizacoes.service";
import EditorWysiwyg from "../../../../Globais/EditorWysiwyg";
import {ModalInfoFiqueDeOlho} from "./ModalInfoFiqueDeOlho";
import Loading from "../../../../../utils/Loading";

export const FiqueDeOlho = ()=>{

    const initalTextos = {
        textoAssociacao:'',
        textoDre: ''
    };

    const initalTextoSelecionado = {
        titulo:'',
        textoSelecionado: ''
    };

    const [textosFiqueDeOlho, setTextosFiqueDeOlho] = useState(initalTextos);
    const [tipoDeTexto, setTipoDeTexto] = useState('');
    const [textoSelecionado, setTextoSelecionado] = useState(initalTextoSelecionado);
    const [showModalInfoFiqueDeOlho, setShowModalInfoFiqueDeOlho] = useState(false);
    const [infoModalFiqueDeOlho, setInfoModalFiqueDeOlho] = useState('');
    const [loading, setLoading] = useState(true);


    const carregaTextos = useCallback(async ()=>{
        setLoading(true);
        let fique_de_olho_associacao = await getFiqueDeOlhoPrestacoesDeContas();
        let fique_de_olho_dre = await getFiqueDeOlhoRelatoriosConsolidados();
        setTextosFiqueDeOlho({
            textoAssociacao:fique_de_olho_associacao,
            textoDre: fique_de_olho_dre,
        });
        setLoading(false);
    }, []);

    useEffect(()=>{
        carregaTextos()
    }, [carregaTextos]);

    const handleEditarTextos = useCallback(async (tipo_texto)=>{
        setTipoDeTexto(tipo_texto);
        if (tipo_texto === 'associacoes'){
            setTextoSelecionado({
                titulo: 'ASSOCIAÇÕES - Prestação de Contas',
                textoSelecionado: textosFiqueDeOlho.textoAssociacao.detail,
            })
        }else if (tipo_texto === 'dre'){
            setTextoSelecionado({
                titulo: 'ASSOCIAÇÕES - Prestação de Contas',
                textoSelecionado: textosFiqueDeOlho.textoDre.detail,
            });
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

    const handleSubmitEditor = useCallback(async (textoEditor) =>{
        let payload = {
            fique_de_olho: textoEditor
        };
        if (tipoDeTexto === 'associacoes'){
            try {
                await patchAlterarFiqueDeOlhoPrestacoesDeContas(payload);
                console.log("Texto alterado com sucesso");
                setInfoModalFiqueDeOlho('Texto alterado com sucesso');
                setShowModalInfoFiqueDeOlho(true);
                await carregaTextos();
            }catch (e) {
                console.log("Erro ao alterar texto ", e.response);
                setInfoModalFiqueDeOlho('Erro ao alterar texto');
                setShowModalInfoFiqueDeOlho(true);
            }
        }else if (tipoDeTexto === 'dre'){
            try {
                await patchAlterarFiqueDeOlhoRelatoriosConsolidadosDre(payload);
                console.log("Texto alterado com sucesso");
                setInfoModalFiqueDeOlho('Texto alterado com sucesso');
                setShowModalInfoFiqueDeOlho(true)
                await carregaTextos();
            }catch (e) {
                console.log("Erro ao alterar texto ", e.response);
                setInfoModalFiqueDeOlho('Erro ao alterar texto');
                setShowModalInfoFiqueDeOlho(true);
            }
        }
        setTextoSelecionado(initalTextoSelecionado)
    }, [initalTextoSelecionado, tipoDeTexto, carregaTextos]);

    const handleCloseModalInfoFiqueDeOlho = useCallback(()=>{
        setShowModalInfoFiqueDeOlho(false);
    }, []);

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Textos do Fique de Olho </h1>
            <div className="page-content-inner">

                {loading ? (
                        <div className="mt-5">
                            <Loading
                                corGrafico="black"
                                corFonte="dark"
                                marginTop="0"
                                marginBottom="0"
                            />
                        </div>
                    ) :

                !textoSelecionado.textoSelecionado ? (
                    <TabelaFiqueDeOlho
                        acoesTemplate={acoesTemplate}
                    />
                ):
                    <EditorWysiwyg
                        textoInicial={textoSelecionado}
                        handleSubmitEditor={handleSubmitEditor}
                    />
                }
                
            </div>
            <section>
                <ModalInfoFiqueDeOlho
                    show={showModalInfoFiqueDeOlho}
                    handleClose={handleCloseModalInfoFiqueDeOlho}
                    titulo='Fique de Olho'
                    texto={`<p class="mb-0"> ${infoModalFiqueDeOlho}</p>`}
                    primeiroBotaoTexto="Fechar"
                    primeiroBotaoCss="success"
                />
            </section>
        </PaginasContainer>
    );
};