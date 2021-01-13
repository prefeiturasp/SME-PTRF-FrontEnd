import React, {useState, useEffect, useCallback, useMemo} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {getTodasAcoesDasAssociacoes, getListaDeAcoes, getFiltros} from "../../../../../services/sme/Parametrizacoes.service";
import '../parametrizacoes-estrutura.scss'
import {MenuInterno} from "../../../../Globais/MenuInterno";
import {UrlsMenuInterno} from "../UrlsMenuInterno";
import {Filtros} from "./Filtros";
import {BtnAddAcoes} from "./BtnAddAcoes";
import {TabelaAcoesDasAssociacoes} from "./TabelaAcoesDasAssociacoes";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faEdit} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../../utils/Loading";

export const AcoesDasAssociacoes = () => {

    const initialStateFiltros = {
        filtrar_por_nome_cod_eol: "",
        filtrar_por_acao: "",
        filtrar_por_status: "",
    };

    const [todasAsAcoes, setTodasAsAcoes] = useState([]);
    const [count, setCount] = useState(0);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [listaTiposDeAcao, setListaTiposDeAcao] = useState([]);
    const [loading, setLoading] = useState(true);

    const carregaTodasAsAcoes = useCallback(async () => {
        setLoading(true);
        let todas_acoes = await getTodasAcoesDasAssociacoes();
        console.log('carregaTodasAsAcoes ', todas_acoes);
        setTodasAsAcoes(todas_acoes);
        setLoading(false);
    }, []);

    useEffect(() => {
        carregaTodasAsAcoes();
    }, [carregaTodasAsAcoes]);

    // Quando a state de todasAsAcoes sofrer alteração
    const totalDeAcoes = useMemo(() => todasAsAcoes.length, [todasAsAcoes]);

    const carregaListaTiposDeAcao = useCallback(async () => {
        const resp = await getListaDeAcoes();
        setListaTiposDeAcao(resp);
    }, []);

    useEffect(() => {
        carregaListaTiposDeAcao();
    }, [carregaListaTiposDeAcao]);

    // Para os Filtros
    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };
    const handleSubmitFiltros = async () => {
        setLoading(true);
        let acoes_filtradas = await getFiltros(stateFiltros.filtrar_por_nome_cod_eol, stateFiltros.filtrar_por_acao, stateFiltros.filtrar_por_status);
        setTodasAsAcoes(acoes_filtradas);
        setLoading(false)
    };
    const limpaFiltros = async () => {
        setStateFiltros(initialStateFiltros);
        await carregaTodasAsAcoes();
    };

    //Para a Tabela
    const rowsPerPage = 10;
    const statusTemplate = (rowData) => {
        return rowData.status && rowData.status === 'ATIVA' ? 'Ativa' : 'Inativa'
    };
    const dataTemplate = (rowData) => {
        return rowData.criado_em ? moment(rowData.criado_em).format("DD/MM/YYYY [às] HH[h]mm") : '';
    };
    const handleEditarAcoes = (rowData) => {
        console.log('handleEditarAcoes', rowData)
    };
    const acoesTemplate = (rowData) => {
        return (
            <div>
                <button onClick={() => handleEditarAcoes(rowData)} className="btn-editar-membro">
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faEdit}
                    />
                </button>
            </div>
        )
    };

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Ações das Associações</h1>
            <div className="page-content-inner">
                <MenuInterno
                    caminhos_menu_interno={UrlsMenuInterno}
                />
                <BtnAddAcoes
                    FontAwesomeIcon={FontAwesomeIcon}
                    faPlus={faPlus}
                />

                <button onClick={()=>setCount(prevState => prevState+1)}>Botão Sem Use Calback: {count}</button>

                <Filtros
                    stateFiltros={stateFiltros}
                    handleChangeFiltros={handleChangeFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                    limpaFiltros={limpaFiltros}
                    listaTiposDeAcao={listaTiposDeAcao}
                />

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
                    <>
                        <p>Exibindo <span className='total-acoes'>{totalDeAcoes}</span> ações de associações</p>
                        <TabelaAcoesDasAssociacoes
                            todasAsAcoes={todasAsAcoes}
                            rowsPerPage={rowsPerPage}
                            statusTemplate={statusTemplate}
                            dataTemplate={dataTemplate}
                            acoesTemplate={acoesTemplate}
                        />
                    </>
                }
            </div>
        </PaginasContainer>
    )
};