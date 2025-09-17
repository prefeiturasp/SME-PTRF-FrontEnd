import React, {Fragment, useEffect, useState} from "react";
import {MsgImgCentralizada} from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {formataData} from "../../../../../utils/FormataData"
import { TabelaContasEncerradas } from "./TabelaContasEncerradas";
import { ModalConfirmarEncerramento } from "./ModalConfirmarEncerramento";
import { ModalRejeitarEncerramento } from "./ModalRejeitarEncerramento";
import { aprovarSolicitacaoEncerramentoConta, rejeitarSolicitacaoEncerramentoConta, getContas, getMotivosRejeicaoEncerramentoContas, getContasAssociacaoEncerradas } from "../../../../../services/dres/Associacoes.service";
import Loading from "../../../../../utils/Loading";
import {toastCustom} from "../../../../Globais/ToastCustom";
import { BarraStatusEncerramentoConta } from "./BarraStatusEncerramentoConta/index";
import {visoesService} from "../../../../../services/visoes.service"

export const  InfosContas = ({dadosDaAssociacao}) =>{
    const [dataModalConfirmarEncerramentoConta, setDataModalConfirmarEncerramentoConta] = useState({
        show: false,
        conta: {}
    });
    const [dataModalRejeitarEncerramentoConta, setDataModalRejeitarEncerramentoConta] = useState({
        show: false,
        conta: {}
    });
    const [contasDaAssociacao, setContasDasAssociacoes] = useState([]);
    const [contasEncerradas, setContasEncerradas] = useState([]);
    const [motivos, setMotivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorModalRejeicao, setErrorModalRejeicao] = useState(null)
    const permiossaoEncerramento = visoesService.getPermissoes(["change_encerrar_associacoes"])
    const habilitaBotoesEncerramento = (conta) => {
        return apresentaDataDeEncerramentoDeConta(conta) &&
            conta.tipo_conta.permite_inativacao &&
            permiossaoEncerramento;
    };
    const apresentaDataDeEncerramentoDeConta = (conta) => {
        return conta && conta.solicitacao_encerramento !== null && conta.solicitacao_encerramento.status === "PENDENTE";
    };

    useEffect(() => {
        if(dadosDaAssociacao.dados_da_associacao.uuid) {
            getContasAssociacao(dadosDaAssociacao.dados_da_associacao.uuid);
            getContasAssociacaoEncerrada(dadosDaAssociacao.dados_da_associacao.uuid);
        }
        getMotivosRejeicaoEncerramentoConta();     
    }, [])

    const getContasAssociacao = async (id_associacao) => {
        const response = await getContas(id_associacao);
        setContasDasAssociacoes(response);
        setLoading(false);
    };

    const getMotivosRejeicaoEncerramentoConta = async () => {
        const response = await getMotivosRejeicaoEncerramentoContas();
        if(response.results && response.results.length > 0) {
            let copia_motivos = [...response.results];
            let copia_motivos_com_indicativo_selecao = copia_motivos.map(obj => ({
                ...obj,
                selected: false
              }));
            setMotivos(copia_motivos_com_indicativo_selecao);
        }
    };

    const getContasAssociacaoEncerrada = async (id_associacao) => {
        const response = await getContasAssociacaoEncerradas(id_associacao);
        setContasEncerradas(response);
    }

    const handleOpenModalConfirmarEncerramentoConta = (conta) => {
        return setDataModalConfirmarEncerramentoConta({
            show: true,
            conta: conta
        });
    };

    const handleCloseModalConfirmarEncerramentoConta = () => {
        return setDataModalConfirmarEncerramentoConta({
            show: false,
            conta: {}
        });
    };

    const handleConfirmarEncerramentoConta = () => {
        confirmarEncerramentoConta()
    }

    const confirmarEncerramentoConta = async () => {
        if (dataModalConfirmarEncerramentoConta.conta && dataModalConfirmarEncerramentoConta.conta.uuid && dataModalConfirmarEncerramentoConta.conta.solicitacao_encerramento.uuid) {
            const idSolicitacao = dataModalConfirmarEncerramentoConta.conta.solicitacao_encerramento.uuid;
            setLoading(true);
            try {
                const response = await aprovarSolicitacaoEncerramentoConta(idSolicitacao);

                if (response.status === 200) {
                    handleCloseModalConfirmarEncerramentoConta({
                        show: false,
                        conta: {}
                    })
                    toastCustom.ToastCustomSuccess('Conta encerrada com sucesso')
                    await getContasAssociacao(dadosDaAssociacao.dados_da_associacao.uuid);
                    await getContasAssociacaoEncerrada(dadosDaAssociacao.dados_da_associacao.uuid);
                } else {
                    toastCustom.ToastCustomError("Erro ao encerrar conta");
                }
            } catch (error) {
                console.log(error)
            }

            setLoading(false);
        }
    }

    const handleOpenModalRejeitarEncerramentoConta = (conta) => {
        setErrorModalRejeicao("")
        return setDataModalRejeitarEncerramentoConta({
            show: true,
            conta: conta
        });
    };

    const handleCloseModalRejeitarEncerramentoConta = () => {
        return setDataModalRejeitarEncerramentoConta({
            show: false,
            conta: {}
        });
    };

    const handleRejeitarEncerramentoConta = (motivosRejeicao = [], outrosMotivosRejeicao = "") => {
        let motivosSelecionados = []

        if(motivosRejeicao && motivosRejeicao.length > 0) {
            motivosSelecionados = motivosRejeicao
                .filter(obj => obj.selected)
                .map(obj => obj.uuid);
        };

        const payloadMotivos = {
            outros_motivos_rejeicao: outrosMotivosRejeicao,
            motivos_rejeicao:  motivosSelecionados
        };

        if((motivosSelecionados && motivosSelecionados.length > 0) || outrosMotivosRejeicao) {
            rejeitarEncerramentoConta(payloadMotivos)
        } else {
            setErrorModalRejeicao("Selecionar ou digitar pelo menos um motivo.")
        }
    }

    const rejeitarEncerramentoConta = async (payloadMotivos) => {
        if (dataModalRejeitarEncerramentoConta.conta && dataModalRejeitarEncerramentoConta.conta.uuid && dataModalRejeitarEncerramentoConta.conta.solicitacao_encerramento.uuid) {
            const idSolicitacao = dataModalRejeitarEncerramentoConta.conta.solicitacao_encerramento.uuid;
            setLoading(true);
            try {
                const response = await rejeitarSolicitacaoEncerramentoConta(payloadMotivos, idSolicitacao);

                if (response.status === 200) {
                    handleCloseModalRejeitarEncerramentoConta({
                        show: false,
                        conta: {}
                    })
                    toastCustom.ToastCustomSuccess('Solicitação negada com sucesso')
                    getContasAssociacao(dadosDaAssociacao.dados_da_associacao.uuid);
                    getContasAssociacaoEncerrada(dadosDaAssociacao.dados_da_associacao.uuid);
                } else {
                    toastCustom.ToastCustomError("Erro ao tentar rejeitar solicitação de encerramento");
                }
            } catch (error) {
                console.log(error)
            }

            setLoading(false);
        }
    }

    const mensagemQuandoNaoExistemContasParaApresentar = (accEncerradas) => {
        if(accEncerradas && accEncerradas.length <= 0) {
            return "Não há conta vinculada a esta Associação. Para que seja possível cadastrar lançamentos será necessário que uma conta seja vinculada a ela."
        } else if(accEncerradas && accEncerradas.length > 0) {
            return "As contas da Associação foram encerradas. Para que seja possível cadastrar novos lançamentos será necessário que uma conta seja vinculada a ela." 
        }
        return "Não encontramos nenhuma conta, tente novamente."
    }
    

    return(
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
                    <div className="row">
                        <div className="d-flex bd-highlight">
                            <div className="flex-grow-1 bd-highlight">
                                <p className="mb-1 ml-2 titulo-explicativo-dre-detalhes">Dados da conta da associação</p>
                            </div>
                        
                        </div>
                    </div>

                    <div className="row">
                        {contasDaAssociacao && contasDaAssociacao.length > 0 ? contasDaAssociacao.map((conta, index)=>
                            <Fragment key={index}>
                                
                                <div className={`col-12 mt-${index === 0 ? "2" : 4} mb-xs-4 mb-md-4 mb-xl-3 ml-0`}>
                                    <p className="mb-0">
                                        <span className="contador-conta"><strong>Conta {index + 1}</strong></span> <span className="divisor"></span>
                                    </p>
                                </div>
                                <div className={`col-12 col-md-${apresentaDataDeEncerramentoDeConta(conta) ? "2" : "3"}`}>
                                    <p><strong>Banco</strong></p>
                                    <p>{conta.banco_nome}</p>
                                </div>
                                <div className={`col-12 col-md-${apresentaDataDeEncerramentoDeConta(conta) ? "2" : "3"}`}>
                                    <p><strong>Tipo de conta</strong></p>
                                    <p>{conta.tipo_conta.nome}</p>
                                </div>
                                <div className={`col-12 col-md-${apresentaDataDeEncerramentoDeConta(conta) ? "2" : "3"}`}>
                                    <p><strong>Agência</strong></p>
                                    <p>{conta.agencia}</p>
                                </div>
                                <div className="col-12 col-md-3">
                                    <p><strong>Nº da conta com o dígito</strong></p>
                                    <p>{conta.numero_conta}</p>
                                </div>
                                
                                {apresentaDataDeEncerramentoDeConta(conta) && conta.tipo_conta.permite_inativacao &&
                                    <>
                                    <div className="col-12 col-md-3 form-group">
                                        <label>
                                            <strong>Data do encerramento</strong> 
                                            <span data-html={true} data-tooltip-content="Data de encerramento da conta na agência.">
                                                <FontAwesomeIcon
                                                    style={{marginLeft: "10px", color: '#2B7D83'}}
                                                    icon={faExclamationCircle}
                                                />
                                            </span>
                                            <ReactTooltip html={true}/>
                                        </label>
                                        <input className="form-control" disabled value={conta.solicitacao_encerramento !== null ? formataData(conta.solicitacao_encerramento.data_de_encerramento_na_agencia)  : null}/>
                                    </div>
                                    </>
                                }

                                <div className="card h-100 w-100 mx-3">
                                    <div className="card-body">
                                        {conta.solicitacao_encerramento && conta.solicitacao_encerramento.status === "REJEITADA" && conta.tipo_conta.permite_inativacao &&
                                            <BarraStatusEncerramentoConta conta={conta}/>
                                        }
                                        <div className="row">
                                            <div className="col-5">
                                                <div>
                                                    <label className="textos-card-saldos">Saldo de Recursos da Conta {index + 1}</label>
                                                </div>
                                                <div>
                                                    <span className="saldo-recursos-conta">R$ {conta.saldo_atual_conta ? conta.saldo_atual_conta.toLocaleString("pt-BR") : 0}</span>
                                                </div>
                                            </div>
                                            <div className="col-7 text-right mt-3">
                                                <button
                                                    type="button"
                                                    className="btn btn-base-verde-outline mr-3"
                                                    onClick={() => handleOpenModalConfirmarEncerramentoConta(conta)}
                                                    disabled={!habilitaBotoesEncerramento(conta)}
                                                >
                                                    Confirmar encerramento
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-base-verde-outline"
                                                    onClick={() => handleOpenModalRejeitarEncerramentoConta(conta)}
                                                    disabled={!habilitaBotoesEncerramento(conta)}
                                                >
                                                    Rejeitar encerramento
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                        ):
                            <MsgImgCentralizada
                                texto={mensagemQuandoNaoExistemContasParaApresentar(contasEncerradas)}
                                img={Img404}
                            />
                        }
                    </div>

                    {contasEncerradas && contasEncerradas.length > 0 &&
                        <section className="mt-5">
                            <TabelaContasEncerradas
                                contas={contasEncerradas}
                                rowsPerPage={10}
                            />
                        </section>
                    }

                    <section>
                        <ModalConfirmarEncerramento
                            show={dataModalConfirmarEncerramentoConta.show}
                            handleClose={handleCloseModalConfirmarEncerramentoConta}
                            onConfirmarEncerramento={handleConfirmarEncerramentoConta}
                            titulo="Encerramento da conta"
                            texto="<p>Confirmar o encerramento da conta bancária da Associação?</p>"
                            primeiroBotaoTexto="Cancelar"
                            primeiroBotaoCss="btn btn-base-verde-outline"
                            segundoBotaoTexto="Confirmar"
                            segundoBotaoCss="btn btn-base-verde"
                        />
                    </section>

                    <section>
                        <ModalRejeitarEncerramento
                            show={dataModalRejeitarEncerramentoConta.show}
                            handleClose={handleCloseModalRejeitarEncerramentoConta}
                            onRejeitarEncerramento={handleRejeitarEncerramentoConta}
                            setMotivosRejeicao={setMotivos}
                            motivosRejeicao={motivos}
                            errorModalRejeicao={errorModalRejeicao}
                            titulo="Rejeitar encerramento da conta"
                            primeiroBotaoTexto="Cancelar"
                            primeiroBotaoCss="btn btn-base-verde-outline"
                            segundoBotaoTexto="Confirmar rejeição"
                            segundoBotaoCss="btn btn-base-vermelho"
                        />
                    </section>
                </>
            }
        </>
    );
};
