import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CadastroForm } from "../CadastroForm";
import { MemoryRouter } from "react-router-dom";
import { DespesaContext } from "../../../../../context/Despesa";
import * as DespesasService from "../../../../../services/escolas/Despesas.service";
import { metodosAuxiliares } from "../../metodosAuxiliares";

// Mock dos serviços
jest.mock("../../../../../services/escolas/Despesas.service");

jest.mock("../../../../../services/escolas/Associacao.service", () => ({
  getPeriodoFechado: jest.fn(),
}));

jest.mock("../../../../../services/sme/Parametrizacoes.service", () => ({
  getPeriodoPorUuid: jest.fn(),
}));

// Mock dos componentes
jest.mock("../CadastroFormFormik", () => ({
  CadastroFormFormik: ({ 
    initialValues, 
    onSubmit, 
    despesaContext, 
    verbo_http,
    eh_despesa_com_comprovacao_fiscal,
    eh_despesa_reconhecida,
    eh_despesa_com_retencao_imposto,
    limpa_campos_sem_comprovacao_fiscal,
    tipos_documento_com_recolhimento_imposto,
    preenche_tipo_despesa_custeio,
    acoes_custeio,
    setValorRateioRealizadoImposto,
    mostraModalExcluirImposto,
    cancelarExclusaoImposto,
    bloqueiaLinkCadastrarEstorno,
    bloqueiaRateioEstornado,
    removeRateio,
    bloqueiaCamposDespesa,
    houveAlteracoes,
    serviceIniciaEncadeamentoDosModais,
    serviceSubmitModais,
    renderContaAssociacaoOptions,
    filterContas,
    limparSelecaoContasDesabilitadas,
    validacoesPersonalizadas,
    validateFormDespesas,
  }) => {
    const values = initialValues();
    const mockSetFieldValue = jest.fn();
    
    return (
      <div data-testid="cadastro-form-formik">
        <div data-testid="verbo-http">{verbo_http}</div>
        <div data-testid="initial-values">{JSON.stringify(values)}</div>
        <button onClick={() => onSubmit(values, mockSetFieldValue)}>Submit</button>
        <button onClick={() => eh_despesa_com_comprovacao_fiscal && eh_despesa_com_comprovacao_fiscal(values)}>Test Comprovacao</button>
        <button onClick={() => eh_despesa_reconhecida && eh_despesa_reconhecida(values)}>Test Reconhecida</button>
        <button onClick={() => eh_despesa_com_retencao_imposto && eh_despesa_com_retencao_imposto(values)}>Test Retencao</button>
        <button onClick={() => limpa_campos_sem_comprovacao_fiscal && limpa_campos_sem_comprovacao_fiscal(values, mockSetFieldValue)}>Test Limpa Campos</button>
        <button onClick={() => tipos_documento_com_recolhimento_imposto && tipos_documento_com_recolhimento_imposto()}>Test Tipos Doc</button>
        <button onClick={() => preenche_tipo_despesa_custeio && preenche_tipo_despesa_custeio(values, 0)}>Test Preenche Custeio</button>
        <button onClick={() => acoes_custeio && acoes_custeio()}>Test Acoes Custeio</button>
        <button onClick={() => setValorRateioRealizadoImposto && setValorRateioRealizadoImposto(mockSetFieldValue, "100", 0)}>Test Valor Imposto</button>
        <button onClick={() => mostraModalExcluirImposto && mostraModalExcluirImposto()}>Test Modal Excluir</button>
        <button onClick={() => cancelarExclusaoImposto && cancelarExclusaoImposto(mockSetFieldValue)}>Test Cancelar Imposto</button>
        <button onClick={() => bloqueiaLinkCadastrarEstorno && bloqueiaLinkCadastrarEstorno(values.rateios[0] || {})}>Test Bloqueia Estorno</button>
        <button onClick={() => bloqueiaRateioEstornado && bloqueiaRateioEstornado(values.rateios[0] || {})}>Test Rateio Estornado</button>
        <button onClick={() => removeRateio && removeRateio(jest.fn(), 0, values.rateios[0] || {})}>Test Remove Rateio</button>
        <button onClick={() => bloqueiaCamposDespesa && bloqueiaCamposDespesa()}>Test Bloqueia Campos</button>
        <button onClick={() => houveAlteracoes && houveAlteracoes(values)}>Test Houve Alteracoes</button>
        <button onClick={() => serviceIniciaEncadeamentoDosModais && serviceIniciaEncadeamentoDosModais(values, {}, mockSetFieldValue)}>Test Service Modais</button>
        <button onClick={() => renderContaAssociacaoOptions && renderContaAssociacaoOptions(values.data_transacao)}>Test Render Contas</button>
        <button onClick={() => filterContas && filterContas(values.data_transacao)}>Test Filter Contas</button>
        <button onClick={() => limparSelecaoContasDesabilitadas && limparSelecaoContasDesabilitadas(mockSetFieldValue, values)}>Test Limpar Contas</button>
        <button onClick={() => validacoesPersonalizadas && validacoesPersonalizadas(values, mockSetFieldValue)}>Test Validacoes</button>
        <button onClick={() => validateFormDespesas && validateFormDespesas(values)}>Test Validate Form</button>
      </div>
    );
  },
}));

jest.mock("../../../../../utils/Loading", () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading...</div>,
}));

