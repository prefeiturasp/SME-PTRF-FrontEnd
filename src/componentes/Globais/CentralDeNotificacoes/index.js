import React, {useContext, useEffect, useState} from "react";
import "./central-de-notificacoes.scss"
import {BotoesCategoriasNotificacoes} from "./BotoesCategoriasNotificacoes";
import {CardNotificacoes} from "./CardNotificacoes";
import {FormFiltrosNotificacoes} from "./FormFiltrosNotificacoes";
import {getNotificacoes, getNotificacoesLidasNaoLidas, getNotificacaoMarcarDesmarcarLida, getNotificacoesTabela, getNotificacoesFiltros} from "../../../services/Notificacoes.service";
import Loading from "../../../utils/Loading";
import {NotificacaoContext} from "../../../context/Notificacoes";
import moment from "moment";
import {filtrosAvancadosReceitas} from "../../../services/escolas/Receitas.service";


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
        console.log("TABELA ", tabela_notitficacoes)
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

        console.log("SUBMIT ", stateFormFiltros)

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