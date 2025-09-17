import React, {useCallback, useEffect, useState} from "react";
import "../geracao-da-ata.scss"
import {getGerarAtaPdf, getAtas, getDownloadAtaPdf} from "../../../../services/escolas/AtasAssociacao.service";
import {ModalNaoPodeGerarAta} from "../ModalNaoPodeGerarAta";
import Spinner from "../../../../assets/img/spinner.gif";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'
import {getPeriodoFechado} from "../../../../services/escolas/Associacao.service";
import {visoesService} from "../../../../services/visoes.service"

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
    const [docPrestacaoConta, setDocPrestacaoConta] = useState({});
    const [textoModalAta, setTextoModalAta] = useState('<p>Você não pode gerar o PDF de uma ata incompleta.</p>');
    const temPermissao = visoesService.getPermissoes(["change_ata_prestacao_contas"])
    const btGerarDesabilitado =
        !(uuidPrestacaoConta && docPrestacaoConta?.gerar_ou_editar_ata_apresentacao) ||
        !temPermissao;

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
        let periodo_prestacao_de_contas = JSON.parse(localStorage.getItem("periodoPrestacaoDeConta"));
        if (uuidAtaApresentacao){
            let dados_ata = await getAtas(uuidAtaApresentacao);
            let doc_pc = periodo_prestacao_de_contas.data_inicial ? await getPeriodoFechado(periodo_prestacao_de_contas.data_inicial) : null;
            setDadosAta(dados_ata)
            setDocPrestacaoConta(doc_pc)
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
                            <p className='fonte-14 mb-1' data-qa='titulo-box-geracao-ata'><strong>{textoBoxAtaApresentacao}</strong></p>
                            <p className={`fonte-12 mb-1 status-data-${corBoxAtaApresentacao}`} data-qa='status-box-geracao-ata'>
                                {dataBoxAtaApresentacao}

                                {dadosAta && dadosAta.status_geracao_pdf && dadosAta.status_geracao_pdf === "EM_PROCESSAMENTO" ? (
                                    <span className='text-body'> Gerando ata em PDF<img src={Spinner} style={{height: "22px"}} alt=''/></span>
                                    ) : dadosAta && dadosAta.status_geracao_pdf && dadosAta.status_geracao_pdf === "CONCLUIDO" &&
                                    <button className='btn-editar-membro'
                                            type='button'
                                            onClick={download_ata_pdf}
                                            data-qa='btn-baixar-ata-pdf'
                                    >
                                        <FontAwesomeIcon
                                            style={{fontSize: '18px'}}
                                            icon={faDownload}
                                        />
                                        &nbsp;
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
                            dataQa="modal-nao-pode-gerar-ata-campos-incompletos"
                        />
                        </section>
                        <div className="col-12 col-md-4 align-self-center">
                            <button 
                                onClick={()=>onClickVisualizarAta()}
                                type="button" 
                                className="btn btn-success float-right"
                                data-qa="btn-visualizar-ata"
                            >
                                {uuidPrestacaoConta ? "Visualizar ata" : "Visualizar prévia da ata"}
                            </button>

                            <button
                                onClick={() => gerarAta()}
                                type="button"
                                className="btn btn-outline-success float-right mr-2"
                                disabled={btGerarDesabilitado}
                                title={!(docPrestacaoConta?.gerar_ou_editar_ata_apresentacao) ? 'A ata de apresentação só pode ser gerada enquanto o status da PC for "Não recebida".': ''}
                                data-qa="btn-gerar-ata"
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