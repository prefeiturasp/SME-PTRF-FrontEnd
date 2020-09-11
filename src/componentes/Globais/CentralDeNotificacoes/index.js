import React, {useContext, useEffect, useState} from "react";
import "./central-de-notificacoes.scss"
import {BotoesCategoriasNotificacoes} from "./BotoesCategoriasNotificacoes";
import {CardNotificacoes} from "./CardNotificacoes";
import {FormFiltrosNotificacoes} from "./FormFiltrosNotificacoes";
import {getNotificacoes, getNotificacoesLidasNaoLidas, getNotificacaoMarcarDesmarcarLida, getNotificacoesTabela, getNotificacoesFiltros} from "../../../services/Notificacoes.service";
import Loading from "../../../utils/Loading";
import {NotificacaoContext} from "../../../context/Notificacoes";
import moment from "moment";
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
    const [loading, setLoading] = useState(false);
    const [tabelaNotificacoes, setTabelaNotificacoes] = useState(true);
    const [stateFormFiltros, setStateFormFiltros] = useState(initialStateFormFiltros);
    const [categoriaLida, setCategoriaLida] = useState("todas");
    const [checkBoxMarcadoDesmarcado, setCheckBoxMarcadoDesmarcado] = useState("");

    useEffect(()=> {
        trazerNotificacoes();
        getTabelaNotificacoes();
    }, []);

    useEffect(()=>{
        qtdeNotificacoesNaoLidas()
    }, [clickBtnNotificacoes]);

    useEffect(()=>{
        trazNotificacoesDeAcordoComEscolhido();
    }, [checkBoxMarcadoDesmarcado]);


    const trazNotificacoesDeAcordoComEscolhido = async () =>{
        let escolhido = categoriaLida;
        if (escolhido === 'nao_lidas'){
            await trazerNotificacoesLidasNaoLidas("False")
        }else if (escolhido === "lidas"){
            await trazerNotificacoesLidasNaoLidas("True")
        }else if (escolhido === 'todas'){
            await trazerNotificacoes();
        }
    };

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
        let lidas = e.target.id;
        setCategoriaLida(lidas);
        setClickBtnNotificacoes(false);

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
        // Gero um uuid aleatório para sempre mudar o estado de checkBoxMarcadoDesmarcado, para chamar o useEffect correpondente e executar trazNotificacoesDeAcordoComEscolhido
        setCheckBoxMarcadoDesmarcado(gerarUuid());
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