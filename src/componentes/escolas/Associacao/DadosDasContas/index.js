import React, {useCallback, useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {UrlsMenuInterno, retornaMenuAtualizadoPorStatusCadastro} from "../UrlsMenuInterno";
import Loading from "../../../../utils/Loading";
import {MenuInterno} from "../../../Globais/MenuInterno";
import {getContas, salvarContas, getAssociacao, getStatusCadastroAssociacao, encerrarConta, reenviarSolicitacaoEncerramentoConta, getContasEncerradas, cancelarSolicitacaoEncerramentoConta} from "../../../../services/escolas/Associacao.service";
import {FormDadosDasContas} from "./FormDadosDasContas";
import {ExportaDadosDaAsssociacao} from "../ExportaDadosAssociacao";
import { visoesService } from "../../../../services/visoes.service";
import { setStatusCadastro, resetStatusCadastro } from "../../../../store/reducers/componentes/escolas/Associacao/DadosAssociacao/StatusCadastro/actions";
import { toastCustom } from "../../../Globais/ToastCustom";
import { formataData } from "../../../../utils/FormataData";
import { ModalMotivoRejeicaoEncerramento } from "./FormDadosDasContas/ModalMotivoRejeicaoEncerramento";
import { TabelaContasEncerradas } from "./TabelaContasEncerradas";
import { ModalConfirm } from "../../../Globais/Modal/ModalConfirm";

export const DadosDasContas = () => {
    // Redux
    const dispatch = useDispatch(); 
    const statusCadastro = useSelector(state => state.DadosAssociacao);

    const initial = [{
        tipo_conta: "",
        banco_nome: "",
        agencia: "",
        conta_associacao: "",
        numero_conta: "",
    }];

    const [loading, setLoading] = useState(true);
    const [intialValues, setIntialValues] = useState(initial);
    const [errors, setErrors] = useState({});
    const [stateAssociacao, setStateAssociacao] = useState({})
    const [menuUrls, setMenuUrls] = useState(UrlsMenuInterno);
    const [errosDataEncerramentoConta, setErrosDataEncerramentoConta] = useState([]);
    const [contasEncerradas, setContasEncerradas] = useState([]);
    const [showModalMotivoRejeicaoEncerramento, setShowModalMotivoRejeicaoEncerramento] = useState({open: false, motivos: ''});

    useEffect(() =>{
        buscaContas();
    }, []);

    const buscaContas = async ()=>{
        setLoading(true);
        let contas = await getContas();
        let contasEncerradas = await getContasEncerradas();
        setContasEncerradas(contasEncerradas);
        setIntialValues(contas)
        setLoading(false);
    };

    useEffect(() => {
        buscaAssociacao();
    }, []);

    useEffect(() => {
        buscaStatusCadastro();
    }, [intialValues]);

    useEffect(() => {
        atualizaMenu();
    }, [statusCadastro]);

    const getNomeDREFormatado = useCallback(() => {
        if(stateAssociacao && stateAssociacao.unidade) {
            let nomeDre = stateAssociacao.unidade.dre.nome;
            nomeDre = nomeDre.toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase());
            return nomeDre
        }
        return ""
    }, [stateAssociacao]);

    const buscaAssociacao = async () => {
        const associacao = await getAssociacao();
        setStateAssociacao(associacao);
    };

    const buscaStatusCadastro = async () => {
        const responseStatusCadastro = await getStatusCadastroAssociacao();
        if(responseStatusCadastro){
            dispatch(setStatusCadastro(responseStatusCadastro));
        } else {
            dispatch(resetStatusCadastro());
        }
    };
    
    const atualizaMenu = () => {
        let urls = retornaMenuAtualizadoPorStatusCadastro(statusCadastro);
        setMenuUrls(urls);
    };

    const setaCampoReadonly=(conta) =>{
        return conta.tipo_conta.apenas_leitura === true
    };


    const temErros = (values) => {
        const errors = {};
        values.contas.map((item)=>{
            if (item.tipo_conta.apenas_leitura === false) {
                if (!item.tipo_conta || !item.banco_nome || !item.agencia || !item.numero_conta){
                    errors.campos_obrigatorios = "Todos os campos são obrigatórios"
                }
            }
        });

        return errors;
    };

    const onSubmit = async (values) => {
        if (values.contas && values.contas.length > 0 ){
            const erros = temErros(values);
            setErrors(erros);
            if ("campos_obrigatorios" in erros) {
                return
            }

            setLoading(true);
            let payload = [];
            values.contas.map((value)=>{
                payload.push({
                    "uuid": value.uuid,
                    "tipo_conta": value.tipo_conta.id,
                    "banco_nome": value.banco_nome,
                    "agencia": value.agencia,
                    "numero_conta": value.numero_conta

                })
            });
            try {
                await salvarContas(payload);
                await buscaContas();
                toastCustom.ToastCustomSuccess('Edição salva', 'A edição foi salva com sucesso!')
            }catch (e) {
                console.log("Erro ao salvar conta", e)
            }
            setLoading(false)
        }
    };

    const podeEditarDadosMembros = () => {
        if(visoesService.getPermissoes(['change_associacao']) && stateAssociacao && stateAssociacao.data_de_encerramento && stateAssociacao.data_de_encerramento.pode_editar_dados_associacao_encerrada){
            return true;
        }
        return false;
    }

    const apresentaToast = (successMessage, errorMessage) => {
        if (successMessage) {
            const successMessages = successMessage.split('. ');
            if (successMessages.length > 0) {
                toastCustom.ToastCustomSuccess(successMessages[0], successMessages[1]);
            }
        } else if (errorMessage) {
            const errorMessages = errorMessage.split('. ');
            if (errorMessages.length > 0) {
                toastCustom.ToastCustomError(errorMessages[0], errorMessages[1]);
            }
        }
    };
    

    const handleEncerrarTipoConta = async (conta_associacao, data_de_encerramento_na_agencia) => {
        let payload = {
            "conta_associacao": conta_associacao.uuid,
            "data_de_encerramento_na_agencia": data_de_encerramento_na_agencia
        }
        
        setErrosDataEncerramentoConta([]);
        setLoading(true);
        
        try {
            if(conta_associacao.solicitacao_encerramento !== null) {
                const idSolicitacaoJaExistente = conta_associacao.solicitacao_encerramento.uuid;

                payload.status = "PENDENTE";

                const response = await reenviarSolicitacaoEncerramentoConta(payload, idSolicitacaoJaExistente);
                if (response && response.data && response.data.msg_sucesso_ao_encerrar) {
                    apresentaToast(response.data.msg_sucesso_ao_encerrar, null);
                } else {
                    apresentaToast('Solicitação de encerramento realizada com sucesso', 'A solicitação de encerramento de conta foi enviado para a Dre e está no estado de pendente de aprovação.');
                }
            } else {
                const response = await encerrarConta(payload);
                if (response && response.data && response.data.msg_sucesso_ao_encerrar) {
                    apresentaToast(response.data.msg_sucesso_ao_encerrar, null);
                } else {
                    apresentaToast('Solicitação de encerramento realizada com sucesso', 'A solicitação de encerramento de conta foi enviado para a Dre e está no estado de pendente de aprovação.');
                }
            }
            buscaContas();
        } catch (error) {
            if (error.response.data && error.response.data.mensagem && error.response.data.mensagem[0]) {
                apresentaToast(null, error.response.data.mensagem[0]);
            } else {
                apresentaToast('Erro ao enviar a solicitação de encerramento', 'Ocorreu um erro e a solicitação de encerramento não foi enviada para a Dre.');
            }
        } finally {
            setLoading(false);
        }
    }

    const handleOpenModalConfirmEncerramentoConta = (conta, data, index) => {
        if(!data) {
            setErrosDataEncerramentoConta([...errosDataEncerramentoConta, { index: index, mensagem: "* É obrigatório preencher a data de encerramento." }]);
            return
        } else {
            setErrosDataEncerramentoConta([]);
            
            const dataFormatada = formataData(data, 'YYYY-MM-DD');

            let message = `<p>Ao confirmar essa ação, sua solicitação de encerramento de conta será encaminhada para validação da ${getNomeDREFormatado()}. Não será mais possível cadastrar crédito e despesa. Deseja continuar?</p>`
            if (conta.mostrar_alerta_valores_reprogramados_ao_solicitar) {
                message = `<p>Ao confirmar essa ação, sua solicitação de encerramento de conta será encaminhada para validação da ${getNomeDREFormatado()}. Não será mais possível cadastrar crédito, despesa ou valores reprogramados. Deseja continuar?</p>`
            }
            ModalConfirm({
                dispatch,
                title: 'Solicitar o encerramento da conta',
                message: message,
                cancelText: 'Cancelar',
                confirmText: 'Confirmar',
                dataQa: 'modal-confirmar-solicitacao-encerramento-de-conta',
                onConfirm: () => handleEncerrarTipoConta(conta, dataFormatada)
            })            
        }       
    };

    const addMotivoListItem = (ulElement, motivo) => {
        const liElement = document.createElement("li");
        liElement.textContent = motivo
        ulElement.appendChild(liElement);
    }
    const handleOpenModalMotivoRejeicaoEncerramento = (solicitacao) => {
        const ulElement = document.createElement("ul"); 
        
        const h6 = document.createElement("h6"); 
        h6.textContent = "Motivos"
        ulElement.appendChild(h6);


        for (let i = 0; i < solicitacao.motivos_rejeicao.length; i++) {
            addMotivoListItem(ulElement, solicitacao.motivos_rejeicao[i]["nome"]);
        }

        if(solicitacao.outros_motivos_rejeicao){
            addMotivoListItem(ulElement, solicitacao.outros_motivos_rejeicao);
        }

        setShowModalMotivoRejeicaoEncerramento({open: true, motivos: ulElement.innerHTML});
    }

    const handleCloseModalMotivoRejeicaoEncerramento = () => {
        return setShowModalMotivoRejeicaoEncerramento(false); 
    }

    const handleOpenModalCancelarEncerramento = (solicitacao) => {
        ModalConfirm({
            dispatch,
            title: 'Cancelar solicitação de encerramento.',
            message: "Tem certeza que deseja cancelar solicitação? Essa ação não poderá ser desfeita.",
            cancelText: 'Cancelar',
            confirmText: 'Confirmar',
            dataQa: 'modal-confirmar-cancelar-solicitacao',
            onConfirm: () => handleCancelarEncerramento(solicitacao)
        })        
    }

    const handleCancelarEncerramento = async (solicitacao) => {
        setLoading(true);
        try {
            await cancelarSolicitacaoEncerramentoConta(solicitacao.uuid);   
            toastCustom.ToastCustomSuccess('Solicitação de encerramento cancelada com sucesso.')
            buscaContas();
        } catch (error) {
            if(error.response.data && error.response.data.mensagem) {
                toastCustom.ToastCustomError('Erro ao enviar a solicitação de encerramento', error.response.data.mensagem)
            } else {
                toastCustom.ToastCustomError('Erro ao enviar a solicitação de encerramento', 'Ocorreu um erro e a solicitação de encerramento não foi enviada para a Dre.')
            }           
        } finally {
            setLoading(false);
        }
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
                    <div className="row">
                        <div className="col-12">
                            <MenuInterno
                                caminhos_menu_interno = {menuUrls}
                            />
                            <ExportaDadosDaAsssociacao/>
                            <FormDadosDasContas
                                intialValues={intialValues}
                                onSubmit={onSubmit}
                                setaCampoReadonly={setaCampoReadonly}
                                errors={errors}
                                podeEditarDadosMembros={podeEditarDadosMembros}
                                handleOpenModalConfirmEncerramentoConta={handleOpenModalConfirmEncerramentoConta}
                                handleOpenModalMotivoRejeicaoEncerramento={handleOpenModalMotivoRejeicaoEncerramento}
                                handleCancelarEncerramento={handleOpenModalCancelarEncerramento}
                                errosDataEncerramentoConta={errosDataEncerramentoConta}
                                inicioPeriodo={stateAssociacao.periodo_inicial ? stateAssociacao.periodo_inicial.data_inicio_realizacao_despesas : null}
                            />
                        </div>
                    </div>
                    <section>
                        <ModalMotivoRejeicaoEncerramento
                            show={showModalMotivoRejeicaoEncerramento.open}
                            handleClose={handleCloseModalMotivoRejeicaoEncerramento}
                            titulo="Solicitação de encerramento da conta negada"
                            bodyText={showModalMotivoRejeicaoEncerramento.motivos}
                            primeiroBotaoTexto="Fechar"
                            primeiroBotaoCss="base-verde"
                        />
                    </section>                    
                    <section className="mt-5">
                        <TabelaContasEncerradas 
                            contas={contasEncerradas}
                            rowsPerPage={10}
                        />
                    </section>
                </>
            }
        </>
    )
};