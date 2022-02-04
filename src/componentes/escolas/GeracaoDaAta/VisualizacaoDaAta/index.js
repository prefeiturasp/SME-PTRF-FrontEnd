import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import "../geracao-da-ata.scss"
import {TopoComBotoes} from "./TopoComBotoes";
import {TextoDinamicoSuperior} from "./TextoDinamicoSuperior";
import {TabelaDinamica} from "./TabelaDinamica";
import {TextoDinamicoInferior} from "./TextoDinamicoInferior";
import { TabelaPresentes } from "./TabelaPresentes";
import {TextoCopiado} from "../../../../utils/Modais";
import {getInfoAta, getPreviaInfoAta} from "../../../../services/escolas/PrestacaoDeContas.service";
import {getTabelasAtas, getAtas} from "../../../../services/escolas/AtasAssociacao.service";
import {getDespesasPorFiltros, getPrestacaoDeContasDetalhe, getTiposDevolucao, getPreviaPrestacaoDeContasDetalhe} from "../../../../services/dres/PrestacaoDeContas.service";
import { getListaPresentesAgrupados } from "../../../../services/escolas/PresentesAta.service";
import moment from "moment";
import {exibeDataPT_BR, trataNumericos} from "../../../../utils/ValidacoesAdicionaisFormularios";
import {getDespesa, getDespesasTabelas} from "../../../../services/escolas/Despesas.service";
import {ModalDevolucaoAoTesouro} from "../ModalDevolucaoAoTesouro";
import {ModalReverDevolucoesAoTesouro} from "../ModalReverDevolucoesAoTesouro";
import {getSalvarDevoulucoesAoTesouro} from "../../../../services/dres/PrestacaoDeContas.service";
import {ASSOCIACAO_UUID} from "../../../../services/auth.service";

moment.updateLocale('pt', {
    months: [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
        "agosto", "setembro", "outubro", "novembro", "dezembro"
    ]
});

const numero = require('numero-por-extenso');

