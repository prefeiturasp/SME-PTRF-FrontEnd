import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CadastroForm } from "../CadastroForm";
import { MemoryRouter } from "react-router-dom";
import { DespesaContext } from "../../../../../context/Despesa";
import * as DespesasService from "../../../../../services/escolas/Despesas.service";

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
  CadastroFormFormik: ({ initialValues, onSubmit, despesaContext, verbo_http }) => (
    <div data-testid="cadastro-form-formik">
      <div data-testid="verbo-http">{verbo_http}</div>
      <div data-testid="initial-values">{JSON.stringify(initialValues())}</div>
      <button onClick={() => onSubmit({}, jest.fn())}>Submit</button>
    </div>
  ),
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
  comparaObjetos: jest.fn(),
  valida_cpf_cnpj: jest.fn(),
  periodoFechadoImposto: jest.fn(),
  trataNumericos: jest.fn(),
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
}); 