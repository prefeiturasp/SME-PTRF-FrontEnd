import React, {useCallback, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {useLocation, useParams} from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import {FormCadastro} from "../components/FormCadastro";
import {usePostCargoDaComposicao} from "../hooks/usePostCargoDaComposicao";
import {useGetCargosDiretoriaExecutiva} from "../hooks/useGetCargosDiretoriaExecutiva";
import {usePutCargoDaComposicao} from "../hooks/usePutCargoDaComposicao";
import moment from "moment";
import {getStatusPresidenteAssociacao} from "../../../../services/escolas/Associacao.service";

import {ASSOCIACAO_UUID} from "../../../../services/auth.service";
import {usePatchStatusPresidente} from "../hooks/usePatchStatusPresidente";
import { ModalConfirm } from "../../../Globais/Modal/ModalConfirm";
import { ModalInformarSaidaDoCargo } from "../components/ModalInformarSaidaDoCargo";
const CargoComposicaoModel = {
    "ocupante_do_cargo": {
        "nome": null,
        "codigo_identificacao": null,
        "cargo_educacao": null,
        "representacao": "",
        "representacao_label": "",
        "email": null,
        "cpf_responsavel": null,
        "telefone": null,
        "cep": null,
        "bairro": null,
        "endereco": null
    },
    "cargo_associacao": null,
    "cargo_associacao_label": null,
    "data_inicio_no_cargo": null,
    "data_fim_no_cargo": null,
    "eh_composicao_vigente": true,
    "substituto": null,
    "substituido": null,
    "ocupante_editavel": true,
    "data_final_editavel": false
}
export const PaginaCadastroHistoricoDeMembros = () => {
    const dispatch = useDispatch();
    let uuid_associacao = localStorage.getItem(ASSOCIACAO_UUID);
    let {composicaoUuid} = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const {mutationPostCargoDaComposicao} = usePostCargoDaComposicao()
    const {mutationPutCargoDaComposicao} = usePutCargoDaComposicao()
    const {mutationPatchStatusPresidenteAssociacao} = usePatchStatusPresidente()
    const {data_cargos_diretoria_executiva } = useGetCargosDiretoriaExecutiva()
    const [cargosDaDiretoriaExecutiva, setCargosDaDiretoriaExecutiva] = useState([])
    const [responsavelPelasAtribuicoes, setResponsavelPelasAtribuicoes] = useState('');
    const [switchStatusPresidente, setSwitchStatusPresidente] = useState(false);
    const [showModalInformarSaida, setShowModalInformarSaida] = useState({show: false});

    const carregaStatusPresidenteAssociacao = useCallback(async () => {
        let mounted = true;
        let status = await getStatusPresidenteAssociacao()

        if (mounted){
            setSwitchStatusPresidente(!!(status && status.status_presidente === 'PRESENTE'))
            setResponsavelPelasAtribuicoes(status.cargo_substituto_presidente_ausente ? status.cargo_substituto_presidente_ausente : "")
        }
        return () =>{
            mounted = false;
        }
    }, [])

    useEffect(() => {
        carregaStatusPresidenteAssociacao().then()
    }, [carregaStatusPresidenteAssociacao])

    const carregaCargosDaDiretoriaExecutiva = useCallback(async () => {
        let mounted = true;
        if (mounted){
            setCargosDaDiretoriaExecutiva(data_cargos_diretoria_executiva)
        }
        return () =>{
            mounted = false;
        }
    }, [data_cargos_diretoria_executiva])

    useEffect(() => {
        carregaCargosDaDiretoriaExecutiva().then()
    }, [carregaCargosDaDiretoriaExecutiva])

    const perguntarIncluirNovoMembro = async (composicao_posterior) => {
        ModalConfirm({
            dispatch,
            title: 'Importante',
            message: 'Deseja incluir um novo membro para o cargo?',
            cancelText: 'Não incluir',
            confirmText: 'Incluir novo membro',
            dataQa: 'modal-sugerir-incluir-novo-membro',
            onConfirm: async () => {

                let cargoVazio = {...CargoComposicaoModel};  
                cargoVazio.cargo_associacao = state.cargo.cargo_associacao;
                cargoVazio.cargo_associacao_label = state.cargo.cargo_associacao_label;

                navigate(`/cadastro-historico-de-membros/${composicao_posterior}`, {
                    state: {cargo: cargoVazio}
                });                       
            }, 
            onCancel: async () => {
                navigate("/membros-da-associacao");
            }               
        })
    };

    // const perguntarIncluirNovoMembro = async (payload, cargoVazio, composicaoAtual) => {
    //     ModalConfirm({
    //         dispatch,
    //         title: 'aten',
    //         message: 'Deseja incluir um novo membro para o cargo?',
    //         children: <DataSaidaForm composicaoAtual={composicaoAtual} callbackDataSaida={setDataSaidaCargo}/>,
    //         cancelText: 'Cancelar',
    //         confirmText: 'Confirmar',
    //         dataQa: 'modal-sugerir-incluir-novo-membro',
    //         confirmDisabled: dataSaidaCargo ===  null,
    //         onConfirm: async () => {
    //             const mutationResp = await mutationPutCargoDaComposicao.mutateAsync({uuidCargoComposicao: state.cargo.uuid, payload: payload});
    //             if (mutationResp.data.composicao_posterior) {
    //                 navigate(`/cadastro-historico-de-membros/${mutationResp.data.composicao_posterior}`, {
    //                     state: {cargo: cargoVazio}
    //                 });
    //             }  else {
    //                 navigate("/membros-da-associacao");
    //             }    
    //         }
    //         // onCancel: async () => {
    //         //     await mutationPutCargoDaComposicao.mutateAsync({uuidCargoComposicao: state.cargo.uuid, payload: payload});
    //         //     navigate("/membros-da-associacao");
    //         // }               
    //     })
    // };

    const formatPayload = (values) => {
        let payload = {
            composicao: composicaoUuid,
            ocupante_do_cargo: {
                nome: values.nome,
                codigo_identificacao: values.codigo_identificacao,
                cargo_educacao: values.cargo_educacao,
                representacao: values.representacao,
                email: values.email,
                cpf_responsavel: values.cpf_responsavel,
                telefone: values.telefone,
                cep: values.cep,
                bairro: values.bairro,
                endereco: values.endereco
            },
            cargo_associacao: values.cargo_associacao,
            substituto: values.substituto,
            substituido: values.substituido,
            data_inicio_no_cargo: moment(values.data_inicio_no_cargo).format('YYYY-MM-DD'),
            data_fim_no_cargo: moment(values.data_fim_no_cargo).format('YYYY-MM-DD')
        }
        return payload
    }

    const onSubmitForm = async (values) => {
        let payload = formatPayload(values);

        if (!state.cargo.uuid){
            mutationPostCargoDaComposicao.mutate({payload: payload})
        }else {
            await mutationPutCargoDaComposicao.mutateAsync({uuidCargoComposicao: state.cargo.uuid, payload: payload});
            navigate("/membros-da-associacao");            
        }

        let payloadStatusPresidente;

        if (values.switch_status_presidente){
            payloadStatusPresidente = {
                status_presidente: "PRESENTE",
                cargo_substituto_presidente_ausente: null
            }
        }else {
            payloadStatusPresidente = {
                status_presidente: "AUSENTE",
                cargo_substituto_presidente_ausente: values.responsavel_pelas_atribuicoes
            }
        }
        mutationPatchStatusPresidenteAssociacao.mutate({uuidAssociacao: uuid_associacao, payload: payloadStatusPresidente})
    }

    function onInformarSaida(values, composicaoAtual){
        setShowModalInformarSaida({show: true, values:values, composicaoAtual: composicaoAtual, })
    }

    async function onConfirmarInformarSaida(dataSaida){
        let payload = formatPayload(showModalInformarSaida.values);
        payload.data_saida_do_cargo = moment(dataSaida).format('YYYY-MM-DD');

        const mutationResp = await mutationPutCargoDaComposicao.mutateAsync({uuidCargoComposicao: state.cargo.uuid, payload: payload});        
        closeInformSaida();
        if (mutationResp.data.composicao_posterior) {
            perguntarIncluirNovoMembro(mutationResp.data.composicao_posterior)        
        }  else {
            navigate("/membros-da-associacao");
        } 
    }

    function closeInformSaida () {
        setShowModalInformarSaida({show: false});
    }

    return(
        <>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Membros</h1>
                <div className="page-content-inner">
                    <FormCadastro
                        cargo={state.cargo ? state && state.cargo : ''}
                        onSubmitForm={onSubmitForm}
                        composicaoUuid={composicaoUuid}
                        cargosDaDiretoriaExecutiva={cargosDaDiretoriaExecutiva}
                        setCargosDaDiretoriaExecutiva={setCargosDaDiretoriaExecutiva}
                        responsavelPelasAtribuicoes={responsavelPelasAtribuicoes}
                        switchStatusPresidente={switchStatusPresidente}
                        onInformarSaida={onInformarSaida}
                    />
                </div>

                <ModalInformarSaidaDoCargo 
                    show={showModalInformarSaida.show} 
                    composicaoAtual={showModalInformarSaida.composicaoAtual}
                    handleClose={closeInformSaida} 
                    handleConfirm={onConfirmarInformarSaida}
                />
            </PaginasContainer>
        </>
    )

}