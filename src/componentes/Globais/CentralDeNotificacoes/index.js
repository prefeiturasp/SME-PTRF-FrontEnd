import React, {useContext, useEffect, useState} from "react";
import "./central-de-notificacoes.scss"
import {BotoesCategoriasNotificacoes} from "./BotoesCategoriasNotificacoes";
import {CardNotificacoes} from "./CardNotificacoes";
import {FormFiltrosNotificacoes} from "./FormFiltrosNotificacoes";
import {getNotificacoes, getNotificacoesLidasNaoLidas, getNotificacaoMarcarDesmarcarLida, getNotificacoesTabela, getNotificacoesFiltros} from "../../../services/Notificacoes.service";
import Loading from "../../../utils/Loading";
import {NotificacaoContext} from "../../../context/Notificacoes";
import moment from "moment";


export const CentralDeNotificacoes = () => {

    const notificacaoContext = useContext(NotificacaoContext);

    const initialStateFormFiltros = {
        tipo_notificacao: "",
        categoria: "",
        remetente: "",
        lido: "",
        data_inicio: "",
        data_fim: "",
    };

    const [clickBtnNotificacoes, setClickBtnNotificacoes] = useState(false);
    const [notificacoes, setNotificacoes] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tabelaNotificacoes, setTabelaNotificacoes] = useState(true);
    const [stateFormFiltros, setStateFormFiltros] = useState(initialStateFormFiltros);

    useEffect(()=> {
        trazerNotificacoes();
        getTabelaNotificacoes();
    }, []);

    useEffect(()=>{
        qtdeNotificacoesNaoLidas()
    }, [clickBtnNotificacoes]);


    const trazerNotificacoes = async () =>{
        //setLoading(true);
        let notificacoes = await getNotificacoes();
        setNotificacoes(notificacoes);
        setLoading(false);
    };

    const trazerNotificacoesLidasNaoLidas = async (lidas) =>{
        //setLoading(true);
        let notificacoes = await getNotificacoesLidasNaoLidas(lidas);
        setNotificacoes(notificacoes);
        setLoading(false);
    };

    const qtdeNotificacoesNaoLidas = async () =>{
        await notificacaoContext.getQtdeNotificacoesNaoLidas()
    };

    const getTabelaNotificacoes = async () =>{
        let tabela_notitficacoes = await getNotificacoesTabela()
        setTabelaNotificacoes(tabela_notitficacoes);
    };

    const toggleBtnNotificacoes = (uuid) => {
        setClickBtnNotificacoes({
            [uuid]: !clickBtnNotificacoes[uuid]
        });
    };

    const handleClickBtnCategorias = async (e) => {
        setClickBtnNotificacoes(false);
        let lidas = e.target.id;
        if (lidas === 'nao_lidas'){
            await trazerNotificacoesLidasNaoLidas("False")
        }else if (lidas === "lidas"){
            await trazerNotificacoesLidasNaoLidas("True")
        }else if (lidas === 'todas'){
            await trazerNotificacoes();
        }
    };

    const handleChangeMarcarComoLida = async (e, uuid) => {
        setClickBtnNotificacoes(false);
        let checado = e.target.checked;
        const payload = {
            "uuid": uuid,
            "lido": checado
        };
        await getNotificacaoMarcarDesmarcarLida(payload);
    };

    const handleChangeFormFiltros = (name, value) => {
        setStateFormFiltros({
            ...stateFormFiltros,
            [name]: value
        });
    };

    const handleSubmitFormFiltros = async (event) => {
        event.preventDefault();
        let data_inicio = stateFormFiltros.data_inicio ? moment(new Date(stateFormFiltros.data_inicio), "YYYY-MM-DD").format("YYYY-MM-DD") : null;
        let data_fim = stateFormFiltros.data_fim ? moment(new Date(stateFormFiltros.data_fim), "YYYY-MM-DD").format("YYYY-MM-DD") : null;
        let lista_retorno_filtros = await getNotificacoesFiltros(stateFormFiltros.tipo_notificacao, stateFormFiltros.remetente, stateFormFiltros.categoria, stateFormFiltros.lido, data_inicio, data_fim)
        setNotificacoes(lista_retorno_filtros)
    };

    const limpaFormulario = async () => {
        setStateFormFiltros(initialStateFormFiltros);
        await trazerNotificacoes();
    };

    return (
        <>
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                <>
                    <BotoesCategoriasNotificacoes
                        handleClickBtnCategorias={handleClickBtnCategorias}
                    />

                    <FormFiltrosNotificacoes
                        tabelaNotificacoes={tabelaNotificacoes}
                        stateFormFiltros={stateFormFiltros}
                        handleChangeFormFiltros={handleChangeFormFiltros}
                        handleSubmitFormFiltros={handleSubmitFormFiltros}
                        limpaFormulario={limpaFormulario}
                    />

                    <CardNotificacoes
                        notificacoes={notificacoes}
                        toggleBtnNotificacoes={toggleBtnNotificacoes}
                        clickBtnNotificacoes={clickBtnNotificacoes}
                        handleChangeMarcarComoLida={handleChangeMarcarComoLida}
                    />
                </>
            }
        </>
    );
};