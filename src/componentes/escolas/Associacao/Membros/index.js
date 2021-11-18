import React, {useEffect, useState, useCallback} from "react";
import {MenuInterno} from "../../../Globais/MenuInterno";
import {TabelaMembros} from "../TabelaMembros";
import {getMembrosAssociacao, deleteMembroAssociacao, getStatusPresidenteAssociacao} from "../../../../services/escolas/Associacao.service";
import Loading from "../../../../utils/Loading";
import {UrlsMenuInterno} from "../UrlsMenuInterno";
import {ExportaDadosDaAsssociacao} from "../ExportaDadosAssociacao";
import {visoesService} from "../../../../services/visoes.service";
import {ConfirmaDeleteMembro} from "./ConfirmaDeleteMembroDialog";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";

export const MembrosDaAssociacao = () => {

    const initDiretoria = [
        {
            id: "PRESIDENTE_DIRETORIA_EXECUTIVA",
            cargo: "Presidente",
            cargo_exibe_form: "Presidente da Diretoria Executiva"
        },
        {
            id: "VICE_PRESIDENTE_DIRETORIA_EXECUTIVA",
            cargo: "Vice Presidente",
            cargo_exibe_form: "Vice Presidente da Diretoria Executiva"
        },
        {id: "SECRETARIO", cargo: "Secretário", cargo_exibe_form: "Secretário da Diretoria Executiva"},
        {id: "TESOUREIRO", cargo: "Tesoureiro", cargo_exibe_form: "Tesoureiro da Diretoria Executiva"},
        {id: "VOGAL_1", cargo: "Vogal", cargo_exibe_form: "Vogal da Diretoria Executiva"},
        {id: "VOGAL_2", cargo: "Vogal", cargo_exibe_form: "Vogal da Diretoria Executiva"},
        {id: "VOGAL_3", cargo: "Vogal", cargo_exibe_form: "Vogal da Diretoria Executiva"},
        {id: "VOGAL_4", cargo: "Vogal", cargo_exibe_form: "Vogal da Diretoria Executiva"},
        {id: "VOGAL_5", cargo: "Vogal", cargo_exibe_form: "Vogal da Diretoria Executiva"},
    ];

    const initConselho = [
        {id: "PRESIDENTE_CONSELHO_FISCAL", cargo: "Presidente", cargo_exibe_form: "Presidente do Conselho Fiscal"},
        {id: "CONSELHEIRO_1", cargo: "Conselheiro", cargo_exibe_form: "Conselheiro do Conselho Fiscal"},
        {id: "CONSELHEIRO_2", cargo: "Conselheiro", cargo_exibe_form: "Conselheiro do Conselho Fiscal"},
        {id: "CONSELHEIRO_3", cargo: "Conselheiro", cargo_exibe_form: "Conselheiro do Conselho Fiscal"},
        {id: "CONSELHEIRO_4", cargo: "Conselheiro", cargo_exibe_form: "Conselheiro do Conselho Fiscal"},
    ];

    const initStatusPresidenteAssociacao = {
        cargo_substituto_presidente_ausente: null,
        status_presidente: null
    }

    const [clickIconeToogle, setClickIconeToogle] = useState({});
    const [membros, setMembros] = useState({});
    const [initialValuesMembrosDiretoria, setInitialValuesMembrosDiretoria] = useState(initDiretoria);
    const [initialValuesMembrosConselho, setInitialValuesMembrosConselho] = useState(initConselho);
    const [infosMembroSelecionado, setInfosMembroSelecionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [statusPresidenteAssociacao, setStatusPresidenteAssociacao] = useState(initStatusPresidenteAssociacao)


    const carregaStatusPresidenteAssociacao = useCallback(async () => {
        let status = await getStatusPresidenteAssociacao()
        setStatusPresidenteAssociacao(status)
    }, [])

    useEffect(() => {
        carregaStatusPresidenteAssociacao()
    }, [carregaStatusPresidenteAssociacao])

    useEffect(() => {
        carregaMembros();
    }, []);

    useEffect(() => {
        mesclaMembros();
    }, [membros]);

    useEffect(() => {
        setLoading(false)
    }, []);

    const carregaMembros = async () => {
        let membros = await getMembrosAssociacao();
        setMembros(membros)
    };

    const buscaDadosMembros = (id_cargo) => {
        return membros.find(element => element.cargo_associacao === id_cargo);
    };

    const mesclaMembros = async () => {
        let cargos_e_infos_diretoria = [];
        let cargos_e_infos_conselho = [];
        if (membros && membros.length > 0) {
            cargos_e_infos_diretoria = [
                {
                    id: "PRESIDENTE_DIRETORIA_EXECUTIVA",
                    cargo: "Presidente",
                    cargo_exibe_form: "Presidente da Diretoria Executiva",
                    infos: buscaDadosMembros('PRESIDENTE_DIRETORIA_EXECUTIVA'),
                },
                {
                    id: "VICE_PRESIDENTE_DIRETORIA_EXECUTIVA",
                    cargo: "Vice Presidente",
                    cargo_exibe_form: "Vice Presidente da Diretoria Executiva",
                    infos: buscaDadosMembros('VICE_PRESIDENTE_DIRETORIA_EXECUTIVA')
                },
                {
                    id: "SECRETARIO",
                    cargo: "Secretário",
                    cargo_exibe_form: "Secretário da Diretoria Executiva",
                    infos: buscaDadosMembros('SECRETARIO')
                },
                {
                    id: "TESOUREIRO",
                    cargo: "Tesoureiro",
                    cargo_exibe_form: "Tesoureiro da Diretoria Executiva",
                    infos: buscaDadosMembros('TESOUREIRO')
                },
                {
                    id: "VOGAL_1",
                    cargo: "Vogal",
                    cargo_exibe_form: "Vogal da Diretoria Executiva",
                    infos: buscaDadosMembros('VOGAL_1')
                },
                {
                    id: "VOGAL_2",
                    cargo: "Vogal",
                    cargo_exibe_form: "Vogal da Diretoria Executiva",
                    infos: buscaDadosMembros('VOGAL_2')
                },
                {
                    id: "VOGAL_3",
                    cargo: "Vogal",
                    cargo_exibe_form: "Vogal da Diretoria Executiva",
                    infos: buscaDadosMembros('VOGAL_3')
                },
                {
                    id: "VOGAL_4",
                    cargo: "Vogal",
                    cargo_exibe_form: "Vogal da Diretoria Executiva",
                    infos: buscaDadosMembros('VOGAL_4')
                },
                {
                    id: "VOGAL_5",
                    cargo: "Vogal",
                    cargo_exibe_form: "Vogal da Diretoria Executiva",
                    infos: buscaDadosMembros('VOGAL_5')
                },
            ];

            cargos_e_infos_conselho = [
                {
                    id: "PRESIDENTE_CONSELHO_FISCAL",
                    cargo: "Presidente",
                    cargo_exibe_form: "Presidente do Conselho Fiscal",
                    infos: buscaDadosMembros('PRESIDENTE_CONSELHO_FISCAL')
                },
                {
                    id: "CONSELHEIRO_1",
                    cargo: "Conselheiro",
                    cargo_exibe_form: "Conselheiro do Conselho Fiscal",
                    infos: buscaDadosMembros('CONSELHEIRO_1')
                },
                {
                    id: "CONSELHEIRO_2",
                    cargo: "Conselheiro",
                    cargo_exibe_form: "Conselheiro do Conselho Fiscal",
                    infos: buscaDadosMembros('CONSELHEIRO_2')
                },
                {
                    id: "CONSELHEIRO_3",
                    cargo: "Conselheiro",
                    cargo_exibe_form: "Conselheiro do Conselho Fiscal",
                    infos: buscaDadosMembros('CONSELHEIRO_3')
                },
                {
                    id: "CONSELHEIRO_4",
                    cargo: "Conselheiro",
                    cargo_exibe_form: "Conselheiro do Conselho Fiscal",
                    infos: buscaDadosMembros('CONSELHEIRO_4')
                },
            ];
            setInitialValuesMembrosDiretoria(cargos_e_infos_diretoria);
            setInitialValuesMembrosConselho(cargos_e_infos_conselho);
        } else {
            setInitialValuesMembrosDiretoria(initDiretoria);
            setInitialValuesMembrosConselho(initConselho);
        }
    };

    const converteNomeRepresentacao = (id_representacao) => {
        switch (id_representacao) {
            case 'SERVIDOR':
                return "Servidor";
            case 'ESTUDANTE':
                return "Estudante";
            case 'PAI_RESPONSAVEL':
                return "Pai ou responsável";
            default:
                return ""
        }
    };

    const retornaDadosAdicionaisTabela = (infos) => {
        if (infos.representacao === "SERVIDOR") {
            return (
                <p className="texto-dados-adicionais-tabela-membros">
                    <span className="mr-5"><strong>Registro funcional:</strong> {infos.codigo_identificacao}</span>
                    <span className="mr-5"><strong>Cargo na educação: </strong> {infos.cargo_educacao}</span>
                    <span><strong>Email: </strong> {infos.email}</span>
                </p>
            )
        } else if (infos.representacao === "ESTUDANTE") {
            return (
                <p className="texto-dados-adicionais-tabela-membros">
                    <span className="mr-5"><strong>Código Eol do Aluno: </strong> {infos.codigo_identificacao}</span>
                    <span><strong>Email: </strong> {infos.email}</span>
                </p>
            )
        } else if (infos.representacao === "PAI_RESPONSAVEL") {
            return (
                <p className="texto-dados-adicionais-tabela-membros">
                    <span><strong>Email: </strong> {infos.email}</span>
                </p>
            )
        }
    };

    const toggleIcon = (id) => {
        setClickIconeToogle({
            ...clickIconeToogle,
            [id]: !clickIconeToogle[id]
        });
    };

    const handleDeleteMembroAction = (infoMembroSelecionado) => {
        setInfosMembroSelecionado(infoMembroSelecionado);
        setShowConfirmDelete(true);
    };

    const handleDeleteConfirmation = async () => {
        setShowConfirmDelete(false);
        await deleteMembro(infosMembroSelecionado.infos.uuid);
    };

    const closeConfirmDeleteDialog = () => {
        setShowConfirmDelete(false);
    };

    const deleteMembro = async (uuid) => {
        if (uuid) {
            try {
                const response = await deleteMembroAssociacao(uuid);
                if (response.status === 204) {
                    console.log("Exclusão realizada com sucesso!");
                    await carregaMembros();
                } else {
                    console.log("Erro ao excluir Membro")
                }
            } catch (error) {
                console.log(error)
            }
        }
    };

    const verificaSeExibeToolTip = useCallback((id_cargo, obj_completo) => {
        if (statusPresidenteAssociacao && statusPresidenteAssociacao.status_presidente && statusPresidenteAssociacao.status_presidente === "AUSENTE") {
            if (id_cargo === "PRESIDENTE_DIRETORIA_EXECUTIVA") {
                return (
                    <>
                        <span data-html={true} data-tip={`Presidente ausente`}>
                        <FontAwesomeIcon
                            style={{marginLeft: "3px", color: '#B41D00', fontSize: '18px'}}
                            icon={faInfoCircle}
                        />
                        </span>
                        <ReactTooltip html={true}/>
                    </>
                )
            } else if (statusPresidenteAssociacao.cargo_substituto_presidente_ausente === id_cargo) {
                return (
                    <>
                        <span data-html={true} data-tip={`${obj_completo.cargo} em <br/> atribuições da presidência`}>
                        <FontAwesomeIcon
                            style={{marginLeft: "3px", color: '#297806', fontSize: '18px'}}
                            icon={faInfoCircle}
                        />
                        </span>
                        <ReactTooltip html={true}/>
                    </>

                )
            }
        }

    }, [statusPresidenteAssociacao])

    return (
        <div className="row">
            <div className="col-12">
                {loading ? (
                        <Loading
                            corGrafico="black"
                            corFonte="dark"
                            marginTop="0"
                            marginBottom="0"
                        />
                    ) :
                    <>
                        <MenuInterno
                            caminhos_menu_interno={UrlsMenuInterno}
                        />
                        <ExportaDadosDaAsssociacao/>
                        <TabelaMembros
                            titulo="Diretoria Executiva"
                            clickIconeToogle={clickIconeToogle}
                            toggleIcon={toggleIcon}
                            onDeleteMembro={handleDeleteMembroAction}
                            cargos={initialValuesMembrosDiretoria}
                            converteNomeRepresentacao={converteNomeRepresentacao}
                            retornaDadosAdicionaisTabela={retornaDadosAdicionaisTabela}
                            verificaSeExibeToolTip={verificaSeExibeToolTip}
                            visoesService={visoesService}
                        />
                        <hr/>

                        <TabelaMembros
                            titulo="Conselho Fiscal"
                            clickIconeToogle={clickIconeToogle}
                            toggleIcon={toggleIcon}
                            onDeleteMembro={handleDeleteMembroAction}
                            cargos={initialValuesMembrosConselho}
                            converteNomeRepresentacao={converteNomeRepresentacao}
                            retornaDadosAdicionaisTabela={retornaDadosAdicionaisTabela}
                            verificaSeExibeToolTip={null}
                            visoesService={visoesService}
                        />
                    </>
                }
            </div>
            <section>
                <ConfirmaDeleteMembro
                    show={showConfirmDelete}
                    onCancelDelete={closeConfirmDeleteDialog}
                    onConfirmDelete={handleDeleteConfirmation}
                />
            </section>
        </div>
    );
};