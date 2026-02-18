import React, {useCallback, useEffect, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import "../parametrizacoes-edicao-de-textos.scss"
import TabelaFiqueDeOlho from "./TabelaFiqueDeOlho";
import {getFiqueDeOlhoPrestacoesDeContas} from "../../../../../services/escolas/PrestacaoDeContas.service";
import {getFiqueDeOlhoRelatoriosConsolidados} from "../../../../../services/dres/RelatorioConsolidado.service";
import {
    patchAlterarFiqueDeOlhoPrestacoesDeContas,
    patchAlterarFiqueDeOlhoRelatoriosConsolidadosDre
} from "../../../../../services/sme/Parametrizacoes.service";
import EditorWysiwyg from "../../../../Globais/EditorWysiwyg";
import {ModalInfoFiqueDeOlho} from "./ModalInfoFiqueDeOlho";
import Loading from "../../../../../utils/Loading";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"
import {toastCustom} from "../../../../Globais/ToastCustom";
import { EditIconButton } from "../../../../Globais/UI/Button";

export const FiqueDeOlho = () => {

    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const initalTextos = {
        textoAssociacao: '',
        textoDre: ''
    };

    const [textosFiqueDeOlho, setTextosFiqueDeOlho] = useState(initalTextos);
    const [tipoDeTexto, setTipoDeTexto] = useState('');
    const [textoInicialEditor, setTextoInicialEditor] = useState('');
    const [tituloEditor, setTituloEditor] = useState('');
    const [exibeEditor, setExibeEditor] = useState(false);
    const [showModalInfoFiqueDeOlho, setShowModalInfoFiqueDeOlho] = useState(false);
    const [infoModalFiqueDeOlho, setInfoModalFiqueDeOlho] = useState('');
    const [loading, setLoading] = useState(true);

    const carregaTextos = useCallback(async () => {
        setLoading(true);
        let fique_de_olho_associacao = await getFiqueDeOlhoPrestacoesDeContas();
        let fique_de_olho_dre = await getFiqueDeOlhoRelatoriosConsolidados();
        setTextosFiqueDeOlho({
            textoAssociacao: fique_de_olho_associacao,
            textoDre: fique_de_olho_dre,
        });
        setLoading(false);
    }, []);

    useEffect(() => {
        carregaTextos()
    }, [carregaTextos]);

    const handleEditarTextos = useCallback(async (tipo_texto) => {
        setTipoDeTexto(tipo_texto);
        setExibeEditor(true);
        if (tipo_texto === 'associacoes') {
            setTextoInicialEditor(textosFiqueDeOlho.textoAssociacao.detail);
            setTituloEditor('ASSOCIAÇÕES - Prestação de Contas')
        } else if (tipo_texto === 'dre') {
            setTextoInicialEditor(textosFiqueDeOlho.textoDre.detail);
            setTituloEditor('DIRETORIAS -  Acompanhamento Prestação de Contas');
        }
    }, [textosFiqueDeOlho]);

    const acoesTemplate = (tipo_texto) => {
        return (
            <EditIconButton
                onClick={() => handleEditarTextos(tipo_texto)}
            />
        )
    };

    const handleSubmitEditor = useCallback(async (textoEditor) => {
        let payload = {
            fique_de_olho: textoEditor
        };
        if (tipoDeTexto === 'associacoes') {
            try {
                await patchAlterarFiqueDeOlhoPrestacoesDeContas(payload);
                toastCustom.ToastCustomSuccess('Edição do texto Fique de Olho realizado com sucesso.', 'O texto Fique de Olho foi editado no sistema com sucesso.')
                await carregaTextos();
            } catch (e) {
                console.log("Erro ao alterar texto ", e.response);
                setInfoModalFiqueDeOlho('Erro ao alterar texto');
                setShowModalInfoFiqueDeOlho(true);
            }
        } else if (tipoDeTexto === 'dre') {
            try {
                await patchAlterarFiqueDeOlhoRelatoriosConsolidadosDre(payload);
                toastCustom.ToastCustomSuccess('Edição do texto Fique de Olho realizado com sucesso.', 'O texto Fique de Olho foi editado no sistema com sucesso.')
                await carregaTextos();
            } catch (e) {
                console.log("Erro ao alterar texto ", e.response);
                setInfoModalFiqueDeOlho('Erro ao alterar texto');
                setShowModalInfoFiqueDeOlho(true);
            }
        }
        setTextoInicialEditor('');
        setTituloEditor('');
        setExibeEditor(false);
    }, [tipoDeTexto, carregaTextos]);

    const handleCloseModalInfoFiqueDeOlho = useCallback(() => {
        setShowModalInfoFiqueDeOlho(false);
    }, []);

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Textos do Fique de Olho</h1>
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
                            <p>Exibindo <span className='total-acoes'>2</span> textos do fique de olho</p>
                            <TabelaFiqueDeOlho
                                acoesTemplate={acoesTemplate}
                            />
                        </>
                        ) :
                        <EditorWysiwyg
                            textoInicialEditor={textoInicialEditor}
                            tituloEditor={tituloEditor}
                            handleSubmitEditor={handleSubmitEditor}
                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
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