import React, {useCallback, useEffect, useState} from "react";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {useLocation, useParams} from "react-router-dom";
import {FormCadastro} from "../components/FormCadastro";
import {usePostCargoDaComposicao} from "../hooks/usePostCargoDaComposicao";
import {useGetCargosDiretoriaExecutiva} from "../hooks/useGetCargosDiretoriaExecutiva";
import {usePutCargoDaComposicao} from "../hooks/usePutCargoDaComposicao";
import moment from "moment";
import {getStatusPresidenteAssociacao} from "../../../../services/escolas/Associacao.service";

import {ASSOCIACAO_UUID} from "../../../../services/auth.service";
import {usePatchStatusPresidente} from "../hooks/usePatchStatusPresidente";

export const PaginaCadastroHistoricoDeMembros = () => {

    let uuid_associacao = localStorage.getItem(ASSOCIACAO_UUID);
    let {composicaoUuid} = useParams();
    const { state } = useLocation();
    const {mutationPostCargoDaComposicao} = usePostCargoDaComposicao()
    const {mutationPutCargoDaComposicao} = usePutCargoDaComposicao()
    const {mutationPatchStatusPresidenteAssociacao} = usePatchStatusPresidente()
    const {data_cargos_diretoria_executiva } = useGetCargosDiretoriaExecutiva()
    const [cargosDaDiretoriaExecutiva, setCargosDaDiretoriaExecutiva] = useState([])
    const [responsavelPelasAtribuicoes, setResponsavelPelasAtribuicoes] = useState('');
    const [switchStatusPresidente, setSwitchStatusPresidente] = useState(false);

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

    const handleChangeSwitchStatusPresidente = () => {
        setSwitchStatusPresidente(!switchStatusPresidente)
    }
    const handleChangeResponsavelPelaAtribuicao = (value) => {
        setResponsavelPelasAtribuicoes(value)
    }

    const onSubmitForm = async (values) => {
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
            substituto: false,
            substituido: false,
            data_inicio_no_cargo: moment(values.data_inicio_no_cargo).format('YYYY-MM-DD'),
            data_fim_no_cargo: moment(values.data_fim_no_cargo).format('YYYY-MM-DD')
        }

        if (!state.cargo.uuid){
            mutationPostCargoDaComposicao.mutate({payload: payload})
        }else {
            mutationPutCargoDaComposicao.mutate({uuidCargoComposicao: state.cargo.uuid, payload: payload})
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
                        setSwitchStatusPresidente={setSwitchStatusPresidente}
                        handleChangeSwitchStatusPresidente={handleChangeSwitchStatusPresidente}
                        handleChangeResponsavelPelaAtribuicao={handleChangeResponsavelPelaAtribuicao}
                    />
                </div>
            </PaginasContainer>
        </>
    )

}