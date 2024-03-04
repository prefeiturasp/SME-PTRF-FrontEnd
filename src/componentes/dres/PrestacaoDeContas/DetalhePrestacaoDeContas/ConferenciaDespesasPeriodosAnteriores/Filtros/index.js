import React, {useCallback, useEffect, useState} from 'react';
import moment from "moment";
import '../../../../../Globais/ExtracaoDados/extracao-dados.scss';
import {getTagInformacao} from "../../../../../../services/escolas/Despesas.service";
import {getTagsConferenciaLancamento} from "../../../../../../services/dres/PrestacaoDeContas.service";
import {FiltroRecolhido} from "./FiltroRecolhido";
import {FiltroExpandido} from "./FiltroExpandido";

export const Filtros = ({ tabelasDespesa, filters, onChangeFiltersState }) => {
    
    const DEFAULT_STATE = {
        filtrar_por_acao: "",
        filtrar_por_lancamento: "",
        filtrar_por_data_inicio: "",
        filtrar_por_data_fim: "",
        filtrar_por_nome_fornecedor: "",
        filtrar_por_numero_de_documento: "",
        filtrar_por_tipo_de_documento: "",
        filtrar_por_tipo_de_pagamento: "",
        filtrar_por_conferencia: [],
        filtrar_por_informacao: [],
    };
    
    const [listaTagInformacao, setListaTagInformacao] = useState([])
    const [listaTagsConferencia, setListaTagsConferencia] = useState([])
    const [stateFiltros, setStateFiltros] = useState(filters);
    const [btnMaisFiltros, setBtnMaisFiltros] = useState(false);

    const limpaFiltros = async () => {
        setStateFiltros(DEFAULT_STATE);
        onChangeFiltersState(DEFAULT_STATE);
    };

    const handleSubmitFiltros = () => {
        onChangeFiltersState(stateFiltros);
    }

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

    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const handleChangeFiltroInformacoes = (value) => {
        setStateFiltros({
            ...stateFiltros,
            filtrar_por_informacoes: [...value]
        });
    }

    const handleChangeFiltroConferencia = (value) => {
        setStateFiltros({
            ...stateFiltros,
            filtrar_por_conferencia: [...value]
        });
    }

    const handleClearDate = () => {
        setStateFiltros({
            ...stateFiltros,
            filtrar_por_data_inicio: "",
            filtrar_por_data_fim: ""
        });
    }

    return (
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
    )

}