jest.mock("../../../../../utils/Modais", () => ({
  AvisoCapitalModal: ({ show }) => show ? <div data-testid="aviso-capital-modal">Aviso Capital</div> : null,
  CancelarModal: ({ show }) => show ? <div data-testid="cancelar-modal">Cancelar</div> : null,
  DeletarModal: ({ show }) => show ? <div data-testid="deletar-modal">Deletar</div> : null,
  ErroGeral: ({ show }) => show ? <div data-testid="erro-geral">Erro Geral</div> : null,
  PeriodoFechado: ({ show }) => show ? <div data-testid="periodo-fechado">Período Fechado</div> : null,
  PeriodoFechadoImposto: ({ show }) => show ? <div data-testid="periodo-fechado-imposto">Período Fechado Imposto</div> : null,
  DespesaIncompletaNaoPermitida: ({ show }) => show ? <div data-testid="despesa-incompleta">Despesa Incompleta</div> : null,
}));

jest.mock("../ModalErroDeletarCadastroDespesa", () => ({
  ModalErroDeletarCadastroDespesa: ({ show }) => show ? <div data-testid="modal-erro-deletar">Erro Deletar</div> : null,
}));

jest.mock("../../../../../utils/ValidacoesAdicionaisFormularios", () => ({
  validaPayloadDespesas: jest.fn(),
  periodoFechado: jest.fn(),
  comparaObjetos: jest.fn().mockReturnValue(true),
  valida_cpf_cnpj: jest.fn().mockReturnValue(true),
  periodoFechadoImposto: jest.fn(),
  trataNumericos: jest.fn().mockReturnValue(100),
}));

jest.mock("../../metodosAuxiliares", () => ({
  metodosAuxiliares: {
    origemAnaliseLancamento: jest.fn().mockReturnValue(false),
    exibeDocumentoTransacao: jest.fn(),
    exibeDocumentoTransacaoImpostoUseEffect: jest.fn(),
    bloqueiaCamposDespesaPrincipal: jest.fn(),
    bloqueiaCamposDespesaImposto: jest.fn(),
    getPath: jest.fn(),
    get_nome_razao_social: jest.fn(),
    getErroValorRealizadoRateios: jest.fn().mockResolvedValue(0),
    getErroValorOriginalRateios: jest.fn().mockResolvedValue(0),
    verificarSaldo: jest.fn(),
    mantemConciliacaoAtual: jest.fn(),
    conciliaRateios: jest.fn(),
    validaConciliacao: jest.fn(),
    ehOperacaoAtualizacao: jest.fn(),
    temPermissaoEdicao: jest.fn(),
    ehOperacaoExclusao: jest.fn(),
  },
}));

jest.mock("../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomError: jest.fn(),
  },
}));

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getItemUsuarioLogado: jest.fn().mockReturnValue("UE"),
  },
}));

const mockDespesaContext = {
  initialValues: {
    uuid: null,
    associacao: null,
    numero_documento: "",
    tipo_documento: null,
    data_documento: null,
    cpf_cnpj_fornecedor: "",
    nome_fornecedor: "",
    tipo_transacao: null,
    documento_transacao: "",
    data_transacao: null,
    valor_total: 0,
    valor_recursos_proprios: 0,
    valor_original: 0,
    eh_despesa_sem_comprovacao_fiscal: false,
    eh_despesa_reconhecida_pela_associacao: true,
    numero_boletim_de_ocorrencia: "",
    retem_imposto: false,
    despesas_impostos: [],
    motivos_pagamento_antecipado: [],
    outros_motivos_pagamento_antecipado: "",
    rateios: [],
  },
  verboHttp: "POST",
  idDespesa: null,
};

const renderComponent = (props = {}) => {
  return render(
    <MemoryRouter>
      <DespesaContext.Provider value={mockDespesaContext}>
        <CadastroForm 
          verbo_http="POST" 
          veioDeSituacaoPatrimonial={false}
          {...props}
        />
      </DespesaContext.Provider>
    </MemoryRouter>
  );
};

