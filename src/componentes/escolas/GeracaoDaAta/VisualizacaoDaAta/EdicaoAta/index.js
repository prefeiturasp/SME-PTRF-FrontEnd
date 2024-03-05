import React from "react";
import "../../geracao-da-ata.scss"
import {TopoComBotoes} from "./TopoComBotoes";
import {FormularioEditaAta} from "./FormularioEditaAta";
import {NovoFormularioEditaAta} from "./NovoFormularioEditaAta";
import {visoesService} from "../../../../../services/visoes.service";
import {useParams} from "react-router-dom";
import {useEffect, useState, useCallback, useRef} from "react";
import {getMembrosCargos} from "../../../../../services/escolas/PrestacaoDeContas.service";
import {
    getListaPresentesPadrao,
    postEdicaoAta,
    getListaPresentes
} from "../../../../../services/escolas/PresentesAta.service";
import {getTabelasAtas, getAtas} from "../../../../../services/escolas/AtasAssociacao.service";
import {ASSOCIACAO_UUID} from "../../../../../services/auth.service";
import moment from "moment";
import {toastCustom} from "../../../../Globais/ToastCustom"

// Hooks Personalizados
import {useCarregaRepassesPendentesPorPeriodoAteAgora} from "../../../../../hooks/Globais/useCarregaRepassesPendentesPorPeriodoAteAgora";

moment.updateLocale('pt', {
    months: [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
        "agosto", "setembro", "outubro", "novembro", "dezembro"
    ]
});


