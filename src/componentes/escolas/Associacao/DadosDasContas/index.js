import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {UrlsMenuInterno, retornaMenuAtualizadoPorStatusCadastro} from "../UrlsMenuInterno";
import Loading from "../../../../utils/Loading";
import {MenuInterno} from "../../../Globais/MenuInterno";
import {getContas, salvarContas, getAssociacao, getStatusCadastroAssociacao, encerrarConta, alterarSolicitacaoEncerramentoConta, getContasEncerradas, cancelarSolicitacaoEncerramentoConta} from "../../../../services/escolas/Associacao.service";
import {FormDadosDasContas} from "./FormDadosDasContas";
import {ExportaDadosDaAsssociacao} from "../ExportaDadosAssociacao";
import { visoesService } from "../../../../services/visoes.service";
import { setStatusCadastro, resetStatusCadastro } from "../../../../store/reducers/componentes/escolas/Associacao/DadosAssociacao/StatusCadastro/actions";
import { toastCustom } from "../../../Globais/ToastCustom";
import { ModalConfirmEncerramentoConta } from "./FormDadosDasContas/ModalConfirmEncerramentoConta";
import { ModalCancelarSolicitacaoEncerramentoConta } from "./FormDadosDasContas/ModalCancelarSolicitacaoEncerramentoConta";
import { formataDataParaPadraoYYYYMMDD } from "../../../../utils/FormataData";
import { ModalMotivoRejeicaoEncerramento } from "./FormDadosDasContas/ModalMotivoRejeicaoEncerramento";
import { TabelaContasEncerradas } from "./TabelaContasEncerradas";

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

    const initialStateModalEncerramento = {
        show: false,
        conta_associacao: "",
        data_de_encerramento_na_agencia: "",
        index: ""
    }

    const [loading, setLoading] = useState(true);
    const [intialValues, setIntialValues] = useState(initial);
    const [errors, setErrors] = useState({});
    const [stateAssociacao, setStateAssociacao] = useState({})
    const [menuUrls, setMenuUrls] = useState(UrlsMenuInterno);
    const [errosDataEncerramentoConta, setErrosDataEncerramentoConta] = useState([]);
    const [contasEncerradas, setContasEncerradas] = useState([]);
    const [modalEncerramentoData, setModalEncerramentoData] = useState(initialStateModalEncerramento);
    const [showModalMotivoRejeicaoEncerramento, setShowModalMotivoRejeicaoEncerramento] = useState({open: false, motivos: ''});
    const [modalCancelarEncerramento, setShowModalCancelarEncerramento] = useState({open: false, solicitacao: null});
    const [textoModalEncerramentoConta, setTextoModalEncerramentoConta] = useState("");


    useEffect(() =>{
        buscaContas();
    }, []);

    useEffect(()=>{
        setLoading(false)
    }, []);

    const buscaContas = async ()=>{
        let contas = await getContas();
        let contasEncerradas = await getContasEncerradas();
        setContasEncerradas(contasEncerradas);
        setIntialValues(contas)
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

    const geraTextoModalEncerramentoConta = (associacao) => {
        let textoModal = "Dre"

        if(associacao && associacao.unidade) {
            let nomeDre = associacao.unidade.dre.nome;
            nomeDre = nomeDre.toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase());

            textoModal = `<p>Ao confirmar essa ação, sua solicitação de encerramento de conta será encaminhada para validação da ${nomeDre}. Deseja continuar?</p>`;
        }

        setTextoModalEncerramentoConta(textoModal)
    }

    const buscaAssociacao = async () => {
        const associacao = await getAssociacao();
        setStateAssociacao(associacao);
        geraTextoModalEncerramentoConta(associacao);
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

    const handleEncerrarTipoConta = async () => {
        let payload = {
            "conta_associacao": modalEncerramentoData.conta_associacao.uuid,
            "data_de_encerramento_na_agencia": modalEncerramentoData.data_de_encerramento_na_agencia
        }
    
        setLoading(true);
        try {
            if(modalEncerramentoData.conta_associacao.solicitacao_encerramento !== null) {
                const idSolicitacaoJaExistente = modalEncerramentoData.conta_associacao.solicitacao_encerramento.uuid;

                payload.status = "PENDENTE";

                await alterarSolicitacaoEncerramentoConta(payload, idSolicitacaoJaExistente);
                toastCustom.ToastCustomSuccess('Nova solicitação de encerramento realizada com sucesso', 'A solicitação de encerramento de conta foi enviado para a Dre e está no estado de pendente de aprovação.')
            } else {
                await encerrarConta(payload);
                toastCustom.ToastCustomSuccess('Solicitação de encerramento realizada com sucesso', 'A solicitação de encerramento de conta foi enviado para a Dre e está no estado de pendente de aprovação.')
            }

            buscaContas();
        } catch (error) {
            if(error.response.data && error.response.data.mensagem) {
                toastCustom.ToastCustomError('Erro ao enviar a solicitação de encerramento', error.response.data.mensagem)
            } else {
                toastCustom.ToastCustomError('Erro ao enviar a solicitação de encerramento', 'Ocorreu um erro e a solicitação de encerramento não foi enviada para a Dre.')
            }
        }

        const modalData = {
            "show": false,
            "conta_associacao": "",
            "data_de_encerramento_na_agencia": "",
            "index": ""
        }

        setModalEncerramentoData(modalData);

        setLoading(false);
    }

    const handleOpenModalConfirmEncerramentoConta = (conta, data, index) => {
        if(!data) {
            let erroPreenchimentoData = "* É obrigatório preencher a data de encerramento."
            return setErrosDataEncerramentoConta([...errosDataEncerramentoConta, { index: index, mensagem: erroPreenchimentoData }]);
        }

        let errosFiltrados = errosDataEncerramentoConta.filter((erro) => erro.index !== index);
        setErrosDataEncerramentoConta(errosFiltrados);

        const dataFormatada = formataDataParaPadraoYYYYMMDD(data)

        const modalData = {
            "show": true,
            "conta_associacao": conta,
            "data_de_encerramento_na_agencia": dataFormatada,
            "index": index,
        }

        return setModalEncerramentoData(modalData);
    };

    const handleCloseModalConfirmEncerramentoConta = () => {
        return setModalEncerramentoData(initialStateModalEncerramento); 
    }

    const handleOpenModalMotivoRejeicaoEncerramento = (solicitacao) => {
        const motivos = solicitacao.motivos_rejeicao.map(_motivo => _motivo.nome).join(', ');
        setShowModalMotivoRejeicaoEncerramento({open: true, motivos: motivos});
    }

    const handleCloseModalMotivoRejeicaoEncerramento = () => {
        return setShowModalMotivoRejeicaoEncerramento(false); 
    }

    const handleOpenModalCancelarEncerramento = (solicitacao) => {
        setShowModalCancelarEncerramento({open: true, solicitacao: solicitacao})
    }

    const handleCloseModalCancelarEncerramento = () => {
        return setShowModalCancelarEncerramento({open: false, solicitacao: null}); 
    }

    const handleCancelarEncerramento = async () => {
        setLoading(true);
        try {
            await cancelarSolicitacaoEncerramentoConta(modalCancelarEncerramento.solicitacao.uuid);   
            toastCustom.ToastCustomSuccess('Solicitação de encerramento cancelada com sucesso.')
            buscaContas();
        } catch (error) {
            if(error.response.data && error.response.data.mensagem) {
                toastCustom.ToastCustomError('Erro ao enviar a solicitação de encerramento', error.response.data.mensagem)
            } else {
                toastCustom.ToastCustomError('Erro ao enviar a solicitação de encerramento', 'Ocorreu um erro e a solicitação de encerramento não foi enviada para a Dre.')
            }           
        } finally {
            handleCloseModalCancelarEncerramento();
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
                        <ModalConfirmEncerramentoConta
                            show={modalEncerramentoData.show}
                            handleClose={handleCloseModalConfirmEncerramentoConta}
                            handleEncerrarTipoConta={handleEncerrarTipoConta}
                            titulo="Solicitar o encerramento da conta"
                            texto={textoModalEncerramentoConta}
                            primeiroBotaoTexto="Cancelar"
                            primeiroBotaoCss="base-verde-outline"
                            segundoBotaoCss="base-verde"
                            segundoBotaoTexto="Confirmar"
                        />
                    </section>
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
                    <section>
                        <ModalCancelarSolicitacaoEncerramentoConta
                            show={modalCancelarEncerramento.open}
                            titulo="Cancelar solicitação de encerramento."
                            texto="Tem certeza que deseja cancelar solicitação? Essa ação não poderá ser desfeita."
                            segundoBotaoTexto="Confirmar"
                            segundoBotaoOnclick={handleCancelarEncerramento}
                            segundoBotaoCss="success"
                            primeiroBotaoCss="outline-success"
                            primeiroBotaoTexto="Cancelar"
                            handleClose={handleCloseModalCancelarEncerramento}
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