export const VisualizacaoDaAta = () => {

    let {uuid_ata} = useParams();

    const [showModalDevolucoesAoTesouro, setShowModalDevolucoesAoTesouro] = useState(false);
    const [showTextoCopiado, setShowTextoCopiado] = useState(false);
    const [showReverDevolucoesAoTesouro, setShowReverDevolucoesAoTesouro] = useState(false);
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
    });

    const [infoAta, setInfoAta] = useState({});
    const [tabelas, setTabelas] = useState({});
    const [dadosAta, setDadosAta] = useState({});
    const [prestacaoDeContasDetalhe, setPrestacaoDeContasDetalhe] = useState({});
    const [listaPresentes, setListaPresentes] = useState([]);

    const periodo_prestacao_de_contas = JSON.parse(localStorage.getItem('periodoPrestacaoDeConta'));
    const periodoUuid = periodo_prestacao_de_contas ? periodo_prestacao_de_contas.periodo_uuid : ""
    const prestacaoContaUuid = localStorage.getItem("uuidPrestacaoConta")
    const associacaoUuid = localStorage.getItem(ASSOCIACAO_UUID)

    useEffect(() => {
        const infoAta = async () => {
            let info_ata = null
            if (prestacaoContaUuid) {
                info_ata = await getInfoAta();
            }
            else if (periodoUuid){
                info_ata = await getPreviaInfoAta(associacaoUuid, periodoUuid);
            }
            setInfoAta(info_ata);
            await getDadosAta()
        };

        const tabelasAta = async () => {
            let tabelas = await getTabelasAtas();
            setTabelas(tabelas)
        };
        infoAta();
        tabelasAta();
    }, []);

    useEffect(() => {
        getListaPresentesAta();
    }, []);


    const getListaPresentesAta = async () => {
        let lista_presentes = await getListaPresentesAgrupados(uuid_ata);
        setListaPresentes(lista_presentes);
    }

    const getDadosAta = async () => {
        let dados_ata = await getAtas(uuid_ata);

        let prestacao = null
        if (dados_ata.prestacao_conta) {
            prestacao = await getPrestacaoDeContasDetalhe(dados_ata.prestacao_conta);
        } else if(periodoUuid){
            prestacao = await getPreviaPrestacaoDeContasDetalhe(periodoUuid);
        }

        setPrestacaoDeContasDetalhe(prestacao);
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
        });
        setDadosAta(dados_ata);

        // InformacoesDvolucaoAoTesrouro
        if (prestacao && prestacao.devolucoes_ao_tesouro_da_prestacao && prestacao.devolucoes_ao_tesouro_da_prestacao.length > 0) {
            let devolucoes_ao_tesouro_da_prestacao = [];
            prestacao.devolucoes_ao_tesouro_da_prestacao.map((devolucao, index) => {
                buscaDespesa(devolucao.despesa.uuid, index);
                devolucoes_ao_tesouro_da_prestacao.push({
                    busca_por_cpf_cnpj: "",
                    busca_por_tipo_documento: "",
                    busca_por_numero_documento: "",
                    despesa: devolucao.despesa.uuid,
                    tipo: devolucao.tipo.uuid,
                    data: devolucao.data,
                    devolucao_total: devolucao.devolucao_total ? 'true' : 'false',
                    valor: devolucao.valor ? valorTemplate(devolucao.valor) : '',
                    motivo: devolucao.motivo,
                    visao_criacao: devolucao.visao_criacao,
                })
            });
            setInitialFormDevolucaoAoTesouro({devolucoes_ao_tesouro_da_prestacao})
        }
    };

    const onHandleClose = () => {
        setShowTextoCopiado(false);
        setShowModalDevolucoesAoTesouro(false);
        setShowReverDevolucoesAoTesouro(false);
    };

    const handleClickEditarAta = () => {
        if (dadosAta.tipo_ata === 'RETIFICACAO' && prestacaoDeContasDetalhe && prestacaoDeContasDetalhe.devolucoes_ao_tesouro_da_prestacao && prestacaoDeContasDetalhe.devolucoes_ao_tesouro_da_prestacao.length > 0) {
            setShowReverDevolucoesAoTesouro(true);
        }
        else{
            irParaEdicaoAta();
        }
    };

    const irParaEdicaoAta = () => {
        let path = `/edicao-da-ata/${uuid_ata}/`;
        window.location.assign(path)
    }

    const handleClickFecharAta = () => {
        window.location.assign("/prestacao-de-contas")
    };

    const handleClickCopiarAta = () => {

        let doc = document, text = doc.getElementById("copiar");
        let range, selection;

        if (doc.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(text);
            range.select();
        } else if (window.getSelection) {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        document.execCommand('copy');
        if (range) {
            setShowTextoCopiado(true)
        }
    };

    const valorTemplate = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
    };

    const dataPorExtenso = (data) => {
        if (!data) {
            return "___ dias do mês de ___ de ___"
        } else {
            let dia_por_extenso = numero.porExtenso(moment(new Date(data), "YYYY-MM-DD").add(1, 'days').format("DD"));
            let mes_por_extenso = moment(new Date(data), "YYYY-MM-DD").add(1, 'days').format("MMMM");
            let ano_por_extenso = numero.porExtenso(moment(new Date(data), "DD/MM/YYYY").add(1, 'days').year());
            let data_por_extenso
            if (dia_por_extenso === 'um'){
                data_por_extenso = "No primeiro dia do mês de " + mes_por_extenso + " de " + ano_por_extenso;
            }else {
                data_por_extenso = "Aos " + dia_por_extenso + " dias do mês de " + mes_por_extenso + " de " + ano_por_extenso;
            }
            return data_por_extenso;
        }
    };

    const retornaDadosAtaFormatado = (campo) => {
        if (campo === "tipo_reuniao") {
            let tipo_de_reuniao = tabelas.tipos_reuniao ? tabelas.tipos_reuniao.find(element => element.id === dadosAta.tipo_reuniao) : "";
            return tipo_de_reuniao.nome ? tipo_de_reuniao.nome : "___";

        } else if (campo === "data_reuniao") {
            return dataPorExtenso(dadosAta.data_reuniao);

        } else if (campo === "data_reuniao_texto_inferior") {
            let data = dadosAta.data_reuniao ? "São Paulo, dia " + moment(new Date(dadosAta.data_reuniao), "YYYY-MM-DD").add(1, 'days').format("DD [de] MMMM [de] YYYY") : "";
            return data;

        } else if (campo === "periodo.data_inicio_realizacao_despesas") {
            return dadosAta.periodo.data_inicio_realizacao_despesas ? moment(new Date(dadosAta.periodo.data_inicio_realizacao_despesas), "YYYY-MM-DD").add(1, 'days').format("DD/MM/YYYY") : "";

        } else if (campo === "periodo.data_fim_realizacao_despesas") {
            return dadosAta.periodo.data_fim_realizacao_despesas ? moment(new Date(dadosAta.periodo.data_fim_realizacao_despesas), "YYYY-MM-DD").add(1, 'days').format("DD/MM/YYYY") : "";

        } else if (campo === "periodo.referencia") {
            let periodo_referencia = dadosAta.periodo.referencia ? dadosAta.periodo.referencia.split(".") : "";
            return periodo_referencia[1] === "u" ? "repasse único de " + periodo_referencia[0] : periodo_referencia[1] + "° repasse de " + periodo_referencia[0];

        } else if (campo === "convocacao") {
            let convocacao = tabelas.convocacoes ? tabelas.convocacoes.find(element => element.id === dadosAta.convocacao) : "";
            return convocacao.nome ? convocacao.nome : "___";

        } else if (campo === "parecer_conselho") {
            let parecer_conselho = tabelas.pareceres ? tabelas.pareceres.find(element => element.id === dadosAta.parecer_conselho) : "";
            if (parecer_conselho.id === "APROVADA") {
                return "Os membros do Conselho Fiscal, à vista dos registros contábeis e verificando nos documentos apresentados a exatidão das despesas realizadas, julgaram exata a presente prestação de contas considerando-a em condições de ser aprovada e emitindo parecer favorável à sua aprovação."
            } else if (parecer_conselho.id === "REJEITADA") {
                return "Os membros do Conselho Fiscal, à vista dos registros contábeis e verificando nos documentos apresentados,  não consideram a presente prestação de contas em condições de ser aprovada emitindo parecer contrário à sua aprovação."
            } else if (parecer_conselho.id === "RESSALVAS") {
                return "Os membros do Conselho Fiscal, à vista dos registros contábeis e verificando nos documentos apresentados,  consideram a presente prestação de contas em condições de ser aprovada com ressalvas emitindo parecer favorável à sua aprovação com ressalvas."
            }
        }
    };

    const exibeDevolucoesAoTesouro = () => {
        if (prestacaoDeContasDetalhe && prestacaoDeContasDetalhe.devolucoes_ao_tesouro_da_prestacao && prestacaoDeContasDetalhe.devolucoes_ao_tesouro_da_prestacao.length > 0) {
            return (
                <>
                    <p><strong>Devoluções ao tesouro</strong></p>
                    <table className="table table-bordered tabela-devolucoes-ao-tesouro">
                        <thead>
                        <tr>
                            <th scope="col">Tipo de devolução</th>
                            <th scope="col">Data de devolução</th>
                            <th scope="col">Número de documento</th>
                            <th scope="col">CPF/CNPJ do fornecedor</th>
                            <th scope="col">Valor da devolução</th>
                        </tr>
                        </thead>
                        <tbody>
                        {prestacaoDeContasDetalhe.devolucoes_ao_tesouro_da_prestacao.map((devolucao, index) => (
                            <tr key={index}>
                                <td>{devolucao.tipo.nome}</td>
                                <td>{devolucao.data ? exibeDataPT_BR(devolucao.data) : ''}</td>
                                <td>{devolucao.despesa.numero_documento}</td>
                                <td>{devolucao.despesa.cpf_cnpj_fornecedor}</td>
                                <td>{devolucao.valor ? valorTemplate(devolucao.valor) : ''}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <hr/>
                </>
            )
        } else {
            return (
                <>
                </>
            )
        }
    };

    // InformacoesDvolucaoAoTesrouro
    const formRef = useRef();
    const initialInformacoesPrestacaoDeContas = {
        devolucao_ao_tesouro: 'Sim',
    };
    const initialDevolucaoAoTesouro = {
        devolucoes_ao_tesouro_da_prestacao: [
            {
                busca_por_cpf_cnpj: "",
                busca_por_tipo_documento: "",
                busca_por_numero_documento: "",
                despesa: "",
                tipo: "",
                data: "",
                devolucao_total: "",
                valor: "",
                motivo: "",
                visao_criacao: "UE",
            }
        ]
    };
    const [informacoesPrestacaoDeContas] = useState(initialInformacoesPrestacaoDeContas);
    const [initialFormDevolucaoAoTesouro, setInitialFormDevolucaoAoTesouro] = useState(initialDevolucaoAoTesouro);
    const [despesas, setDespesas] = useState([]);
    const [despesasTabelas, setDespesasTabelas] = useState([]);
    const [tiposDevolucao, setTiposDevolucao] = useState([]);
    const [camposObrigatorios, setCamposObrigatorios] = useState(false);

    useEffect(() => {
        const carregaTabelasDespesas = async () => {
            const resp = await getDespesasTabelas();
            setDespesasTabelas(resp);
        };
        carregaTabelasDespesas();
    }, []);

    useEffect(() => {
        const carregaTiposDevolucao = async () => {
            const resp = await getTiposDevolucao();
            setTiposDevolucao(resp);
        };
        carregaTiposDevolucao();
    }, []);

    const buscaDespesaPorFiltros = async (index) => {
        let valores, cpf, tipo_documento, numero_documento;
        if (formRef.current) {
            valores = formRef.current.values.devolucoes_ao_tesouro_da_prestacao[index];
            cpf = valores.busca_por_cpf_cnpj ? valores.busca_por_cpf_cnpj : "";
            tipo_documento = valores.busca_por_tipo_documento ? valores.busca_por_tipo_documento : '';
            numero_documento = valores.busca_por_numero_documento ? valores.busca_por_numero_documento : '';

            let despesas_por_filtros = await getDespesasPorFiltros(prestacaoDeContasDetalhe.associacao.uuid, cpf, tipo_documento, numero_documento);
            despesas_por_filtros = despesas_por_filtros.results
            setDespesas({
                ...despesas,
                [`devolucao_${index}`]: [...despesas_por_filtros]
            });
        }
    };

    const buscaDespesa = async (despesa_uuid, index) => {
        if (despesa_uuid) {
            let despesa = await getDespesa(despesa_uuid);
            setDespesas(prevState => ({...prevState, [`devolucao_${index}`]: [despesa]}));
        }
    };

    const validateFormDevolucaoAoTesouro = async (values) => {
        const errors = {};

        if (values.devolucoes_ao_tesouro_da_prestacao.length > 0){
            values.devolucoes_ao_tesouro_da_prestacao.map((devolucao) => {
                if (!devolucao.data || !devolucao.despesa || devolucao.devolucao_total === '' /*|| !devolucao.motivo*/ || !devolucao.tipo || !devolucao.valor) {
                    setCamposObrigatorios(true);
                    errors.campos_obrigatorios = "Todos os campos são obrigatórios";
                } else {
                    setCamposObrigatorios(false)
                }
            });
        }else {
            setCamposObrigatorios(false)
        }
        return errors;
    };

    const onSubmitModalDevolucoesAoTesouro = async () => {

        let devolucao_ao_tesouro_tratado;
        if (formRef.current) {
            devolucao_ao_tesouro_tratado = formRef.current.values.devolucoes_ao_tesouro_da_prestacao;
            if (devolucao_ao_tesouro_tratado.length > 0) {
                devolucao_ao_tesouro_tratado.map((devolucao) => {
                    delete devolucao.busca_por_cpf_cnpj;
                    delete devolucao.busca_por_tipo_documento;
                    delete devolucao.busca_por_numero_documento;
                    devolucao.data = devolucao.data ? moment(devolucao.data).format("YYYY-MM-DD") : null;
                    devolucao.valor = devolucao.valor ? trataNumericos(devolucao.valor) : '';
                    devolucao.devolucao_total = devolucao.devolucao_total === 'true' ? true : false;
                })
            }else{
                devolucao_ao_tesouro_tratado = [];
                setInitialFormDevolucaoAoTesouro(initialDevolucaoAoTesouro);
                setDespesas([])
            }
        } else {
            devolucao_ao_tesouro_tratado = [];
            setInitialFormDevolucaoAoTesouro(initialDevolucaoAoTesouro)
            setDespesas([])
        }

        const payload = {
            devolucoes_ao_tesouro_da_prestacao: devolucao_ao_tesouro_tratado
        };
        if (formRef.current) {
            let validar = await validateFormDevolucaoAoTesouro(formRef.current.values);
            if (!camposObrigatorios && Object.entries(validar).length === 0) {
                await getSalvarDevoulucoesAoTesouro(prestacaoDeContasDetalhe.uuid, payload);
                await getDadosAta();
                setShowModalDevolucoesAoTesouro(false);
                setShowReverDevolucoesAoTesouro(false);
            } else {
                return formRef.current.setErrors(validar)
            }
        }
    };
    // FIM InformacoesDvolucaoAoTesrouro

    const temDevolucaoAoTesouro = (
        prestacaoDeContasDetalhe &&
        prestacaoDeContasDetalhe.devolucoes_ao_tesouro_da_prestacao &&
        prestacaoDeContasDetalhe.devolucoes_ao_tesouro_da_prestacao.length > 0
    )

    return (
        <div className="col-12 container-visualizacao-da-ata mb-5">
            <div className="col-12 mt-4">
                {dadosAta && Object.entries(dadosAta).length > 0 &&
                    <TopoComBotoes
                        dadosAta={dadosAta}
                        prestacaoDeContasDetalhe={prestacaoDeContasDetalhe}
                        handleClickEditarAta={handleClickEditarAta}
                        handleClickFecharAta={handleClickFecharAta}
                        handleClickCopiarAta={handleClickCopiarAta}
                        setShowModalDevolucoesAoTesouro={setShowModalDevolucoesAoTesouro}
                        exibeBotaoDevolucaoTesouro={temDevolucaoAoTesouro}
                    />
                }
            </div>

            <div id="copiar" className="col-12">
                {dadosAta && Object.entries(dadosAta).length > 0 &&
                    <TextoDinamicoSuperior
                        dadosAta={dadosAta}
                        retornaDadosAtaFormatado={retornaDadosAtaFormatado}
                        prestacaoDeContasDetalhe={prestacaoDeContasDetalhe}
                    />
                }

                {dadosAta && Object.entries(dadosAta).length > 0 && dadosAta.tipo_ata === 'RETIFICACAO' &&
                    <>
                        {/*So exibe as retificações se houver*/}
                        { stateFormEditarAta && stateFormEditarAta.retificacoes &&
                            <div>
                                <p className='mt-3'><strong>Retificações:</strong></p>
                                <p>{stateFormEditarAta.retificacoes}</p>
                            </div>
                        }

                        {exibeDevolucoesAoTesouro()}
                    </>
                }

                {infoAta && dadosAta &&
                    <TabelaDinamica
                        infoAta={infoAta}
                        dadosAta={dadosAta}
                        valorTemplate={valorTemplate}
                        retornaDadosAtaFormatado={retornaDadosAtaFormatado}
                    />
                }
                <br/>
                {dadosAta && Object.entries(dadosAta).length > 0 &&
                    <TextoDinamicoInferior
                        dadosAta={dadosAta}
                        retornaDadosAtaFormatado={retornaDadosAtaFormatado}
                    />
                }
            </div>

            <div className="col-12">
                {dadosAta && Object.entries(dadosAta).length > 0 &&
                    <div className="mt-4">
                        <TabelaPresentes
                            titulo="Presentes"
                            listaPresentes={listaPresentes.presentes_membros}
                        />
                    </div>
                }

                {dadosAta && Object.entries(dadosAta).length > 0 &&
                listaPresentes &&
                listaPresentes.presentes_nao_membros &&
                listaPresentes.presentes_nao_membros.length > 0 &&
                    <div className="mt-4">
                        <TabelaPresentes
                            titulo="Demais membros"
                            listaPresentes={listaPresentes.presentes_nao_membros}
                       />
                    </div>
                }

                {dadosAta && Object.entries(dadosAta).length > 0 &&
                    <div className="mt-4">
                        <p style={{fontSize: '24px', color: '#42474A'}}><strong>Parecer do Conselho Fiscal</strong></p>
                        <p>{retornaDadosAtaFormatado("parecer_conselho")}</p>
                        <p className="mt-5">{retornaDadosAtaFormatado("data_reuniao_texto_inferior")}</p>
                        <TabelaPresentes
                            titulo="Presentes"
                            listaPresentes={listaPresentes.presentes_ata_conselho_fiscal}
                       />
                    </div>
                }
            </div>
            <section>
                <ModalDevolucaoAoTesouro
                    show={showModalDevolucoesAoTesouro}
                    handleClose={onHandleClose}
                    onSubmitModalDevolucoesAoTesouro={onSubmitModalDevolucoesAoTesouro}
                    informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                    initialValues={initialFormDevolucaoAoTesouro}
                    formRef={formRef}
                    despesas={despesas}
                    buscaDespesaPorFiltros={buscaDespesaPorFiltros}
                    buscaDespesa={buscaDespesa}
                    valorTemplate={valorTemplate}
                    despesasTabelas={despesasTabelas}
                    tiposDevolucao={tiposDevolucao}
                    validateFormDevolucaoAoTesouro={validateFormDevolucaoAoTesouro}
                    camposObrigatorios={camposObrigatorios}
                />
            </section>
            <section>
                <ModalReverDevolucoesAoTesouro
                    show={showReverDevolucoesAoTesouro}
                    handleClose={onHandleClose}
                    setShowModalDevolucoesAoTesouro={setShowModalDevolucoesAoTesouro}
                    titulo="Rever Devoluções ao Tesouro"
                    texto="<p>Você ja conferiu as devoluções ao tesouro registradas nessa prestação de contas?</p>"
                    primeiroBotaoTexto="Não, leve-me para lá"
                    primeiroBotaoCss="outline-success"
                    segundoBotaoCss="success"
                    segundoBotaoTexto="Sim, ja está tudo certo"
                    irParaEdicaoAta={irParaEdicaoAta}
                />
            </section>
            <section>
                <TextoCopiado
                    show={showTextoCopiado}
                    handleClose={onHandleClose}
                />
            </section>
        </div>
    )
};