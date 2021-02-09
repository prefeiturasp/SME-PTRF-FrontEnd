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

const ArquivosDeCarga = () => {
    const url_params = useParams();

    const [tabelaArquivos, setTabelaArquivos] = useState([]);
    const [arquivos, setArquivos] = useState([]);

    const carregaTabelaArquivos = useCallback(async ()=>{
        let tabela = await getTabelaArquivos();
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

    //Para a Tabela
    const rowsPerPage = 10;

    const conteudoTemplate = (rowData, column) =>{
        return(
            <div className='quebra-palavra'>
                {rowData[column.field].split('/').pop()}
            </div>
        )
    };

    const statusTemplate = (rowData) => {
        return rowData.status && rowData.status === 'PENDENTE' ? 'Pendente' : rowData.status && rowData.status === 'SUCESSO' ? 'Sucesso' : 'Erro'
    };
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
            <>
                {url_params.tipo_de_carga !== 'CARGA_ASSOCIACOES' ? (
                    <Redirect
                        to={{
                            pathname: '/painel-parametrizacoes',
                        }}
                    />
                ) :
                    <div className="page-content-inner">
                        <BotoesTopo/>
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

