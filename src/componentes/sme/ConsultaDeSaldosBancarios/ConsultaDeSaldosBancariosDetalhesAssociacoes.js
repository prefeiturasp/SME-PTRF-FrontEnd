import React, {useCallback, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {
    getPeriodos,
    getTiposDeConta,
    getDres,
    getSaldosDetalhesAssociacoes,
} from "../../../services/sme/ConsultaDeSaldosBancarios.service";
import {SelectPeriodo} from "./SelectPeriodo";
import {exibeDataPT_BR} from "../../../utils/ValidacoesAdicionaisFormularios";
import {SelectConta} from "./SelectConta";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faSearch, faDownload} from "@fortawesome/free-solid-svg-icons";
import {getTabelaAssociacoes} from "../../../services/sme/Parametrizacoes.service";
import {Filtros} from "./Filtros";
import {TabelaSaldosDetalhesAssociacoes} from "./TabelaSaldosDetalhesAssociacoes";
import moment from "moment";

export const ConsultaDeSaldosBancariosDetalhesAssociacoes = () =>{

    let {periodo_uuid, conta_uuid, dre_uuid} = useParams();

    const [periodos, setPeriodos] = useState([])
    const [selectPeriodo, setSelectPeriodo] = useState(periodo_uuid);
    const [tiposDeConta, setTiposDeConta] = useState([])
    const [selectTipoDeConta, setSelectTipoDeConta] = useState(conta_uuid);
    const [dres, setDres] = useState([])

    const carregaPeriodos = useCallback(async () => {
        let periodos = await getPeriodos()
        setPeriodos(periodos)
    }, [])

    const carregaTiposDeConta = useCallback(async () => {
        let tipos_de_conta = await getTiposDeConta()
        setTiposDeConta(tipos_de_conta)
    }, [])

    useEffect(() => {
        carregaPeriodos()
        carregaTiposDeConta()
    }, [carregaPeriodos, carregaTiposDeConta])

    const carregaDres = useCallback(async ()=>{
        let dres = await getDres()
        console.log("DRES ", dres)
        setDres(dres)
    }, [])

    useEffect(()=>{
        carregaDres()
    }, [carregaDres])

    const handleChangeConta = async (conta_uuid) => {
        setSelectTipoDeConta(conta_uuid);
    };

    const handleChangePeriodo = async (periodo_uuid) => {
        setSelectPeriodo(periodo_uuid);
    };

    // Tabela Saldos Detalhes Associacoes
    const rowsPerPage = 10
    const [saldosDetalhesAssociacoes, setSaldosDetalhesAssociacoes] = useState([])

    const carregaSaldosDetalhesAssociacoes = useCallback(async ()=>{
        if (selectPeriodo && selectTipoDeConta){
            let saldos_detalhes_associacoes = await getSaldosDetalhesAssociacoes(selectPeriodo, selectTipoDeConta, dre_uuid)
            console.log("carregaSaldosDetalhesAssociacoes ", saldos_detalhes_associacoes)
            setSaldosDetalhesAssociacoes(saldos_detalhes_associacoes)
        }
    }, [selectPeriodo, selectTipoDeConta])

    useEffect(()=>{
        carregaSaldosDetalhesAssociacoes()
    }, [carregaSaldosDetalhesAssociacoes])

    const exibeNomeDre = useCallback((dre_uuid)=> {
        if (dres && dres.length > 0 && dre_uuid){
            return dres.find(elemento => elemento.uuid === dre_uuid).nome
        }
    }, [dres])

    const valorTemplate = (rowData, column) => {
        let valor_formatado = rowData[column.field]
            ? Number(rowData[column.field]).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : '-';
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
    };

    const dataTemplate = (rowData, column) => {
        return (
            <div>
                {rowData[column.field] ? moment(rowData[column.field]).format('DD/MM/YYYY') : '-'}
            </div>
        )
    };

    const acoesTemplate = (rowData) =>{
        return (
            <div>
                <button className="btn-editar-membro mr-2" onClick={()=>handleClickVerExtrato(rowData)}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faSearch}
                    />
                </button>
                <button className="btn-editar-membro" onClick={()=>handleClickDownloadExtrato(rowData)}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faDownload}
                    />
                </button>
            </div>
        )
    };

    const handleClickVerExtrato = (rowData) =>{
        console.log('handleClickVerExtrato ', rowData)
    }

    const handleClickDownloadExtrato = (rowData) =>{
        console.log('handleClickDownloadExtrato ', rowData)
    }

    // Filtros
    const initialStateFiltros = {
        filtrar_por_unidade: "",
        filtrar_por_tipo_ue: "",
    };

    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState(initialStateFiltros);

    const carregaTabelasAssociacoes = useCallback(async () => {
        let tabela = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela);
    }, []);

    useEffect(() => {
        carregaTabelasAssociacoes();
    }, [carregaTabelasAssociacoes]);

    const handleChangeFiltros = useCallback((name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    }, [stateFiltros]);

    const handleSubmitFiltros = async () => {
        console.log("Submit Filtros ", stateFiltros)

    };

    const limpaFiltros = async () => {
        setStateFiltros(initialStateFiltros);
    };

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Consulta de saldos bancários</h1>
            <div className="page-content-inner">
                <div className='row'>
                    <SelectPeriodo
                        periodosAssociacao={periodos}
                        handleChangePeriodo={handleChangePeriodo}
                        selectPeriodo={selectPeriodo}
                        exibeDataPT_BR={exibeDataPT_BR}
                    />
                    <SelectConta
                        handleChangeConta={handleChangeConta}
                        selectConta={selectTipoDeConta}
                        tiposConta={tiposDeConta}
                    />
                </div>
                <div className="d-flex bd-highlight mt-5 border-bottom">
                    <div className="flex-grow-1 bd-highlight">
                        <p className='nome-dre'>{exibeNomeDre(dre_uuid)}</p>
                    </div>
                    <div className="p-2 bd-highlight">
                        <Link
                            to={`/consulta-de-saldos-bancarios/${selectPeriodo}/${selectTipoDeConta}/`}
                            className='link-voltar'
                        >
                            <FontAwesomeIcon
                                style={{fontSize: '15px', marginRight: "3px", color: "#00585E"}}
                                icon={faArrowLeft}
                            />
                            Voltar
                        </Link>
                    </div>
                </div>
                <Filtros
                    stateFiltros={stateFiltros}
                    handleChangeFiltros={handleChangeFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                    limpaFiltros={limpaFiltros}
                    tabelaAssociacoes={tabelaAssociacoes}
                />
                <TabelaSaldosDetalhesAssociacoes
                    saldosDetalhesAssociacoes={saldosDetalhesAssociacoes}
                    valorTemplate={valorTemplate}
                    dataTemplate={dataTemplate}
                    acoesTemplate={acoesTemplate}
                    rowsPerPage={rowsPerPage}
                />
            </div>
        </PaginasContainer>
    )
};