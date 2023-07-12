import React, {useCallback, useEffect, useState} from 'react';
import moment from "moment";
import './../../../../../sme/ExtracaoDados/extracao-dados.scss'
import {getTagInformacao} from "../../../../../../services/escolas/Despesas.service";
import {getTagsConferenciaLancamento} from "../../../../../../services/dres/PrestacaoDeContas.service";
import {FiltroRecolhido} from "./FiltroRecolhido";
import {FiltroExpandido} from "./FiltroExpandido";

export const Filtros = ({
                            stateFiltros,
                            tabelasDespesa,
                            handleClearDate,
                            handleChangeFiltros,
                            handleSubmitFiltros,
                            limpaFiltros,
                            handleChangeFiltroInformacoes,
                            handleChangeFiltroConferencia,
                            btnMaisFiltros,
                            setBtnMaisFiltros
                        }) => {


    const [listaTagInformacao, setListaTagInformacao] = useState([])
    const [listaTagsConferencia, setListaTagsConferencia] = useState([])

    const handleTagInformacao = useCallback(async () => {
        try {
            const response = await getTagInformacao()
            setListaTagInformacao(response)
        } catch (e) {
            console.error('Erro ao carregar tag informação', e)
        }
    }, [])

    useEffect(() => {
        handleTagInformacao()
    }, [handleTagInformacao])

    const handleTagConferencia = useCallback(async () => {
        try {
            const response = await getTagsConferenciaLancamento()
            setListaTagsConferencia(response)
        } catch (e) {
            console.error('Erro ao carregar tags de conferência de lançamento', e)
        }
    }, [])

    useEffect(() => {
        handleTagConferencia()
    }, [handleTagConferencia])

    const formatDate = (date) => {
        const dataFormatada = date.replaceAll('-', '/')
        return moment(new Date(dataFormatada))
    }

    return (
        <>
            <form>

                {!btnMaisFiltros ? (
                        <FiltroRecolhido
                            stateFiltros={stateFiltros}
                            tabelasDespesa={tabelasDespesa}
                            handleChangeFiltros={handleChangeFiltros}
                            btnMaisFiltros={btnMaisFiltros}
                            setBtnMaisFiltros={setBtnMaisFiltros}
                            limpaFiltros={limpaFiltros}
                            handleSubmitFiltros={handleSubmitFiltros}
                        />
                    ) :
                    <FiltroExpandido
                        stateFiltros={stateFiltros}
                        tabelasDespesa={tabelasDespesa}
                        handleClearDate={handleClearDate}
                        handleChangeFiltros={handleChangeFiltros}
                        handleSubmitFiltros={handleSubmitFiltros}
                        limpaFiltros={limpaFiltros}
                        handleChangeFiltroInformacoes={handleChangeFiltroInformacoes}
                        handleChangeFiltroConferencia={handleChangeFiltroConferencia}
                        btnMaisFiltros={btnMaisFiltros}
                        setBtnMaisFiltros={setBtnMaisFiltros}
                        formatDate={formatDate}
                        listaTagInformacao={listaTagInformacao}
                        listaTagsConferencia={listaTagsConferencia}
                    />
                }
            </form>
        </>
    )

}