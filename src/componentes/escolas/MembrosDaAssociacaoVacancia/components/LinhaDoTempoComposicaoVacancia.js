import React, { useMemo, useState } from "react";
import moment from "moment";
import Loading from "../../../../utils/Loading";
import { Divider } from "antd";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGetTimelineConsolidadaComposicaoVacancia } from "../hooks/useGetTimelineConsolidadaComposicaoVacancia";
import { useGetDatasDeAlteracaoDaComposicaoVacancia } from "../hooks/useGetDatasDeAlteracaoDaComposicaoVacancia";
import { useCancelarEntradaCargoComposicaoVacancia } from "../hooks/useCancelarEntradaCargoComposicaoVacancia";
import { useCancelarSaidaCargoComposicaoVacancia } from "../hooks/useCancelarSaidaCargoComposicaoVacancia";
import { useRegistrarSaidaCargoComposicaoVacancia } from "../hooks/useRegistrarSaidaCargoComposicaoVacancia";
import { useNavegarParaIncluirNovoMembroVacancia } from "../hooks/useNavegarParaIncluirNovoMembroVacancia";
import { ModalInformarSaidaCargoVacancia } from "./ModalInformarSaidaCargoVacancia";
import { ModalConfirmarExclusao } from "../../../sme/Parametrizacoes/componentes/ModalConfirmarExclusao";
import { RetornaSeTemPermissaoEdicaoHistoricoDeMembros } from "../RetornaSeTemPermissaoEdicaoHistoricoDeMembros";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";
import { TrilhaDoCargoTimeline } from "./VisualizacaoTimeLine/TrilhaDoCargoTimeline";
import { diasEntre, montaTicksDeMeses, montaCargoRow } from "./VisualizacaoTimeLine/utils";
import { CargosTimeline } from "./VisualizacaoTimeLine/CargosTimeline";
import { TicksMeses } from "./VisualizacaoTimeLine/TicksMeses";
import { BarraSelecionaData } from "./VisualizacaoTimeLine/BarraSelecionadata";
import { IndicadorLegenda } from "./VisualizacaoTimeLine/IndicadorLegenda";
import { CargosTimelineModoListagem } from "./VisualizacaoTimeLine/CargosTimelineModoListagem";

