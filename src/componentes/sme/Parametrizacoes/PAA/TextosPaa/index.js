import React, {useCallback, useEffect, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import "../../EdicaoDeTextos/parametrizacoes-edicao-de-textos.scss"
import TabelaTextosPaa from "./TabelaTextosPaa";
import {getTextosPaaUe, patchTextosPaaUe} from "../../../../../services/escolas/PrestacaoDeContas.service";
import EditorWysiwyg from "../../../../Globais/EditorWysiwyg";
import Loading from "../../../../../utils/Loading";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"
import {toastCustom} from "../../../../Globais/ToastCustom";
import { EditIconButton } from "../../../../Globais/UI/Button";

export const TextosPaa = () => {

    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const initalTextos = {
        texto_pagina_paa_ue: '',
        introducao_do_paa_ue_1: '',
        introducao_do_paa_ue_2: '',
        conclusao_do_paa_ue_1: '',
        conclusao_do_paa_ue_2: '',
    };

    const [textosPaa, setTextosPaa] = useState(initalTextos);
    const [tipoDeTexto, setTipoDeTexto] = useState('');
    const [textoInicialEditor, setTextoInicialEditor] = useState('');
    const [tituloEditor, setTituloEditor] = useState('');
    const [exibeEditor, setExibeEditor] = useState(false);
    const [loading, setLoading] = useState(true);

    const carregaTextos = useCallback(async () => {
        setLoading(true);
        let textosPaa = await getTextosPaaUe();

        setTextosPaa({
            texto_pagina_paa_ue: textosPaa.texto_pagina_paa_ue,
            introducao_do_paa_ue_1: textosPaa.introducao_do_paa_ue_1,
            introducao_do_paa_ue_2: textosPaa.introducao_do_paa_ue_2,
            conclusao_do_paa_ue_1: textosPaa.conclusao_do_paa_ue_1,
            conclusao_do_paa_ue_2: textosPaa.conclusao_do_paa_ue_2,
        });
        setLoading(false);
    }, []);

    useEffect(() => {
        carregaTextos()
    }, [carregaTextos]);

    const handleEditarTextos = useCallback(async (tipo_texto) => {
        setTipoDeTexto(tipo_texto);
        setExibeEditor(true);
        
        const titulos = {
            'texto_pagina_paa_ue': 'Explicação sobre o PAA',
            'introducao_do_paa_ue_1': 'Introdução do PAA 1',
            'introducao_do_paa_ue_2': 'Introdução do PAA 2',
            'conclusao_do_paa_ue_1': 'Conclusão do PAA 1',
            'conclusao_do_paa_ue_2': 'Conclusão do PAA 2'
        };
        
        setTextoInicialEditor(textosPaa[tipo_texto] || '');
        setTituloEditor(titulos[tipo_texto] || '');
    }, [textosPaa]);

    const acoesTemplate = (tipo_texto) => {
        return (
            <EditIconButton
                onClick={() => handleEditarTextos(tipo_texto)}
            />
        )
    };

    const handleSubmitEditor = useCallback(async (textoEditor) => {
        let payload = {
            texto_pagina_paa_ue: textosPaa.texto_pagina_paa_ue,
            introducao_do_paa_ue_1: textosPaa.introducao_do_paa_ue_1,
            introducao_do_paa_ue_2: textosPaa.introducao_do_paa_ue_2,
            conclusao_do_paa_ue_1: textosPaa.conclusao_do_paa_ue_1,
            conclusao_do_paa_ue_2: textosPaa.conclusao_do_paa_ue_2,
        };
        
        payload[tipoDeTexto] = textoEditor;
        
        const textosPaaUe = ['texto_pagina_paa_ue', 'introducao_do_paa_ue_1', 'introducao_do_paa_ue_2', 'conclusao_do_paa_ue_1', 'conclusao_do_paa_ue_2'];

        if (textosPaaUe.includes(tipoDeTexto)) {
            try {
                await patchTextosPaaUe(payload);
                toastCustom.ToastCustomSuccess('Edição do texto do PAA foi realizada com sucesso.', 'O texto do PAA foi editado no sistema com sucesso.')
                await carregaTextos();
            } catch (e) {
                console.error("Erro ao alterar texto ", e.response);
                toastCustom.ToastCustomError('Erro ao editar o texto do PAA.', 'O texto do PAA não foi editado.')
            }
        }
        setTextoInicialEditor('');
        setTituloEditor('');
        setExibeEditor(false);
    }, [tipoDeTexto, carregaTextos, textosPaa]);

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