import React, {useCallback, useEffect, useState} from "react";
import "../geracao-da-ata.scss"
import {getGerarAtaPdf, getAtas, getDownloadAtaPdf} from "../../../../services/escolas/AtasAssociacao.service";
import Spinner from "../../../../assets/img/spinner.gif";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'

export const BoxPrestacaoDeContasPorPeriodo = ({gerarAta, uuidAtaApresentacao, uuidPrestacaoConta, corBoxPrestacaoDeContasPorPeriodo, textoBoxPrestacaoDeContasPorPeriodo, dataBoxPrestacaoDeContasPorPeriodo, onClickVisualizarAta}) => {

    const [dadosAta, setDadosAta] = useState({});

    useEffect(() => {
        if (uuidAtaApresentacao && dadosAta && dadosAta.status_geracao_pdf && dadosAta.status_geracao_pdf === 'EM_PROCESSAMENTO'){
            const timer = setInterval(() => {
                get_dados_ata();
            }, 5000);
            // clearing interval
            return () => clearInterval(timer);
        }
    });

    const get_dados_ata = useCallback(async ()=>{
        if (uuidAtaApresentacao){
            let dados_ata = await getAtas(uuidAtaApresentacao);
            setDadosAta(dados_ata)
        }
    }, [uuidAtaApresentacao])

    useEffect(()=>{
        get_dados_ata()
    }, [get_dados_ata])

    const gerar_ata_pdf = async () =>{
        await getGerarAtaPdf(uuidPrestacaoConta, uuidAtaApresentacao)
        await get_dados_ata()
    }

    const download_ata_pdf = async () =>{
        await getDownloadAtaPdf(uuidAtaApresentacao)
        await get_dados_ata()
    }

    return (
        <div className="row mt-5">
            <div className="col-12">
                <h1 className="titulo-box-prestacao-de-contas-por-periodo">Atas da prestação de contas</h1>
                <div className="col-12">
                    <div className="row mt-3 container-box-prestacao-de-contas-por-periodo pt-4 pb-4">
                        <div className="col-12 col-md-8">
                            <p className='fonte-14 mb-1'><strong>{textoBoxPrestacaoDeContasPorPeriodo}</strong></p>
                            <p
                                className={`fonte-12 mb-1 status-data-${corBoxPrestacaoDeContasPorPeriodo}`}
                            >
                                {dataBoxPrestacaoDeContasPorPeriodo}

                                {dadosAta && dadosAta.status_geracao_pdf && dadosAta.status_geracao_pdf === "EM_PROCESSAMENTO" ? (
                                    <span className='text-body'> Gerando ata em PDF<img src={Spinner} style={{height: "22px"}} alt=''/></span>
                                    ) : dadosAta && dadosAta.status_geracao_pdf && dadosAta.status_geracao_pdf === "CONCLUIDO" &&
                                    <button className='btn-editar-membro'
                                            type='button'
                                            onClick={download_ata_pdf}
                                    >
                                        <FontAwesomeIcon
                                            style={{fontSize: '18px'}}
                                            icon={faDownload}
                                        />
                                        &nbsp;PDF
                                    </button>
                                }
                            </p>
                        </div>
                        <div className="col-12 col-md-4 align-self-center">
                            <button onClick={()=>onClickVisualizarAta()}  type="button" className="btn btn-success float-right">Visualizar ata</button>
                            <button
                                onClick={()=>gerar_ata_pdf()}
                                type="button"
                                className="btn btn-outline-success float-right mr-2"
                                disabled={!uuidAtaApresentacao || !gerarAta}
                            >
                                gerar ata
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};