// Linha do tempo visual de todos os cargos da composição, lado a lado, com navegação
// livre por qualquer data do mandato (data exata ou marco anterior/seguinte).
export const LinhaDoTempoComposicaoVacancia = ({ composicaoUuid, mandato, dataSelecionada, onSelecionarData }) => {
    const dataTemplate = useDataTemplate();
    const navigate = useNavigate();
    const temPermissaoEdicao = RetornaSeTemPermissaoEdicaoHistoricoDeMembros();

    const { data: timelineConsolidada, isLoading: isLoadingTimelineConsolidada } =
        useGetTimelineConsolidadaComposicaoVacancia(composicaoUuid);
    const { data: marcos } = useGetDatasDeAlteracaoDaComposicaoVacancia(composicaoUuid);

    const { mutationCancelarEntradaCargoComposicaoVacancia } = useCancelarEntradaCargoComposicaoVacancia();
    const { mutationCancelarSaidaCargoComposicaoVacancia } = useCancelarSaidaCargoComposicaoVacancia();
    const { mutationRegistrarSaidaCargoComposicaoVacancia } = useRegistrarSaidaCargoComposicaoVacancia();
    const { navegarParaIncluirNovoMembro } = useNavegarParaIncluirNovoMembroVacancia(composicaoUuid);

    const [registroSelecionado, setRegistroSelecionado] = useState(null);
    const [mostrarModalInformarSaida, setMostrarModalInformarSaida] = useState(false);
    const [mostrarModalConfirmarCancelarEntrada, setMostrarModalConfirmarCancelarEntrada] = useState(false);
    const [mostrarModalConfirmarCancelarSaida, setMostrarModalConfirmarCancelarSaida] = useState(false);

    // Grupo de Cargos de Diretoria Executiva
    const cargoRowsDiretoriaExecutiva = useMemo(
        () => (timelineConsolidada?.diretoria_executiva || []).map(cargo => montaCargoRow(cargo, dataSelecionada)),
        [timelineConsolidada, dataSelecionada]
    );

    // Grupo de Cargos de Conselho Fiscal
    const cargoRowsConselhoFiscal = useMemo(
        () => (timelineConsolidada?.conselho_fiscal || []).map(cargo => montaCargoRow(cargo, dataSelecionada)),
        [timelineConsolidada, dataSelecionada]
    );

    // Fusão de ambos os grupos
    const timelinesPorCargo = useMemo(() => {
        const todosOsCargos = [
            ...(timelineConsolidada?.diretoria_executiva || []),
            ...(timelineConsolidada?.conselho_fiscal || []),
        ];
        return Object.fromEntries(todosOsCargos.map((cargo) => [cargo.cargo_associacao, cargo.timeline]));
    }, [timelineConsolidada]);

    if (!mandato?.data_inicial || !mandato?.data_final) {
        return null;
    }

    const totalDias = diasEntre(mandato.data_inicial, mandato.data_final) || 1;

    const hojeDentroDoMandato = moment().isBetween(mandato.data_inicial, mandato.data_final, "day", "[]");

    // Cursor: Barra vertical que é exibida sobreposta à timeline para indicar a data selecionada
    const cursorFracao = Math.min(1, Math.max(0, diasEntre(mandato.data_inicial, dataSelecionada) / totalDias));

    const mesTicks = montaTicksDeMeses(mandato.data_inicial, mandato.data_final, totalDias);
    
    const podeInformarSaida = registroSelecionado?.eh_composicao_vigente && registroSelecionado?.ocupante_vigente;
    const podeCancelarEntrada = registroSelecionado?.pode_cancelar_entrada;
    const podeCancelarSaida = registroSelecionado?.pode_cancelar_saida;
    const podeEditar =
        registroSelecionado?.eh_composicao_vigente &&
        (registroSelecionado?.cargo_vigente || registroSelecionado?.eh_ultimo_ocupante);
    const semAcoes = registroSelecionado && !podeEditar && !podeInformarSaida && !podeCancelarEntrada && !podeCancelarSaida;

    const onClickEditarDados = () => {
        navigate(`/cadastro-historico-de-membros-vacancia/${composicaoUuid}`, {
            state: { cargo: registroSelecionado, marcoSelecionado: dataSelecionada },
        });
    };

    const onClickIncluirNovoMembro = () => {
        navegarParaIncluirNovoMembro(registroSelecionado.cargo_associacao, { marcoSelecionado: dataSelecionada }).then(
            (sucesso) => {
                if (sucesso) setRegistroSelecionado(null);
            }
        );
    };

    const onClickCancelarEntrada = () => setMostrarModalConfirmarCancelarEntrada(true);

    const onClickCancelarSaida = () => setMostrarModalConfirmarCancelarSaida(true);

    const onConfirmarCancelarEntrada = () => {
        mutationCancelarEntradaCargoComposicaoVacancia.mutate(
            { uuid: registroSelecionado.uuid },
            {
                onSuccess: () => {
                    setMostrarModalConfirmarCancelarEntrada(false);
                    setRegistroSelecionado(null);
                },
            }
        );
    };

    const onConfirmarCancelarSaida = () => {
        mutationCancelarSaidaCargoComposicaoVacancia.mutate(
            { uuid: registroSelecionado.uuid },
            {
                onSuccess: () => {
                    setMostrarModalConfirmarCancelarSaida(false);
                    setRegistroSelecionado(null);
                },
            }
        );
    };

    const onConfirmarInformarSaida = (dataSaida) => {
        mutationRegistrarSaidaCargoComposicaoVacancia.mutate(
            { uuid: registroSelecionado.uuid, data_saida: moment(dataSaida).format("YYYY-MM-DD") },
            {
                onSuccess: () => {
                    setMostrarModalInformarSaida(false);
                    setRegistroSelecionado(null);
                },
            }
        );
    };

    if (isLoadingTimelineConsolidada) {
        return (
            <Loading corGrafico="black" corFonte="dark" marginTop="0" marginBottom="0" />
        );
    }

    return (
        <div className="LinhaDoTempoComposicaoVacancia" data-qa="linha-do-tempo-composicao-vacancia">
            <Divider className="my-4" />

            <BarraSelecionaData
                marcos={marcos}
                mandato={mandato}
                onSelecionarData={onSelecionarData}
                dataSelecionada={dataSelecionada} />
            

            <IndicadorLegenda />

            <div className="area-timeline-vacancia">
               <div className="timeline-corpo">
                    <div className="timeline-rotulos">
                        <div className="timeline-rotulo-cabecalho"></div>
                        <CargosTimeline cargos={cargoRowsDiretoriaExecutiva} secao="Diretoria executiva" />
                        <CargosTimeline cargos={cargoRowsConselhoFiscal} secao="Conselho Fiscal" />
                    </div>

                    <div className="timeline-trilhas">

                        <TicksMeses ticks={mesTicks} />
                        
                        <div className="timeline-trilha-secao" />
                        {cargoRowsDiretoriaExecutiva.map((cargoRow) => (
                            <TrilhaDoCargoTimeline
                                key={cargoRow.cargo_associacao}
                                cargoRow={cargoRow}
                                registrosDoCargo={timelinesPorCargo[cargoRow.cargo_associacao]}
                                mandato={mandato}
                                hojeDentroDoMandato={hojeDentroDoMandato}
                                totalDias={totalDias}
                                dataTemplate={dataTemplate}
                                registroSelecionado={registroSelecionado}
                                onSelecionarRegistro={setRegistroSelecionado}
                            />
                        ))}

                        <div className="timeline-trilha-secao" />
                        {cargoRowsConselhoFiscal.map((cargoRow) => (
                            <TrilhaDoCargoTimeline
                                key={cargoRow.cargo_associacao}
                                cargoRow={cargoRow}
                                registrosDoCargo={timelinesPorCargo[cargoRow.cargo_associacao]}
                                mandato={mandato}
                                hojeDentroDoMandato={hojeDentroDoMandato}
                                totalDias={totalDias}
                                dataTemplate={dataTemplate}
                                registroSelecionado={registroSelecionado}
                                onSelecionarRegistro={setRegistroSelecionado}
                            />
                        ))}

                        <div
                            className="cursor-timeline"
                            data-qa="cursor-timeline"
                            style={{ left: `${(cursorFracao * 100).toFixed(4)}%` }}
                        />
                    </div>
                </div>
            </div>

            <BarraSelecionaData
                marcos={marcos}
                mandato={mandato}
                onSelecionarData={onSelecionarData}
                dataSelecionada={dataSelecionada} />

            {dataSelecionada !== "Invalid date" && (
                <div className="d-flex flex-wrap mt-3 paineis-timeline">
                    <div className="card-timeline mb-3" data-qa="composicao-na-data-timeline">
                        <h2 className="titulo-painel-timeline mb-4">Lista dos membros em {dataTemplate("", "", dataSelecionada)}</h2>

                        <CargosTimelineModoListagem
                            cargos={cargoRowsDiretoriaExecutiva} secao="Diretoria executiva" />

                        <CargosTimelineModoListagem
                            cargos={cargoRowsConselhoFiscal} secao="Conselho Fiscal" />

                    </div>
                </div>
            )}

            <Modal
                show={!!registroSelecionado}
                onHide={() => setRegistroSelecionado(null)}
                data-qa="painel-acao-timeline"
                >
                <Modal.Header>
                    <Modal.Title>
                        {registroSelecionado ? registroSelecionado.cargoLabel : "Painel do cargo"}
                    </Modal.Title>
                </Modal.Header>
                {registroSelecionado && (
                    <>
                        <Modal.Body>
                            <p className="nome-painel mb-1">
                                {registroSelecionado.cargo_vago ? "Cargo vago" : registroSelecionado.ocupante_do_cargo?.nome}
                            </p>
                            <p className="periodo-painel text-muted mb-2">
                                {`${dataTemplate("", "", registroSelecionado.data_inicio_no_cargo)} até ${dataTemplate(
                                    "",
                                    "",
                                    registroSelecionado.data_fim_no_cargo
                                )}`}
                            </p>
                            <div className="mb-2">
                                {registroSelecionado.tag_novo_membro && (
                                    <span className="badge badge-novo-membro mr-1">{registroSelecionado.tag_novo_membro}</span>
                                )}
                                {registroSelecionado.tag_vacancia && (
                                    <span className="badge badge-vacancia">{registroSelecionado.tag_vacancia}</span>
                                )}
                            </div>
                            {semAcoes && (
                                <p className="text-muted font-italic mb-0">
                                    {!registroSelecionado.eh_composicao_vigente
                                        ? "Mandato anterior — sem ações disponíveis."
                                        : registroSelecionado.cargo_vago
                                        ? "Período em que o cargo esteve vago"
                                        : "Ocupação encerrada."}
                                </p>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                type="button"
                                className="btn btn-outline-success"
                                onClick={() => setRegistroSelecionado(null)}
                            >
                                Fechar
                            </button>
                            {podeEditar && (
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    disabled={!temPermissaoEdicao}
                                    onClick={registroSelecionado.cargo_vago_vigente ? onClickIncluirNovoMembro : onClickEditarDados}
                                >
                                    {registroSelecionado.cargo_vago_vigente ? "Incluir novo membro" : "Editar"}
                                </button>
                            )}
                            {podeInformarSaida && (
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    disabled={!temPermissaoEdicao}
                                    onClick={() => setMostrarModalInformarSaida(true)}
                                >
                                    Informar saída
                                </button>
                            )}
                            {podeCancelarEntrada && (
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    disabled={!temPermissaoEdicao}
                                    onClick={onClickCancelarEntrada}
                                >
                                    Cancelar Entrada
                                </button>
                            )}
                            {podeCancelarSaida && (
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    disabled={!temPermissaoEdicao}
                                    onClick={onClickCancelarSaida}
                                >
                                    Cancelar Saída
                                </button>
                            )}
                        </Modal.Footer>
                    </>
                )}
            </Modal>

            <ModalInformarSaidaCargoVacancia
                show={mostrarModalInformarSaida}
                dataInicioNoCargo={registroSelecionado?.data_inicio_no_cargo}
                dataFinalMandato={mandato?.data_final}
                handleClose={() => setMostrarModalInformarSaida(false)}
                handleConfirm={onConfirmarInformarSaida}
            />

            <ModalConfirmarExclusao
                open={mostrarModalConfirmarCancelarEntrada}
                onOk={onConfirmarCancelarEntrada}
                okText="Confirmar"
                onCancel={() => setMostrarModalConfirmarCancelarEntrada(false)}
                cancelText="Voltar"
                titulo="Cancelar entrada no cargo"
                bodyText={<p>Tem certeza que deseja cancelar a entrada deste registro?</p>}
            />

            <ModalConfirmarExclusao
                open={mostrarModalConfirmarCancelarSaida}
                onOk={onConfirmarCancelarSaida}
                okText="Confirmar"
                onCancel={() => setMostrarModalConfirmarCancelarSaida(false)}
                cancelText="Voltar"
                titulo="Cancelar saída do cargo"
                bodyText={<p>Tem certeza que deseja cancelar a saída deste registro?</p>}
            />
        </div>
    );
};