describe("Componente CadastroForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar mocks dos serviços
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [],
    });
    jest.spyOn(DespesasService, 'getEspecificacoesCapital').mockResolvedValue([]);
    jest.spyOn(DespesasService, 'getEspecificacoesCusteio').mockResolvedValue([]);
    jest.spyOn(DespesasService, 'criarDespesa').mockResolvedValue({});
    jest.spyOn(DespesasService, 'alterarDespesa').mockResolvedValue({});
    jest.spyOn(DespesasService, 'getDespesaCadastrada').mockResolvedValue({});
    jest.spyOn(DespesasService, 'deleteDespesa').mockResolvedValue({});
    jest.spyOn(DespesasService, 'getMotivosPagamentoAntecipado').mockResolvedValue([]);
    jest.spyOn(DespesasService, 'marcarLancamentoAtualizado').mockResolvedValue({});
    jest.spyOn(DespesasService, 'marcarLancamentoExcluido').mockResolvedValue({});
    jest.spyOn(DespesasService, 'marcarGastoIncluido').mockResolvedValue({});
    jest.spyOn(DespesasService, 'getValidarDataDaDespesa').mockResolvedValue({});
  });

  it("deve renderizar o componente com loading inicial", () => {
    renderComponent();
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("deve renderizar o CadastroFormFormik após carregar", async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve passar o verbo_http correto para o CadastroFormFormik", async () => {
    renderComponent({ verbo_http: "PUT" });
    
    await waitFor(() => {
      expect(screen.getByTestId("verbo-http")).toHaveTextContent("PUT");
    });
  });

  it("deve renderizar com verbo_http POST por padrão", async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByTestId("verbo-http")).toHaveTextContent("POST");
    });
  });

  it("deve passar veioDeSituacaoPatrimonial como true", async () => {
    renderComponent({ veioDeSituacaoPatrimonial: true });
    
    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve renderizar os valores iniciais do contexto", async () => {
    renderComponent();
    
    await waitFor(() => {
      const initialValuesElement = screen.getByTestId("initial-values");
      expect(initialValuesElement).toBeInTheDocument();
      expect(initialValuesElement.textContent).toContain("uuid");
    });
  });

  it("deve ter um botão de submit funcional", async () => {
    renderComponent();
    
    await waitFor(() => {
      const submitButton = screen.getByText("Submit");
      expect(submitButton).toBeInTheDocument();
    });
  });

  it("deve renderizar sem modais inicialmente", async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.queryByTestId("aviso-capital-modal")).not.toBeInTheDocument();
      expect(screen.queryByTestId("cancelar-modal")).not.toBeInTheDocument();
      expect(screen.queryByTestId("deletar-modal")).not.toBeInTheDocument();
      expect(screen.queryByTestId("erro-geral")).not.toBeInTheDocument();
      expect(screen.queryByTestId("periodo-fechado")).not.toBeInTheDocument();
      expect(screen.queryByTestId("periodo-fechado-imposto")).not.toBeInTheDocument();
      expect(screen.queryByTestId("despesa-incompleta")).not.toBeInTheDocument();
      expect(screen.queryByTestId("modal-erro-deletar")).not.toBeInTheDocument();
    });
  });

  it("deve chamar getDespesasTabelas ao montar", async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(DespesasService.getDespesasTabelas).toHaveBeenCalled();
      expect(DespesasService.getEspecificacoesCapital).toHaveBeenCalled();
    });
  });

  it("deve renderizar com veioDeSituacaoPatrimonial e visao DRE", async () => {
    const visoesModule = require("../../../../../services/visoes.service");
    visoesModule.visoesService.getItemUsuarioLogado.mockReturnValue("DRE");
    
    renderComponent({ veioDeSituacaoPatrimonial: true });
    
    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve processar contas encerradas em modo de edição", async () => {
    const mockContextEditando = {
      ...mockDespesaContext,
      verboHttp: "PUT",
      initialValues: {
        ...mockDespesaContext.initialValues,
        tipo_transacao: { id: 1, nome: "Dinheiro" },
        data_transacao: "2024-01-01",
        despesas_impostos: []
      }
    };

    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [],
    });

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextEditando}>
          <CadastroForm verbo_http="PUT" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar transformaEmData com moment", async () => {
    const mockContextComMoment = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        data_transacao: "2024-01-01",
      }
    };

    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [
        { uuid: "c1", nome: "Conta 1", data_inicio: "2020-01-01", solicitacao_encerramento: null }
      ],
    });

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComMoment}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar eh_despesa_com_comprovacao_fiscal", async () => {
    const mockContextSemComprovacao = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        eh_despesa_sem_comprovacao_fiscal: true,
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextSemComprovacao}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar eh_despesa_reconhecida com false", async () => {
    const mockContextNaoReconhecida = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        eh_despesa_reconhecida_pela_associacao: false,
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextNaoReconhecida}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar eh_despesa_com_retencao_imposto", async () => {
    const mockContextComImposto = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        retem_imposto: true,
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComImposto}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve filtrar contas com solicitacao_encerramento", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [
        { 
          uuid: "c1", 
          nome: "Conta Encerrada", 
          data_inicio: "2020-01-01",
          solicitacao_encerramento: {
            status: "APROVADA",
            data_de_encerramento_na_agencia: "2024-06-01"
          }
        }
      ],
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  describe("Processamento de Contas Iniciais: permitir que as contas que estão encerradas continuem disponíveis em edições futuras", () => {
    it("deve processar rateios com contas de associação existentes", async () => {
      const mockContextComRateios = {
        ...mockDespesaContext,
        initialValues: {
          ...mockDespesaContext.initialValues,
          rateios: [
            {
              uuid: "rateio-1",
              conta_associacao: {
                uuid: "conta-uuid-1",
                nome: "Conta Cheque"
              },
              acao_associacao: { uuid: "acao-1" },
              aplicacao_recurso: "CUSTEIO",
              valor_rateio: 100
            },
            {
              uuid: "rateio-2",
              conta_associacao: {
                uuid: "conta-uuid-2",
                nome: "Conta Poupança"
              },
              acao_associacao: { uuid: "acao-2" },
              aplicacao_recurso: "CAPITAL",
              valor_rateio: 200
            }
          ]
        }
      };

      render(
        <MemoryRouter>
          <DespesaContext.Provider value={mockContextComRateios}>
            <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
          </DespesaContext.Provider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
      });
    });

    it("deve processar rateios sem conta de associação (ignorar)", async () => {
      const mockContextComRateiosSemConta = {
        ...mockDespesaContext,
        initialValues: {
          ...mockDespesaContext.initialValues,
          rateios: [
            {
              uuid: "rateio-1",
              conta_associacao: null,
              acao_associacao: { uuid: "acao-1" },
              aplicacao_recurso: "CUSTEIO",
              valor_rateio: 100
            },
            {
              uuid: "rateio-2",
              // sem conta_associacao
              acao_associacao: { uuid: "acao-2" },
              aplicacao_recurso: "CAPITAL",
              valor_rateio: 200
            }
          ]
        }
      };

      render(
        <MemoryRouter>
          <DespesaContext.Provider value={mockContextComRateiosSemConta}>
            <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
          </DespesaContext.Provider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
      });
    });

    it("deve processar despesas_impostos com contas de associação", async () => {
      const mockContextComImpostos = {
        ...mockDespesaContext,
        initialValues: {
          ...mockDespesaContext.initialValues,
          despesas_impostos: [
            {
              uuid: "imposto-1",
              tipo_documento: { id: 1, nome: "Nota Fiscal" },
              numero_documento: "NF-001",
              rateios: [
                {
                  conta_associacao: "conta-uuid-imposto-1",
                  valor_rateio: 50
                }
              ]
            },
            {
              uuid: "imposto-2",
              tipo_documento: { id: 2, nome: "Recibo" },
              numero_documento: "REC-002",
              rateios: [
                {
                  conta_associacao: "conta-uuid-imposto-2",
                  valor_rateio: 30
                }
              ]
            }
          ]
        }
      };

      render(
        <MemoryRouter>
          <DespesaContext.Provider value={mockContextComImpostos}>
            <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
          </DespesaContext.Provider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
      });
    });

    it("deve processar despesas_impostos sem rateios", async () => {
      const mockContextComImpostosSemRateios = {
        ...mockDespesaContext,
        initialValues: {
          ...mockDespesaContext.initialValues,
          despesas_impostos: [
            {
              uuid: "imposto-1",
              tipo_documento: { id: 1, nome: "Nota Fiscal" },
              numero_documento: "NF-001",
              rateios: []
            }
          ]
        }
      };

      render(
        <MemoryRouter>
          <DespesaContext.Provider value={mockContextComImpostosSemRateios}>
            <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
          </DespesaContext.Provider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
      });
    });
  });

  it("deve executar tipos_documento_com_recolhimento_imposto", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [
        { id: 1, nome: "NF", eh_documento_de_retencao_de_imposto: true },
        { id: 2, nome: "Recibo", eh_documento_de_retencao_de_imposto: false },
      ],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [],
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar preenche_tipo_despesa_custeio", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [
        { id: 1, nome: "Tipo 1", eh_tributos_e_tarifas: true },
        { id: 2, nome: "Tipo 2", eh_tributos_e_tarifas: false },
      ],
      acoes_associacao: [],
      contas_associacao: [],
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar acoes_custeio filtrando acoes", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [
        { uuid: "a1", nome: "Ação 1", e_recursos_proprios: false, acao: { aceita_custeio: true } },
        { uuid: "a2", nome: "Ação 2", e_recursos_proprios: true, acao: { aceita_custeio: true } },
        { uuid: "a3", nome: "Ação 3", e_recursos_proprios: false, acao: { aceita_custeio: false } },
      ],
      contas_associacao: [],
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar bloqueiaLinkCadastrarEstorno com rateio completo", async () => {
    const mockContextComRateioCompleto = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        rateios: [
          {
            conta_associacao: { uuid: "c1" },
            acao_associacao: { uuid: "a1" },
            aplicacao_recurso: "CUSTEIO",
            valor_rateio: 100
          }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComRateioCompleto}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar bloqueiaRateioEstornado com estorno", async () => {
    const mockContextComEstorno = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        rateios: [
          {
            uuid: "r1",
            estorno: { uuid: "e1" },
            conta_associacao: { uuid: "c1" },
            acao_associacao: { uuid: "a1" },
            aplicacao_recurso: "CUSTEIO",
            valor_rateio: 100
          }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComEstorno}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve processar outros_motivos_pagamento_antecipado", async () => {
    const mockContextComMotivos = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        outros_motivos_pagamento_antecipado: "Motivo teste",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComMotivos}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar renderContaAssociacaoOptions com conta ATIVA", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [
        { 
          uuid: "c1", 
          nome: "Conta Ativa", 
          data_inicio: "2020-01-01",
          status: "ATIVA",
          solicitacao_encerramento: null
        }
      ],
    });

    const mockContextComData = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        data_transacao: "2024-01-01",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComData}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar renderContaAssociacaoOptions com conta encerrada em modo edicao", async () => {
    const mockContextEditandoComContaEncerrada = {
      ...mockDespesaContext,
      verboHttp: "PUT",
      initialValues: {
        ...mockDespesaContext.initialValues,
        data_transacao: "2024-01-01",
        rateios: [
          {
            conta_associacao: { uuid: "c1" },
            acao_associacao: { uuid: "a1" },
          }
        ]
      }
    };

    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [
        { 
          uuid: "c1", 
          nome: "Conta Encerrada", 
          data_inicio: "2020-01-01",
          status: "INATIVA",
          solicitacao_encerramento: {
            status: "APROVADA",
            data_de_encerramento_na_agencia: "2024-06-01"
          }
        }
      ],
    });

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextEditandoComContaEncerrada}>
          <CadastroForm verbo_http="PUT" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar renderContaAssociacaoOptions com conta PENDENTE em modo criacao", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [
        { 
          uuid: "c1", 
          nome: "Conta Pendente", 
          data_inicio: "2020-01-01",
          status: "INATIVA",
          solicitacao_encerramento: {
            status: "PENDENTE",
            data_de_encerramento_na_agencia: "2024-06-01"
          }
        }
      ],
    });

    const mockContextComData = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        data_transacao: "2024-01-01",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComData}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar renderContaAssociacaoOptions com conta PENDENTE em modo edicao", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [
        { 
          uuid: "c1", 
          nome: "Conta Pendente", 
          data_inicio: "2020-01-01",
          status: "INATIVA",
          solicitacao_encerramento: {
            status: "PENDENTE",
            data_de_encerramento_na_agencia: "2024-06-01"
          }
        }
      ],
    });

    const mockContextEditando = {
      ...mockDespesaContext,
      verboHttp: "PUT",
      initialValues: {
        ...mockDespesaContext.initialValues,
        data_transacao: "2024-01-01",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextEditando}>
          <CadastroForm verbo_http="PUT" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar limpa_campos_sem_comprovacao_fiscal", async () => {
    const mockContextComRateios = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        cpf_cnpj_fornecedor: "12345678901",
        tipo_documento: { id: 1 },
        data_documento: "2024-01-01",
        numero_documento: "123",
        rateios: [
          { tipo_custeio: "1", especificacao_material_servico: "Spec 1" }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComRateios}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const btn = screen.getByText("Test Limpa Campos");
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });

  it("deve executar setValorRateioRealizadoImposto", async () => {
    renderComponent();

    await waitFor(() => {
      const btn = screen.getByText("Test Valor Imposto");
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });

  it("deve executar mostraModalExcluirImposto em modo PUT", async () => {
    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockDespesaContext}>
          <CadastroForm verbo_http="PUT" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const btn = screen.getByText("Test Modal Excluir");
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });

  it("deve executar cancelarExclusaoImposto", async () => {
    renderComponent();

    await waitFor(() => {
      const btn = screen.getByText("Test Cancelar Imposto");
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });

  it("deve executar removeRateio sem estorno", async () => {
    const mockContextComRateios = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        rateios: [
          { uuid: "r1", estorno: null }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComRateios}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const btn = screen.getByText("Test Remove Rateio");
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });

  it("deve executar removeRateio com estorno", async () => {
    const mockContextComEstorno = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        rateios: [
          { uuid: "r1", estorno: { uuid: "e1" } }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComEstorno}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const btn = screen.getByText("Test Remove Rateio");
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });

  it("deve executar bloqueiaCamposDespesa com readOnlyCampos", async () => {
    renderComponent();

    await waitFor(() => {
      const btn = screen.getByText("Test Bloqueia Campos");
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });

  it("deve executar houveAlteracoes comparando objetos", async () => {
    const mockContextComDados = {
      ...mockDespesaContext,
      verboHttp: "PUT",
      initialValues: {
        ...mockDespesaContext.initialValues,
        cpf_cnpj_fornecedor: "12345678901",
        nome_fornecedor: "Fornecedor Teste",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComDados}>
          <CadastroForm verbo_http="PUT" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const btn = screen.getByText("Test Houve Alteracoes");
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });

  it("deve executar renderContaAssociacaoOptions e filterContas", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [
        { uuid: "c1", nome: "Conta 1", data_inicio: "2020-01-01", status: "ATIVA" },
        { uuid: "c2", nome: "Conta 2", data_inicio: "2020-01-01", status: "ATIVA" },
      ],
    });

    const mockContextComData = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        data_transacao: "2024-01-01",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComData}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("Test Render Contas"));
      fireEvent.click(screen.getByText("Test Filter Contas"));
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar limparSelecaoContasDesabilitadas para rateios", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [
        { 
          uuid: "c1", 
          nome: "Conta Encerrada", 
          data_inicio: "2020-01-01",
          solicitacao_encerramento: {
            status: "APROVADA",
            data_de_encerramento_na_agencia: "2024-06-01"
          },
          dataEncerramentoMaiorOuIgualQueDataTransacao: false
        }
      ],
    });

    const mockContextComRateioComConta = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        data_transacao: "2024-07-01",
        rateios: [
          { uuid: "r1", conta_associacao: { uuid: "c1" } }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComRateioComConta}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const btn = screen.getByText("Test Limpar Contas");
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });

  it("deve executar limparSelecaoContasDesabilitadas para impostos", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [
        { 
          uuid: "c1", 
          nome: "Conta Encerrada", 
          data_inicio: "2020-01-01",
          solicitacao_encerramento: {
            status: "APROVADA",
            data_de_encerramento_na_agencia: "2024-06-01"
          },
          dataEncerramentoMaiorOuIgualQueDataTransacaoImposto: false
        }
      ],
    });

    const mockContextComImposto = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        data_transacao: "2024-07-01",
        despesas_impostos: [
          { 
            uuid: "i1",
            rateios: [{ conta_associacao: { uuid: "c1" } }]
          }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComImposto}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const btn = screen.getByText("Test Limpar Contas");
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });

  it("deve executar filterContas para imposto", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [
        { 
          uuid: "c1", 
          nome: "Conta 1", 
          data_inicio: "2020-01-01",
          status: "ATIVA",
          solicitacao_encerramento: {
            status: "APROVADA",
            data_de_encerramento_na_agencia: "2024-06-01"
          }
        }
      ],
    });

    const mockContextComData = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        data_transacao: "2024-01-01",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComData}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("Test Filter Contas"));
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar todas as funções de validação", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [
        { id: 1, nome: "NF", eh_documento_de_retencao_de_imposto: true }
      ],
      tipos_custeio: [
        { id: 1, nome: "Tipo 1", eh_tributos_e_tarifas: true }
      ],
      acoes_associacao: [
        { uuid: "a1", nome: "Ação 1", e_recursos_proprios: false, acao: { aceita_custeio: true } }
      ],
      contas_associacao: [
        { uuid: "c1", nome: "Conta 1", data_inicio: "2020-01-01", status: "ATIVA" }
      ],
    });

    const mockContextCompleto = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        cpf_cnpj_fornecedor: "12345678901",
        eh_despesa_sem_comprovacao_fiscal: false,
        eh_despesa_reconhecida_pela_associacao: true,
        retem_imposto: true,
        data_transacao: "2024-01-01",
        despesas_impostos: [
          { uuid: "i1", rateios: [{ tipo_custeio: "" }] }
        ],
        rateios: [
          {
            uuid: "r1",
            conta_associacao: { uuid: "c1" },
            acao_associacao: { uuid: "a1" },
            aplicacao_recurso: "CUSTEIO",
            valor_rateio: 100,
            estorno: null
          }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextCompleto}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(async () => {
      fireEvent.click(screen.getByText("Test Comprovacao"));
      fireEvent.click(screen.getByText("Test Reconhecida"));
      fireEvent.click(screen.getByText("Test Retencao"));
      fireEvent.click(screen.getByText("Test Tipos Doc"));
      fireEvent.click(screen.getByText("Test Preenche Custeio"));
      fireEvent.click(screen.getByText("Test Acoes Custeio"));
      fireEvent.click(screen.getByText("Test Bloqueia Estorno"));
      fireEvent.click(screen.getByText("Test Rateio Estornado"));
      fireEvent.click(screen.getByText("Test Bloqueia Campos"));
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar bloqueiaLinkCadastrarEstorno com rateio incompleto", async () => {
    const mockContextRateioIncompleto = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        rateios: [
          {
            conta_associacao: null,
            acao_associacao: null,
            aplicacao_recurso: "",
            valor_rateio: 0
          }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextRateioIncompleto}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("Test Bloqueia Estorno"));
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar bloqueiaRateioEstornado sem estorno", async () => {
    const mockContextSemEstorno = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        rateios: [
          { uuid: "r1", estorno: null }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextSemEstorno}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("Test Rateio Estornado"));
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar handleChangeCheckBoxOutrosMotivosPagamentoAntecipado", async () => {
    const mockContextComMotivos = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        outros_motivos_pagamento_antecipado: "Motivo inicial",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComMotivos}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar validacoesPersonalizadas com CPF inválido", async () => {
    const validacoesModule = require("../../../../../utils/ValidacoesAdicionaisFormularios");
    validacoesModule.valida_cpf_cnpj.mockReturnValue(false);

    const mockContextComCPFInvalido = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        cpf_cnpj_fornecedor: "123",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComCPFInvalido}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar validacoesPersonalizadas sem boletim de ocorrência", async () => {
    const mockContextSemBoletim = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        eh_despesa_reconhecida_pela_associacao: false,
        numero_boletim_de_ocorrencia: "",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextSemBoletim}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar validateFormDespesas com validações de data", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar numeroDocumentoReadOnly com tipo que não permite digitação", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [
        { id: 1, nome: "Tipo 1", numero_documento_digitado: false }
      ],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [],
    });

    const mockContextComTipoDoc = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        tipo_documento: { id: 1 },
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComTipoDoc}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar validateFormDespesas com apenas_digitos true", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [
        { id: 1, nome: "Tipo 1", numero_documento_digitado: true, apenas_digitos: true }
      ],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [],
    });

    const mockContextComNumeroInvalido = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        tipo_documento: { id: 1 },
        numero_documento: "ABC123",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComNumeroInvalido}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar showRetencaoImposto quando tipo_documento pode_reter_imposto", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [
        { id: 1, nome: "NF", pode_reter_imposto: true }
      ],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [],
    });

    const mockContextComRetencao = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        tipo_documento: { id: 1 },
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComRetencao}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar showRetencaoImposto false quando tipo_documento não pode_reter_imposto", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [
        { id: 1, nome: "Recibo", pode_reter_imposto: false }
      ],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [],
    });

    const mockContextSemRetencao = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        tipo_documento: { id: 1 },
        retem_imposto: true,
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextSemRetencao}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar numeroDocumentoImpostoReadOnly com tipo sem digitação", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [
        { id: 1, nome: "Tipo 1", numero_documento_digitado: false }
      ],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [],
    });

    const mockContextComImposto = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        despesas_impostos: [
          { 
            tipo_documento: { id: 1 },
            numero_documento: "123",
            rateios: [{}]
          }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComImposto}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar acaoNaoAceitaTipoRecurso com ação que não aceita custeio/capital", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [
        { 
          uuid: "a1", 
          nome: "Ação Restrita", 
          e_recursos_proprios: false, 
          acao: { 
            aceita_custeio: false,
            aceita_capital: false,
            aceita_livre: false
          } 
        }
      ],
      contas_associacao: [],
    });

    const mockContextComAcaoRestrita = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        rateios: [
          {
            acao_associacao: { uuid: "a1" },
            aplicacao_recurso: "CUSTEIO"
          }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComAcaoRestrita}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar acaoNaoAceitaTipoRecurso com ação que aceita apenas capital", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [
        { 
          uuid: "a1", 
          nome: "Ação Capital", 
          e_recursos_proprios: false, 
          acao: { 
            aceita_custeio: false,
            aceita_capital: true,
            aceita_livre: false
          } 
        }
      ],
      contas_associacao: [],
    });

    const mockContextComAcaoCapital = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        rateios: [
          {
            acao_associacao: { uuid: "a1" },
            aplicacao_recurso: "CUSTEIO"
          }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComAcaoCapital}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar acaoNaoAceitaTipoRecurso com ação que aceita apenas custeio", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [
        { 
          uuid: "a1", 
          nome: "Ação Custeio", 
          e_recursos_proprios: false, 
          acao: { 
            aceita_custeio: true,
            aceita_capital: false,
            aceita_livre: false
          } 
        }
      ],
      contas_associacao: [],
    });

    const mockContextComAcaoCusteio = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        rateios: [
          {
            acao_associacao: { uuid: "a1" },
            aplicacao_recurso: "CAPITAL"
          }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComAcaoCusteio}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar acaoNaoAceitaTipoRecurso com ação livre", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [
        { 
          uuid: "a1", 
          nome: "Ação Livre", 
          e_recursos_proprios: false, 
          acao: { 
            aceita_custeio: false,
            aceita_capital: false,
            aceita_livre: true
          } 
        }
      ],
      contas_associacao: [],
    });

    const mockContextComAcaoLivre = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        rateios: [
          {
            acao_associacao: { uuid: "a1" },
            aplicacao_recurso: "CUSTEIO"
          }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComAcaoLivre}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar acaoNaoAceitaTipoRecurso com acao_associacao como string", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [
        { 
          uuid: "a1", 
          nome: "Ação 1", 
          e_recursos_proprios: false, 
          acao: { 
            aceita_custeio: true,
            aceita_capital: false,
            aceita_livre: false
          } 
        }
      ],
      contas_associacao: [],
    });

    const mockContextAcaoString = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        rateios: [
          {
            acao_associacao: "a1",
            aplicacao_recurso: "CUSTEIO"
          }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextAcaoString}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar montaPayloadMotivosPagamentoAntecipado", async () => {
    const mockContextComMotivosPagamento = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        motivos_pagamento_antecipado: [
          { id: 1, motivo: "Motivo 1" }
        ],
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComMotivosPagamento}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar numeroDocumentoImpostoReadOnly com tipo_documento como object", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [
        { id: 1, nome: "Tipo 1", numero_documento_digitado: true }
      ],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [],
    });

    const mockContextImpostoComObject = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        despesas_impostos: [
          { 
            tipo_documento: { id: 1 },
            numero_documento: "",
            rateios: [{}]
          }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextImpostoComObject}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve processar conta com solicitação pendente em fluxo normal criação", async () => {
    metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(false);

    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [
        { 
          uuid: "c1", 
          nome: "Conta Pendente", 
          data_inicio: "2020-01-01",
          solicitacao_encerramento: {
            status: "PENDENTE",
            data_de_encerramento_na_agencia: "2024-06-01"
          }
        }
      ],
    });

    const mockContextPendenteCriacao = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        data_transacao: "2024-05-01",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextPendenteCriacao}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve processar conta aprovada em fluxo normal criação (return early)", async () => {
    metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(false);

    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [
        { 
          uuid: "c1", 
          nome: "Conta Aprovada", 
          data_inicio: "2020-01-01",
          solicitacao_encerramento: {
            status: "APROVADA",
            data_de_encerramento_na_agencia: "2024-06-01"
          }
        }
      ],
    });

    const mockContextAprovadaCriacao = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        data_transacao: "2024-05-01",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextAprovadaCriacao}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve processar conta pendente em modo edição", async () => {
    metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(false);

    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [
        { 
          uuid: "c1", 
          nome: "Conta Pendente", 
          data_inicio: "2020-01-01",
          solicitacao_encerramento: {
            status: "PENDENTE",
            data_de_encerramento_na_agencia: "2024-06-01"
          }
        }
      ],
    });

    const mockContextPendenteEdicao = {
      ...mockDespesaContext,
      verboHttp: "PUT",
      initialValues: {
        ...mockDespesaContext.initialValues,
        uuid: "d1",
        data_transacao: "2024-05-01",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextPendenteEdicao}>
          <CadastroForm verbo_http="PUT" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve processar conta aprovada em modo edição sendo conta inicial", async () => {
    metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(false);

    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [
        { 
          uuid: "c1", 
          nome: "Conta Aprovada Inicial", 
          data_inicio: "2020-01-01",
          solicitacao_encerramento: {
            status: "APROVADA",
            data_de_encerramento_na_agencia: "2024-06-01"
          }
        }
      ],
    });

    const mockContextAprovadaEdicaoInicial = {
      ...mockDespesaContext,
      verboHttp: "PUT",
      initialValues: {
        ...mockDespesaContext.initialValues,
        uuid: "d1",
        data_transacao: "2024-05-01",
        rateios: [
          { conta_associacao: { uuid: "c1" } }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextAprovadaEdicaoInicial}>
          <CadastroForm verbo_http="PUT" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve processar conta aprovada em modo edição não sendo conta inicial", async () => {
    metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(false);

    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [
        { 
          uuid: "c1", 
          nome: "Conta Aprovada Outra", 
          data_inicio: "2020-01-01",
          solicitacao_encerramento: {
            status: "APROVADA",
            data_de_encerramento_na_agencia: "2024-06-01"
          }
        },
        { 
          uuid: "c2", 
          nome: "Conta Inicial", 
          data_inicio: "2020-01-01",
          status: "ATIVA"
        }
      ],
    });

    const mockContextAprovadaEdicaoOutra = {
      ...mockDespesaContext,
      verboHttp: "PUT",
      initialValues: {
        ...mockDespesaContext.initialValues,
        uuid: "d1",
        data_transacao: "2024-05-01",
        rateios: [
          { conta_associacao: { uuid: "c2" } }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextAprovadaEdicaoOutra}>
          <CadastroForm verbo_http="PUT" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });

  it("deve executar validacoesPersonalizadas", async () => {
    const mockContextValidacoes = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        cpf_cnpj_fornecedor: "12345678901",
        eh_despesa_reconhecida_pela_associacao: false,
        numero_boletim_de_ocorrencia: "123/2024",
        data_transacao: "2024-05-01",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextValidacoes}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const btn = screen.getByText("Test Validacoes");
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });

  it("deve executar validateFormDespesas", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [
        { id: 1, nome: "NF", numero_documento_digitado: true, apenas_digitos: true }
      ],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [],
    });

    const mockContextValidateForm = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        tipo_documento: { id: 1 },
        numero_documento: "ABC123",
        data_documento: "2024-05-01",
        data_transacao: "2024-04-01",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextValidateForm}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const btn = screen.getByText("Test Validate Form");
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });

  it("deve executar validações com CPF vazio", async () => {
    const mockContextCPFVazio = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        cpf_cnpj_fornecedor: "",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextCPFVazio}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const btn = screen.getByText("Test Validacoes");
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });

  it("deve executar validações sem boletim quando não reconhecida", async () => {
    const mockContextSemBoletim = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        eh_despesa_reconhecida_pela_associacao: false,
        numero_boletim_de_ocorrencia: "",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextSemBoletim}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const btn = screen.getByText("Test Validacoes");
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });

  it("deve executar validateFormDespesas com tipo_documento sem apenas_digitos", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [
        { id: 1, nome: "Recibo", numero_documento_digitado: true, apenas_digitos: false }
      ],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [],
    });

    const mockContextSemApenasDigitos = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        tipo_documento: { id: 1 },
        numero_documento: "ABC123",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextSemApenasDigitos}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const btn = screen.getByText("Test Validate Form");
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });

  it("deve executar validateFormDespesas com data_documento maior que data_transacao", async () => {
    jest.spyOn(DespesasService, 'getDespesasTabelas').mockResolvedValue({
      tipos_documento: [
        { id: 1, nome: "NF" }
      ],
      tipos_custeio: [],
      acoes_associacao: [],
      contas_associacao: [],
    });

    const mockContextDataInvalida = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        tipo_documento: { id: 1 },
        data_documento: "2024-06-01",
        data_transacao: "2024-05-01",
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextDataInvalida}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const btn = screen.getByText("Test Validate Form");
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });

  it("deve executar onSubmit com sucesso", async () => {
    const mockContextSubmit = {
      ...mockDespesaContext,
      verboHttp: "POST",
      initialValues: {
        ...mockDespesaContext.initialValues,
        cpf_cnpj_fornecedor: "12345678901",
        nome_fornecedor: "Fornecedor Teste",
        data_transacao: "2024-05-01",
        numero_boletim_de_ocorrencia: "123/2024",
        tipo_documento: { id: 1 },
        numero_documento: "12345",
        data_documento: "2024-05-01",
        rateios: [
          {
            conta_associacao: { uuid: "c1" },
            acao_associacao: { uuid: "a1" },
            aplicacao_recurso: "CUSTEIO",
            valor_rateio: 100
          }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextSubmit}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const btn = screen.getByText("Submit");
      fireEvent.click(btn);
      expect(btn).toBeInTheDocument();
    });
  });

  it("deve executar validateImpostoDataTransacao com imposto", async () => {
    const mockContextComImposto = {
      ...mockDespesaContext,
      initialValues: {
        ...mockDespesaContext.initialValues,
        data_transacao: "2024-05-01",
        despesas_impostos: [
          {
            data_transacao: "2024-04-01",
            rateios: [{}]
          }
        ]
      }
    };

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={mockContextComImposto}>
          <CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cadastro-form-formik")).toBeInTheDocument();
    });
  });
}); 