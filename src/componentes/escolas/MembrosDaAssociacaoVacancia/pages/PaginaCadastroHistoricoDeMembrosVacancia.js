import React, {useState} from "react";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {useLocation, useParams, useNavigate} from "react-router-dom";
import moment from "moment";
import {FormCadastroVacancia} from "../components/FormCadastroVacancia";
import {ModalInformarSaidaCargoVacancia} from "../components/ModalInformarSaidaCargoVacancia";
import {usePostCargoComposicaoVacancia} from "../hooks/usePostCargoComposicaoVacancia";
import {useEditarOcupanteCargoComposicaoVacancia} from "../hooks/useEditarOcupanteCargoComposicaoVacancia";
import {useRegistrarSaidaCargoComposicaoVacancia} from "../hooks/useRegistrarSaidaCargoComposicaoVacancia";
import {useCancelarSaidaCargoComposicaoVacancia} from "../hooks/useCancelarSaidaCargoComposicaoVacancia";
import {useCancelarEntradaCargoComposicaoVacancia} from "../hooks/useCancelarEntradaCargoComposicaoVacancia";
import {useGetMandatoVigente} from "../hooks/useGetMandatoVigente";


export const PaginaCadastroHistoricoDeMembrosVacancia = () => {
    const {composicaoUuid} = useParams();
    const {state} = useLocation();

    const navigate = useNavigate();
    const cargo = state?.cargo || {};
    const marcoSelecionado = state?.marcoSelecionado;
    // preserva o marco de origem - só faz sentido quando a timeline do cargo não muda
    const voltarParaListagem = () => navigate(`/membros-da-associacao`, {state: {marcoSelecionado}});

    // cancelar entrada/saída e informar saída alteram a timeline do cargo - sempre volta
    // para o padrão (marco mais recente)
    const voltarParaListagemPadrao = () => navigate(`/membros-da-associacao`);

    const ehCargoOcupado = cargo?.cargo_vago === false;
    
    // considera como edição apenas cargos ocupados
    const ehEdicao = ehCargoOcupado;
    const ocupanteVigente = cargo?.ocupante_vigente === true;
    // só pode cancelar um ocupante que já saiu (não vigente) e ainda não tem sucessor
    const podeCancelarSaida = ehCargoOcupado && !ocupanteVigente && cargo?.substituido === false;
    const podeCancelarEntrada = ehCargoOcupado && ocupanteVigente;

    const {data: mandato} = useGetMandatoVigente();
    const {mutationPostCargoComposicaoVacancia} = usePostCargoComposicaoVacancia();
    const {mutationEditarOcupanteCargoComposicaoVacancia} = useEditarOcupanteCargoComposicaoVacancia();
    const {mutationRegistrarSaidaCargoComposicaoVacancia} = useRegistrarSaidaCargoComposicaoVacancia();
    const {mutationCancelarSaidaCargoComposicaoVacancia} = useCancelarSaidaCargoComposicaoVacancia();
    const {mutationCancelarEntradaCargoComposicaoVacancia} = useCancelarEntradaCargoComposicaoVacancia();

    const [showModalInformarSaida, setShowModalInformarSaida] = useState(false);

    const formatPayloadOcupante = (values) => ({
        nome: values.nome,
        codigo_identificacao: values.codigo_identificacao,
        cargo_educacao: values.cargo_educacao,
        representacao: values.representacao,
        email: values.email,
        cpf_responsavel: values.cpf_responsavel,
        telefone: values.telefone,
        cep: values.cep,
        bairro: values.bairro,
        endereco: values.endereco,
    });

    const onSubmitForm = (values) => {
        if (!ehEdicao) {
            const payload = {
                composicao: composicaoUuid,
                cargo_associacao: values.cargo_associacao,
                data_inicio_no_cargo: moment(values.data_inicio_no_cargo).format('YYYY-MM-DD'),
                ocupante_do_cargo: formatPayloadOcupante(values),
            };
            mutationPostCargoComposicaoVacancia.mutate(
                {payload},
                { onSuccess: voltarParaListagemPadrao }
            );
        } else {
            const payload = {ocupante_do_cargo: formatPayloadOcupante(values)};
            mutationEditarOcupanteCargoComposicaoVacancia.mutate(
                { uuid: cargo.uuid, payload },
                { onSuccess: voltarParaListagem }
            );
        }
    };

    const onInformarSaida = () => setShowModalInformarSaida(true);

    const onCancelarSaida = () => {
        mutationCancelarSaidaCargoComposicaoVacancia.mutate(
            {uuid: cargo.uuid},
            { onSuccess: voltarParaListagemPadrao }
        );
    };

    const onCancelarEntrada = () => {
        mutationCancelarEntradaCargoComposicaoVacancia.mutate(
            {uuid: cargo.uuid},
            { onSuccess: voltarParaListagemPadrao }
        );
    };

    const onConfirmarInformarSaida = (dataSaida) => {
        mutationRegistrarSaidaCargoComposicaoVacancia.mutate(
            {uuid: cargo.uuid, data_saida: moment(dataSaida).format('YYYY-MM-DD')},
            {onSuccess: () => {
                setShowModalInformarSaida(false);
                voltarParaListagemPadrao();
            }}
        );
    };

    return (
        <PaginasContainer>
            <span className="PaginaCadastroHistoricoDeMembrosVacancia">
                <h1 className="titulo-itens-painel mt-5">Membros</h1>
                <div className="page-content-inner">
                    <FormCadastroVacancia
                        cargo={cargo}
                        mandato={mandato}
                        onSubmitForm={onSubmitForm}
                        onInformarSaida={onInformarSaida}
                        ehEdicao={ehEdicao}
                        ocupanteVigente={ocupanteVigente}
                        podeCancelarSaida={podeCancelarSaida}
                        onCancelarSaida={onCancelarSaida}
                        podeCancelarEntrada={podeCancelarEntrada}
                        onCancelarEntrada={onCancelarEntrada}
                        marcoSelecionado={marcoSelecionado}
                    />
                </div>

                <ModalInformarSaidaCargoVacancia
                    show={showModalInformarSaida}
                    dataInicioNoCargo={cargo.data_inicio_no_cargo}
                    dataFinalMandato={mandato?.data_final}
                    handleClose={() => setShowModalInformarSaida(false)}
                    handleConfirm={onConfirmarInformarSaida}
                />
            </span>
        </PaginasContainer>
    )
}