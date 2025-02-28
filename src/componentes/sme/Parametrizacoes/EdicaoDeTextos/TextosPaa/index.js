import React, {useCallback, useEffect, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import "../parametrizacoes-edicao-de-textos.scss"
import TabelaTextosPaa from "./TabelaTextosPaa";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {getTextoExplicacaoPaa, patchTextoExplicacaoPaa} from "../../../../../services/escolas/PrestacaoDeContas.service";
import EditorWysiwyg from "../../../../Globais/EditorWysiwyg";
import Loading from "../../../../../utils/Loading";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"
import {toastCustom} from "../../../../Globais/ToastCustom";
import ReactTooltip from "react-tooltip";

export const TextosPaa = () => {

    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const initalTextos = {
        explicacaoSobrePaa: '',
    };

    const [textosPaa, setTextosPaa] = useState(initalTextos);
    const [tipoDeTexto, setTipoDeTexto] = useState('');
    const [textoInicialEditor, setTextoInicialEditor] = useState('');
    const [tituloEditor, setTituloEditor] = useState('');
    const [exibeEditor, setExibeEditor] = useState(false);
    const [loading, setLoading] = useState(true);

    const carregaTextos = useCallback(async () => {
        setLoading(true);
        let explicacao_sobre_paa = await getTextoExplicacaoPaa();
        setTextosPaa({
            explicacaoSobrePaa: explicacao_sobre_paa,
        });
        setLoading(false);
    }, []);

    useEffect(() => {
        carregaTextos()
    }, [carregaTextos]);

    const handleEditarTextos = useCallback(async (tipo_texto) => {
        setTipoDeTexto(tipo_texto);
        setExibeEditor(true);
        if (tipo_texto === 'explicacao_sobre_paa') {
            setTextoInicialEditor(textosPaa.explicacaoSobrePaa.detail);
            setTituloEditor('Explicação sobre o PAA')
        }
    }, [textosPaa]);

    const acoesTemplate = (tipo_texto) => {
        return (
            <div>
                <button aria-label="Editar" className="btn-editar-membro" onClick={() => handleEditarTextos(tipo_texto)}>
                    <div data-tip="Editar" data-for={`tooltip-id-${tipo_texto}`}>
                     <ReactTooltip id={`tooltip-id-${tipo_texto}`}/>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faEdit}
                    />
                    </div>
                </button>
            </div>
        )
    };

    const handleSubmitEditor = useCallback(async (textoEditor) => {
        let payload = {
            texto_pagina_paa_ue: textoEditor
        };
        if (tipoDeTexto === 'explicacao_sobre_paa') {
            try {
                await patchTextoExplicacaoPaa(payload);
                toastCustom.ToastCustomSuccess('Edição do texto de explicação do PAA foi realizada com sucesso.', 'O texto de explicação do PAA foi editado no sistema com sucesso.')
                await carregaTextos();
            } catch (e) {
                console.log("Erro ao alterar texto ", e.response);
                toastCustom.ToastCustomError('Erro ao editar o texto de explicação do PAA.', 'O texto de explicação do PAA não foi editado.')
            }
        }
        setTextoInicialEditor('');
        setTituloEditor('');
        setExibeEditor(false);
    }, [tipoDeTexto, carregaTextos]);

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Textos do PAA</h1>
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
                    !exibeEditor ? (
                        <>
                            <p>Exibindo <span className='total-acoes'>1</span> texto do PAA</p>
                            <TabelaTextosPaa
                                acoesTemplate={acoesTemplate}
                            />
                        </>
                        ) :
                        <EditorWysiwyg
                            textoInicialEditor={textoInicialEditor}
                            tituloEditor={tituloEditor}
                            handleSubmitEditor={handleSubmitEditor}
                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                            botaoCancelar={true}
                            setExibeEditor={setExibeEditor}
                        />
                }
            </div>
        </PaginasContainer>
    );
};