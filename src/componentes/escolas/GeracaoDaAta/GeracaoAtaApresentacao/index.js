import React, {useCallback, useEffect, useState} from "react";
import "../geracao-da-ata.scss"
import {getGerarAtaPdf, getAtas, getDownloadAtaPdf} from "../../../../services/escolas/AtasAssociacao.service";
import {ModalNaoPodeGerarAta} from "../ModalNaoPodeGerarAta";
import Spinner from "../../../../assets/img/spinner.gif";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'

export const GeracaoAtaApresentacao = (
    {
        uuidAtaApresentacao,
        uuidPrestacaoConta,
        corBoxAtaApresentacao,
        textoBoxAtaApresentacao,
        dataBoxAtaApresentacao,
        onClickVisualizarAta,
    }
) => {

    const [dadosAta, setDadosAta] = useState({});
    const [showNaoPodeGerarAta, setShowNaoPodeGerarAta] = useState(false);
    const [textoModalAta, setTextoModalAta] = useState('<p>Você não pode gerar o PDF de uma ata incompleta.</p>');

    useEffect(() => {
        if (uuidAtaApresentacao && dadosAta && dadosAta.status_geracao_pdf && dadosAta.status_geracao_pdf === 'EM_PROCESSAMENTO'){
            const timer = setInterval(() => {
                getDadosAta();
            }, 5000);
            // clearing interval
            return () => clearInterval(timer);
        }
    });

    const getDadosAta = useCallback(async ()=>{
        if (uuidAtaApresentacao){
            let dados_ata = await getAtas(uuidAtaApresentacao);
            setDadosAta(dados_ata)
        }
    }, [uuidAtaApresentacao])

    useEffect(()=>{
        getDadosAta()
    }, [getDadosAta])

    const gerarAta = async () =>{
        try {
            await getGerarAtaPdf(uuidPrestacaoConta, uuidAtaApresentacao)
            await getDadosAta()
        }
        catch (e) {
            let mensagem = ''
            let camposInvalidos = e.response.data.campos_invalidos
            camposInvalidos.map((element) => {
                mensagem += typeof(element) === 'object' ? ` ${element['msg_presente']}` : ` ${element}, `
            })
            setTextoModalAta(`<p>Você não pode gerar o PDF de uma ata incompleta. Para completa-la ${camposInvalidos[0]['msg_presente'] ? mensagem :  `preencha os campo(s) ${mensagem}`}.</p>`.replace(/,(?=[^,]*$)/, '')) // Regex remove espaço em branco e virgula no final. ⮕ (/,(?=[^,]*$)/,) ''
            setShowNaoPodeGerarAta(true)
        }
    }

    const download_ata_pdf = async () =>{
        await getDownloadAtaPdf(uuidAtaApresentacao)
        await getDadosAta()
    }

    return (
        <div className="row mt-5">
            <div className="col-12">
                <h1 className="titulo-box-prestacao-de-contas-por-periodo">Atas da prestação de contas</h1>
                <div className="col-12">
                    <div className="row mt-3 container-box-prestacao-de-contas-por-periodo pt-4 pb-4">
                        <div className="col-12 col-md-8">
                            <p className='fonte-14 mb-1'><strong>{textoBoxAtaApresentacao}</strong></p>
                            <p
                                className={`fonte-12 mb-1 status-data-${corBoxAtaApresentacao}`}
                            >
                                {dataBoxAtaApresentacao}

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
                        <section>
                        <ModalNaoPodeGerarAta 
                            show={showNaoPodeGerarAta}
                            handleClose={() => { setShowNaoPodeGerarAta(false) }}
                            setShowNaoPodeGerarAta={setShowNaoPodeGerarAta}
                            titulo="Campo em ata incompletos"
                            texto={textoModalAta}
                            primeiroBotaoTexto="Fechar"
                            primeiroBotaoCss="outline-success"
                        />
                        </section>
                        <div className="col-12 col-md-4 align-self-center">
                            <button onClick={()=>onClickVisualizarAta()}  type="button" className="btn btn-success float-right">{uuidPrestacaoConta ? "Visualizar ata" : "Visualizar prévia da ata"}</button>
                            {uuidPrestacaoConta &&
                            <button
                                onClick={() => gerarAta()}
                                type="button"
                                className="btn btn-outline-success float-right mr-2"
                            >
                                gerar ata
                            </button>
                            }

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
};