export const EdicaoAta = () => {
    const formRef = useRef();
    let {uuid_ata} = useParams();
    let uuid_associacao = localStorage.getItem(ASSOCIACAO_UUID);
    const periodo_prestacao_de_contas = JSON.parse(localStorage.getItem('periodoPrestacaoDeConta'));
    const periodoUuid = periodo_prestacao_de_contas ? periodo_prestacao_de_contas.periodo_uuid : ""

    // Hooks Personalizados
    const repassesPendentes = useCarregaRepassesPendentesPorPeriodoAteAgora(uuid_associacao, periodoUuid)

    const [listaPresentesPadrao, setListaPresentesPadrao] = useState([]);
    const [stateFormEditarAta, setStateFormEditarAta] = useState({
        comentarios: "",
        parecer_conselho: "",
        tipo_reuniao: "ORDINARIA",
        local_reuniao: "",
        presidente_reuniao: "",
        secretario_reuniao: "",
        data_reuniao: "",
        convocacao: "PRIMEIRA",
        cargo_presidente_reuniao: "",
        cargo_secretaria_reuniao: "",
        retificacoes: "",
        hora_reuniao: "",
        justificativa_repasses_pendentes: "",
    });
    const [tabelas, setTabelas] = useState({});
    const [membrosCargos, setMembrosCargos] = useState([])
    const [disableBtnSalvar, setDisableBtnSalvar] = useState(false)
    const [dadosAta, setDadosAta] = useState({});
    const [erros, setErros] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            let listaPresentesAta = await getListaPresentesAta();
            let listaPresentesPadraoAta = await getListaPresentesPadraoAta();

            for (let i = 0; i < listaPresentesAta.length; i++) {
                const presenteAta = listaPresentesAta[i];
                
                for (let j = 0; j < listaPresentesPadraoAta.length; j++) {
                  const presentePadraoAta = listaPresentesPadraoAta[j];
                  
                  if (presenteAta.identificacao === presentePadraoAta.identificacao) {
                    listaPresentesPadraoAta[j].presente = listaPresentesAta[i].presente;
                  }
                }
              }

            let participantesNaoMembros = listaPresentesAta.filter(participante => participante.membro === false);

            setListaPresentesPadrao(listaPresentesPadraoAta.concat(participantesNaoMembros))
        };
        fetchData();
    }, []);

    const exibeMembrosCargos = useCallback(async () => {
        let membros_cargos = await getMembrosCargos(uuid_associacao)

        if (membros_cargos && membros_cargos.length > 0){
            membros_cargos.sort((a, b) => (a.nome > b.nome && 1) || -1)
        }
        setMembrosCargos(membros_cargos)
    }, [uuid_associacao])

    useEffect(() => {
        exibeMembrosCargos()
    }, [exibeMembrosCargos])

    useEffect(() => {
        getDadosAta();
        tabelasAta();
    }, []);


    const getDadosAta = async () => {
        let dados_ata = await getAtas(uuid_ata);
        let data_da_reuniao = dados_ata.data_reuniao ? dados_ata.data_reuniao : "";
        setStateFormEditarAta({
            comentarios: dados_ata.comentarios,
            parecer_conselho: dados_ata.parecer_conselho,
            tipo_reuniao: dados_ata.tipo_reuniao,
            local_reuniao: dados_ata.local_reuniao,
            presidente_reuniao: dados_ata.presidente_reuniao,
            secretario_reuniao: dados_ata.secretario_reuniao,
            data_reuniao: data_da_reuniao,
            convocacao: dados_ata.convocacao,
            cargo_presidente_reuniao: dados_ata.cargo_presidente_reuniao,
            cargo_secretaria_reuniao: dados_ata.cargo_secretaria_reuniao,
            retificacoes: dados_ata.retificacoes,
            hora_reuniao: dados_ata.hora_reuniao,
            tipo_ata: dados_ata.tipo_ata,
            justificativa_repasses_pendentes: dados_ata.justificativa_repasses_pendentes
        });
        setDadosAta(dados_ata);
    };

    const tabelasAta = async () => {
        let tabelas = await getTabelasAtas();
        setTabelas(tabelas)
    };

    const getListaPresentesPadraoAta = async () => {
        let lista_presentes_padrao = await getListaPresentesPadrao(uuid_ata);
        return lista_presentes_padrao;
    }

    const editaStatusDePresencaMembro = (identificacao) => {
        let copiaListaPresentesPadrao = []


        copiaListaPresentesPadrao = [...listaPresentesPadrao];

        const membroListaPresentesSelecionado = copiaListaPresentesPadrao.find(membro => membro.identificacao === identificacao);

        if (membroListaPresentesSelecionado) {
            membroListaPresentesSelecionado.presente = !membroListaPresentesSelecionado.presente;
        }

        return setListaPresentesPadrao(copiaListaPresentesPadrao);
    }

    const getListaPresentesAta = async () => {
        let lista_presentes = await getListaPresentes(uuid_ata);
        return lista_presentes;
    }

    const handleClickFecharAta = () => {
        let path = `/visualizacao-da-ata/${uuid_ata}/`;
        window.location.assign(path)
    };

    const temErros = (dadosForm) => {
        let erros = {};
        setErros(erros)
        return erros;
    };

    const getPresidenteAndSecretario = (participantes) => {
        let presidente = null;
        let secretario = null;

        participantes.forEach(participante => {
            if(participante.presidente_da_reuniao) {
                presidente = {
                    nome: participante.nome,
                    cargo: participante.cargo
                }
            } else if(participante.secretario_da_reuniao) {
                secretario = {
                    nome: participante.nome,
                    cargo: participante.cargo
                }
            }
        });

        return {
            presidente: presidente,
            secretario: secretario
        };
    };

    const adicionaAtaUuidAosParticipantes = (listaParticipantes) => {
        listaParticipantes.forEach(participante => {
            participante.ata = uuid_ata;
        });

        return listaParticipantes;
    };

    const onSubmitFormEdicaoAta = async () => {

        let dadosForm = formRef.current.values

        let retorno_erros = temErros(dadosForm)

        if (Object.entries(retorno_erros).length > 0){
            return
        }
        let data_da_reuniao = dadosForm.stateFormEditarAta.data_reuniao ? moment(dadosForm.stateFormEditarAta.data_reuniao).format("YYYY-MM-DD") : null;
        let hora_reuniao = dadosForm.stateFormEditarAta.hora_reuniao ? moment(dadosForm.stateFormEditarAta.hora_reuniao, 'HHmm').format('HH:mm') : "00:00"

        let payload = {}

        if(visoesService.featureFlagAtiva('historico-de-membros')) {
            let result = getPresidenteAndSecretario(dadosForm.listaParticipantes)

            let listaParticipantes = adicionaAtaUuidAosParticipantes(dadosForm.listaParticipantes)

            const {presidente, secretario} = result

            payload = {
                cargo_presidente_reuniao: presidente ? presidente.cargo : "",
                cargo_secretaria_reuniao: secretario ? secretario.cargo : "",
                comentarios: dadosForm.stateFormEditarAta.comentarios,
                convocacao: dadosForm.stateFormEditarAta.convocacao,
                data_reuniao: data_da_reuniao,
                local_reuniao: dadosForm.stateFormEditarAta.local_reuniao,
                parecer_conselho: dadosForm.stateFormEditarAta.parecer_conselho,
                presidente_reuniao: presidente ? presidente.nome : "",
                retificacoes: dadosForm.stateFormEditarAta.retificacoes,
                secretario_reuniao: secretario ? secretario.nome : "",
                tipo_reuniao: dadosForm.stateFormEditarAta.tipo_reuniao,
                presentes_na_ata: listaParticipantes,
                hora_reuniao: hora_reuniao,
                justificativa_repasses_pendentes: dadosForm.stateFormEditarAta.justificativa_repasses_pendentes,
            }
        } else {
            payload = {
                cargo_presidente_reuniao: dadosForm.stateFormEditarAta.cargo_presidente_reuniao,
                cargo_secretaria_reuniao: dadosForm.stateFormEditarAta.cargo_secretaria_reuniao,
                comentarios: dadosForm.stateFormEditarAta.comentarios,
                convocacao: dadosForm.stateFormEditarAta.convocacao,
                data_reuniao: data_da_reuniao,
                local_reuniao: dadosForm.stateFormEditarAta.local_reuniao,
                parecer_conselho: dadosForm.stateFormEditarAta.parecer_conselho,
                presidente_reuniao: dadosForm.stateFormEditarAta.presidente_reuniao,
                retificacoes: dadosForm.stateFormEditarAta.retificacoes,
                secretario_reuniao: dadosForm.stateFormEditarAta.secretario_reuniao,
                tipo_reuniao: dadosForm.stateFormEditarAta.tipo_reuniao,
                presentes_na_ata: dadosForm.listaPresentesPadrao,
                hora_reuniao: hora_reuniao,
                justificativa_repasses_pendentes: dadosForm.stateFormEditarAta.justificativa_repasses_pendentes,
            }
        }

        try {
            await postEdicaoAta(uuid_ata, payload)
            let tipo_ata = dadosAta.tipo_ata === 'RETIFICACAO' ? 'retificação' : 'apresentação'
            toastCustom.ToastCustomSuccess('Ata salva com sucesso', `As edições da ata de ${tipo_ata} foram salvas com sucesso.`)
        } catch (e) {
            console.log("Erro ao fazer edição da Ata ", e.response)
        }
    }
    return (
        <>
            <div className="col-12 container-visualizacao-da-ata mb-5">
                <div className="col-12 mt-4">
                    {dadosAta && Object.entries(dadosAta).length > 0 &&
                        <TopoComBotoes
                            dadosAta={dadosAta}
                            onSubmitFormEdicaoAta={onSubmitFormEdicaoAta}
                            handleClickFecharAta={handleClickFecharAta}
                            disableBtnSalvar={disableBtnSalvar}
                        />
                    }
                </div>


                <div className="col-12">
                    {visoesService.featureFlagAtiva('historico-de-membros') ?  <NovoFormularioEditaAta
                        stateFormEditarAta={stateFormEditarAta}
                        tabelas={tabelas}
                        formRef={formRef}
                        onSubmitFormEdicaoAta={onSubmitFormEdicaoAta}
                        uuid_ata={uuid_ata}
                        setDisableBtnSalvar={setDisableBtnSalvar}
                        repassesPendentes={repassesPendentes}
                        erros={erros}
                    >
                    </NovoFormularioEditaAta> : <FormularioEditaAta
                        listaPresentesPadrao={listaPresentesPadrao}
                        stateFormEditarAta={stateFormEditarAta}
                        tabelas={tabelas}
                        membrosCargos={membrosCargos}
                        formRef={formRef}
                        onSubmitFormEdicaoAta={onSubmitFormEdicaoAta}
                        uuid_ata={uuid_ata}
                        setDisableBtnSalvar={setDisableBtnSalvar}
                        repassesPendentes={repassesPendentes}
                        erros={erros}
                        editaStatusDePresencaMembro={editaStatusDePresencaMembro}
                    >
                    </FormularioEditaAta>}
                </div>

            </div>
        </>
    )
};