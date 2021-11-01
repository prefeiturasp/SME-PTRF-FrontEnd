import React, {useContext, useEffect, useState} from "react";
import "./central-de-notificacoes.scss"
import {BotoesCategoriasNotificacoes} from "./BotoesCategoriasNotificacoes";
import {CardNotificacoes} from "./CardNotificacoes";
import {FormFiltrosNotificacoes} from "./FormFiltrosNotificacoes";
import {getNotificacoes, getNotificacoesLidasNaoLidas, setNotificacaoMarcarDesmarcarLida, getNotificacoesTabela, getNotificacoesFiltros, getNotificacoesPaginacao, getNotificacoesLidasNaoLidasPaginacao, getNotificacoesFiltrosPaginacao} from "../../../services/Notificacoes.service";
import Loading from "../../../utils/Loading";
import {NotificacaoContext} from "../../../context/Notificacoes";
import moment from "moment";
import {Paginacao} from "./Paginacao";
import {gerarUuid} from "../../../utils/ValidacoesAdicionaisFormularios";

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
    const [totalDePaginas, setTotalDePaginas] = useState(0);
    const [paginacaoAtual, setPaginacaoAtual] = useState(1);
    const [categoriaLidaNaoLida, setCategoriaLidaNaoLida] = useState('todas');
    const [forcarPrimeiraPagina, setForcarPrimeiraPagina] = useState('');
    const [usouFiltros, setUsouFiltros]  = useState(false);

    useEffect(()=> {
        trazerNotificacoes();
        getTabelaNotificacoes();
    }, []);

    useEffect(()=>{
        qtdeNotificacoesNaoLidas()
    }, [clickBtnNotificacoes]);

    useEffect(()=>{
        setLoading(false)
    }, []);

    const trazerNotificacoes = async () =>{
        let notificacoes = await getNotificacoes();
        setNotificacoes(notificacoes.results);
        let numeroDePaginas = notificacoes.count;
        setTotalDePaginas(Math.ceil((numeroDePaginas)/10));
    };

    const trazerNotificacoesPaginacao = async (page) =>{
        setPaginacaoAtual(page);
        let notificacoes = await getNotificacoesPaginacao(page);
        setNotificacoes(notificacoes.results);
        let numeroDePaginas = notificacoes.count;
        setTotalDePaginas(Math.ceil((numeroDePaginas)/10));
    };

    const trazerNotificacoesLidasNaoLidas = async (lidas) =>{
        let notificacoes = await getNotificacoesLidasNaoLidas(lidas);
        setNotificacoes(notificacoes.results);
        let numeroDePaginas = notificacoes.count;
        setTotalDePaginas(Math.ceil((numeroDePaginas)/10));
    };

    const trazerNotificacoesLidasNaoLidasPaginacao = async (lidas, page) =>{
        setPaginacaoAtual(page);
        let notificacoes = await getNotificacoesLidasNaoLidasPaginacao(lidas, page);
        setNotificacoes(notificacoes.results);
        let numeroDePaginas = notificacoes.count;
        setTotalDePaginas(Math.ceil((numeroDePaginas)/10));
    };

    const trazerNotificacoesFiltros = async () =>{
        let data_inicio = stateFormFiltros.data_inicio ? moment(new Date(stateFormFiltros.data_inicio), "YYYY-MM-DD").format("YYYY-MM-DD") : null;
        let data_fim = stateFormFiltros.data_fim ? moment(new Date(stateFormFiltros.data_fim), "YYYY-MM-DD").format("YYYY-MM-DD") : null;
        let lista_retorno_filtros = await getNotificacoesFiltros(stateFormFiltros.tipo_notificacao, stateFormFiltros.remetente, stateFormFiltros.categoria, stateFormFiltros.lido, data_inicio, data_fim);
        setNotificacoes(lista_retorno_filtros.results);
        let numeroDePaginas = lista_retorno_filtros.count;
        setTotalDePaginas(Math.ceil((numeroDePaginas)/10));
    };

    const trazerNotificacoesFiltrosPaginacao = async (page) =>{
        setPaginacaoAtual(page);
        let data_inicio = stateFormFiltros.data_inicio ? moment(new Date(stateFormFiltros.data_inicio), "YYYY-MM-DD").format("YYYY-MM-DD") : null;
        let data_fim = stateFormFiltros.data_fim ? moment(new Date(stateFormFiltros.data_fim), "YYYY-MM-DD").format("YYYY-MM-DD") : null;
        let lista_retorno_filtros = await getNotificacoesFiltrosPaginacao(stateFormFiltros.tipo_notificacao, stateFormFiltros.remetente, stateFormFiltros.categoria, stateFormFiltros.lido, data_inicio, data_fim, page);
        setNotificacoes(lista_retorno_filtros.results);
        let numeroDePaginas = lista_retorno_filtros.count;
        setTotalDePaginas(Math.ceil((numeroDePaginas)/10));
    };

    const qtdeNotificacoesNaoLidas = async () =>{
        await notificacaoContext.getQtdeNotificacoesNaoLidas()
    };

    const getTabelaNotificacoes = async () =>{
        let tabela_notitficacoes = await getNotificacoesTabela();
        setTabelaNotificacoes(tabela_notitficacoes);
    };

    const toggleBtnNotificacoes = (uuid) => {
        setClickBtnNotificacoes({
            [uuid]: !clickBtnNotificacoes[uuid]
        });
    };

    const handleClickBtnCategorias = async (e) => {
        setUsouFiltros(false);
        let lidas = e.target.id;
        setCategoriaLidaNaoLida(lidas);
        setClickBtnNotificacoes(false);
        if (lidas === 'nao_lidas'){
            await trazerNotificacoesLidasNaoLidas("False")
        }else if (lidas === "lidas"){
            await trazerNotificacoesLidasNaoLidas("True")
        }else if (lidas === 'todas'){
            await trazerNotificacoes();
        }
        setForcarPrimeiraPagina(gerarUuid)
    };

    const handleChangeMarcarComoLida = async (e, uuid) => {
        setClickBtnNotificacoes(false);
        let checado = e.target.checked;
        const payload = {
            "uuid": uuid,
            "lido": checado
        };
        await setNotificacaoMarcarDesmarcarLida(payload);
        await trazerNotificacoes();
    };

    const handleChangeFormFiltros = (name, value) => {
        setStateFormFiltros({
            ...stateFormFiltros,
            [name]: value
        });
    };

    const handleSubmitFormFiltros = async (event) => {
        setUsouFiltros(true);
        setForcarPrimeiraPagina(gerarUuid);
        event.preventDefault();
        await trazerNotificacoesFiltros();
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
                    {notificacoes && notificacoes.length > 0 ? (
                            <>
                            <CardNotificacoes
                                notificacoes={notificacoes}
                                toggleBtnNotificacoes={toggleBtnNotificacoes}
                                clickBtnNotificacoes={clickBtnNotificacoes}
                                handleChangeMarcarComoLida={handleChangeMarcarComoLida}
                                paginacaoPaginasTotal={totalDePaginas}
                                metodoQueBuscaInfos={trazerNotificacoesPaginacao}
                            />

                            {totalDePaginas > 1 && totalDePaginas >= paginacaoAtual &&
                                <Paginacao
                                    paginacaoPaginasTotal={totalDePaginas}
                                    trazerNotificacoesPaginacao={trazerNotificacoesPaginacao}
                                    trazerNotificacoesLidasNaoLidasPaginacao={trazerNotificacoesLidasNaoLidasPaginacao}
                                    categoriaLidaNaoLida={categoriaLidaNaoLida}
                                    forcarPrimeiraPagina={forcarPrimeiraPagina}
                                    usouFiltros={usouFiltros}
                                    trazerNotificacoesFiltrosPaginacao={trazerNotificacoesFiltrosPaginacao}
                                />
                            }
                        </>
                    ):
                        <p className="mt-5"><strong>Não existem notificações a serem exibidas</strong></p>
                    }
                </>
            }
        </>
    );
};