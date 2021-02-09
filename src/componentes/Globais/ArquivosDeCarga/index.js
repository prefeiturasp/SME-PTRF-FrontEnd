import React, {memo, useMemo, useCallback, useEffect, useState} from "react";
import "./arquivos-de-carga.scss"
import {Redirect, useParams} from 'react-router-dom'
import {BotoesTopo} from "./BotoesTopo";
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {getTabelaArquivos, getArquivosFiltros} from "../../../services/sme/Parametrizacoes.service";
import moment from "moment";
import TabelaArquivosDeCarga from "./TabelaArquivosDeCarga";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus} from "@fortawesome/free-solid-svg-icons";
import {Filtros} from "./Filtros";
import {UrlsMenuInterno} from "../../sme/Parametrizacoees/Estrutura/Associacoes/UrlsMenuInterno";
import {MenuInterno} from "../MenuInterno";

const ArquivosDeCarga = () => {
    const url_params = useParams();

    const [tabelaArquivos, setTabelaArquivos] = useState([]);
    const [arquivos, setArquivos] = useState([]);

    const carregaTabelaArquivos = useCallback(async ()=>{
        let tabela = await getTabelaArquivos();
        console.log("TABELA ", tabela);
        setTabelaArquivos(tabela)
    }, []);

    useEffect(()=>{
        carregaTabelaArquivos();
    }, [carregaTabelaArquivos]);

    const carregaArquivosPeloTipoDeCarga = useCallback(async ()=>{
        try {
            let arquivos = await getArquivosFiltros(url_params.tipo_de_carga);
            console.log("Arquivos ", arquivos);
            setArquivos(arquivos)
        }catch (e) {
            console.log("Erro ao carregar arquivos")
        }
    }, [url_params]);

    useEffect(()=>{
        carregaArquivosPeloTipoDeCarga()
    }, [carregaArquivosPeloTipoDeCarga]);


    // Quando a state de todasAsAcoes sofrer alteração
    const totalDeArquivos = useMemo(() => arquivos.length, [arquivos]);

    // Filtros
    const initialStateFiltros = {
        filtrar_por_identificador: "",
        filtrar_por_status: "",
        filtrar_por_data_de_execucao: "",
    };
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);

    const handleChangeFiltros = useCallback((name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    }, [stateFiltros]);

    const handleSubmitFiltros = async () => {
        let arquivos_filtrados = await getArquivosFiltros(url_params.tipo_de_carga, stateFiltros.filtrar_por_identificador, stateFiltros.filtrar_por_status, stateFiltros.filtrar_por_data_de_execucao ? moment(stateFiltros.filtrar_por_data_de_execucao).format('YYYY-MM-DD') : '');
        setArquivos(arquivos_filtrados);
    };

    const limpaFiltros = async () => {
        setStateFiltros(initialStateFiltros);
        await carregaArquivosPeloTipoDeCarga();
    };

    //Para a Tabela
    const rowsPerPage = 10;

    const conteudoTemplate = (rowData, column) =>{
        return(
            <div className='quebra-palavra'>
                {rowData[column.field].split('/').pop()}
            </div>
        )
    };

    const statusTemplate = useCallback( (rowData) => {
        if (tabelaArquivos && tabelaArquivos.status && tabelaArquivos.status.length > 0 ){
            let status_retornar = tabelaArquivos.status.filter(item => item.id === rowData.status)
            return status_retornar[0].nome
        }
    }, [tabelaArquivos]);

    const dataTemplate = (rowData, column) => {
        return (
            <div>
                {rowData[column.field] ? moment(rowData[column.field]).format('DD/MM/YYYY') : '-'}
            </div>
        )
    };

    const dataHoraTemplate = (rowData, column) => {
        return rowData[column.field] ? moment(rowData[column.field]).format("DD/MM/YYYY [às] HH[h]mm") : '-'
    };

    const handleEditarArquivos = useCallback(async (rowData)=>{
        console.log('handleEditarArquivos ', rowData)
    }, []);

    const acoesTemplate = useCallback((rowData) =>{
        return (
            <div>
                <button className="btn-editar-membro" onClick={()=>handleEditarArquivos(rowData)}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={faEdit}
                    />
                </button>
            </div>
        )
    }, [handleEditarArquivos]);

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Associações</h1>
            <>
                {url_params.tipo_de_carga !== 'CARGA_ASSOCIACOES' ? (
                    <Redirect
                        to={{
                            pathname: '/painel-parametrizacoes',
                        }}
                    />
                ) :
                    <div className="page-content-inner">
                        <MenuInterno
                            caminhos_menu_interno={UrlsMenuInterno}
                        />
                        <BotoesTopo/>
                        <Filtros
                            stateFiltros={stateFiltros}
                            handleChangeFiltros={handleChangeFiltros}
                            handleSubmitFiltros={handleSubmitFiltros}
                            limpaFiltros={limpaFiltros}
                            tabelaArquivos={tabelaArquivos}
                        />
                        <p>Exibindo <span className='total-acoes'>{totalDeArquivos}</span> cargas de arquivo</p>
                        <TabelaArquivosDeCarga
                            arquivos={arquivos}
                            rowsPerPage={rowsPerPage}
                            conteudoTemplate={conteudoTemplate}
                            dataTemplate={dataTemplate}
                            dataHoraTemplate={dataHoraTemplate}
                            statusTemplate={statusTemplate}
                            acoesTemplate={acoesTemplate}
                        />
                    </div>
                }
            </>
        </PaginasContainer>
    );
};

export default memo(ArquivosDeCarga)

