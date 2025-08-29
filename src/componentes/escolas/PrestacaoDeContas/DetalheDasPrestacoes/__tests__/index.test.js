import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { DetalheDasPrestacoes } from "../index";
import { BrowserRouter } from "react-router-dom";
import * as prestacaoService from "../../../../../services/escolas/PrestacaoDeContas.service";
import * as associacaoService from "../../../../../services/escolas/Associacao.service";
import * as receitaService from "../../../../../services/escolas/Receitas.service";
import { SidebarContext } from "../../../../../context/Sidebar";
import { useParams, useLocation } from 'react-router-dom';
import * as tabelaValoresPendentesService from "../../../../../services/escolas/TabelaValoresPendentesPorAcao.service";

jest.mock("../../../../../services/escolas/TabelaValoresPendentesPorAcao.service");
jest.mock("../../../../../services/escolas/PrestacaoDeContas.service");
jest.mock("../../../../../services/escolas/Receitas.service");
jest.mock("../../../../../services/escolas/Associacao.service");
jest.mock("../../../../../services/escolas/Despesas.service");
jest.mock("../../../../../services/auth.service", () => ({
  ASSOCIACAO_UUID: "associacao-uuid",
}));

jest.mock("../../../../../services/SideBarLeft.service", () => ({
  SidebarLeftService: {
    setItemActive: jest.fn()
  }
}));

jest.mock('../../../../../utils/ValidacoesAdicionaisFormularios', () => ({
  exibeDataPT_BR: (data) => `formatada-${data}`,
}));

jest.mock("../../../../../utils/ValidacoesAdicionaisFormularios", () => ({
  trataNumericos: (v) => v,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));


jest.mock("../../../../../services/auth.service", () => ({
    authService:{
        logout: jest.fn(),
        isLoggedIn: jest.fn(),
    }
}));

const mockSidebarContext = {
  setIrParaUrl: jest.fn(),
};

const renderComponent = () =>
  render(
    <SidebarContext.Provider value={mockSidebarContext}>
      <BrowserRouter>
        <DetalheDasPrestacoes />
      </BrowserRouter>
    </SidebarContext.Provider>
  );

describe("DetalheDasPrestacoes", () => {

    beforeEach(() => {
      jest.clearAllMocks();

      localStorage.setItem('ASSOCIACAO_UUID', 'associacao-uuid');

      receitaService.getTabelasReceita.mockResolvedValue({ data: { acoes_associacao: [] } });
      associacaoService.getContas.mockResolvedValue([{ uuid: 'conta-uuid', conta: 'conta-nome', tipo_conta: { nome: 'conta-tipo' } }]);
      prestacaoService.getObservacoes.mockResolvedValue({
        possui_solicitacao_encerramento: true,
        data_encerramento: '2025-07-05',
        data_extrato: '2025-07-05',
        saldo_extrato: 100,
        saldo_encerramento: '2025-07-05',
      });
      prestacaoService.getStatusPeriodoPorData.mockResolvedValue({ prestacao_contas_status: { periodo_bloqueado: false } });
      associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao.mockResolvedValue([{ uuid: 'periodo-uuid' }]);
      tabelaValoresPendentesService.tabelaValoresPendentes.mockResolvedValue([]);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("lança getTabelasReceita com erro", async () => {
        receitaService.getTabelasReceita.mockRejectedValue({});
        associacaoService.getContas.mockResolvedValue([]);
        useParams.mockReturnValue({ periodo_uuid: 'periodo-uuid' });

        renderComponent();
        expect(screen.getByText(/Conciliação Bancária/i)).toBeInTheDocument();
        expect(screen.getByText(/Selecione um período/i)).toBeInTheDocument();
    });

    it("renderiza o componente com loading inicial e periodo_uuid COM parâmetro de url (if em getPeriodoConta())", async () => {
        associacaoService.getContas.mockResolvedValue([]);
        useParams.mockReturnValue({ periodo_uuid: 'periodo-uuid' });

        renderComponent();
        expect(screen.getByText(/Conciliação Bancária/i)).toBeInTheDocument();
        expect(screen.getByText(/Selecione um período/i)).toBeInTheDocument();
    });

    it("renderiza o componente e periodo_uuid SEM parâmetro de url (else if em getPeriodoConta())", async () => {
      const ls = JSON.stringify({ periodo: 'periodo-uuid', conta: 'conta-uuid' });
      localStorage.setItem('periodoConta', ls);
      useParams.mockReturnValue({ periodo_uuid: null });

      renderComponent();

      await waitFor(() => {
        expect(localStorage.getItem('periodoConta')).toBe(ls);
        expect(receitaService.getTabelasReceita).toHaveBeenCalledTimes(1);
        expect(associacaoService.getContas).toHaveBeenCalledTimes(1);
        expect(prestacaoService.getObservacoes).toHaveBeenCalledTimes(1);
      });
    });

    it("renderiza o componente e carregaObservacoes em (if(periodosAssociacao) em carregaObservacoes())", async () => {
        const ls = JSON.stringify({periodo: 'periodo-uuid', conta: 'conta-uuid'})
        localStorage.setItem('periodoConta', ls);
        useParams.mockReturnValue({ periodo_uuid: 'periodo-uuid', conta_uuid: 'conta-uuid' });
        associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao.mockResolvedValue(true);

        renderComponent();

        await waitFor(() => {
            expect(localStorage.getItem('periodoConta')).toBe(ls);
            expect(receitaService.getTabelasReceita).toHaveBeenCalledTimes(1);
            expect(associacaoService.getContas).toHaveBeenCalledTimes(1);
        });
    });
    
    it("renderiza o componente e periodo_uuid SEM parâmetro de url e SEM localStorage periodoConta (else em getPeriodoConta())", async () => {
        const ls = JSON.stringify({periodo: '', conta: ''})
        localStorage.removeItem('periodoConta');
        useParams.mockReturnValue({ periodo_uuid: null });

        renderComponent();
        expect(receitaService.getTabelasReceita).toHaveBeenCalledTimes(1);
        expect(associacaoService.getContas).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem('periodoConta')).toBe(ls);
    });

    it("renderiza o componente e cobre a função getAcaoLancamento quando HÁ dado em localStorage (if em getAcaoLancamento())", async () => {
        const ls = JSON.stringify({acao: 'acao-uuid', lancamento: 'lancamento-uuid'})
        localStorage.setItem('acaoLancamento', ls);
        useParams.mockReturnValue({ periodo_uuid: null });

        renderComponent();
        expect(localStorage.getItem('acaoLancamento')).toBe(ls);
    });

    it("renderiza o componente e valida se getPeriodosDePrestacaoDeContasDaAssociacao foi chamado", async () => {
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue({prestacao_contas_status: {periodo_bloqueado: false}});
        associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao.mockResolvedValue([{uuid: 'periodo-uuid'}]);
        useParams.mockReturnValue({ periodo_uuid: 'periodo-uuid' });

        renderComponent();

        expect(associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem('ASSOCIACAO_UUID')).toBe('associacao-uuid');
    });

    it("renderiza o componente e clica em Voltar para Análise DRE", async () => {
        localStorage.setItem('ASSOCIACAO_UUID', 'associacao-uuid');
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue({prestacao_contas_status: {periodo_bloqueado: false}});
        associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao.mockResolvedValue([{uuid: 'periodo-uuid'}]);
        useParams.mockReturnValue({ periodo_uuid: 'periodo-uuid' });
        useLocation.mockReturnValue({
            state: {
                origem: 'ir_para_conciliacao_bancaria',
                prestacaoDeContasUuid: 'prestacao-uuid',
                periodoFormatado: 'periodo-formatado'
            }
        });

        renderComponent();

        const botaoVoltarParaAnalise = screen.getByRole('button', { name: 'Voltar para Análise DRE' });
        expect(botaoVoltarParaAnalise).toBeInTheDocument();
        fireEvent.click(botaoVoltarParaAnalise);

        expect(associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao).toHaveBeenCalledTimes(1);
        expect(useLocation).toHaveBeenCalled();
    });

    it("renderiza o componente e alterando o campo Data Saldo", async () => {
        const ls = JSON.stringify({periodo: 'periodo-uuid', conta: 'conta-uuid'})
        localStorage.setItem('periodoConta', ls);

        prestacaoService.getStatusPeriodoPorData.mockResolvedValue({prestacao_contas_status: {periodo_bloqueado: false}});
        associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao.mockResolvedValue([{uuid: 'periodo-uuid'}]);
        useParams.mockReturnValue({ periodo_uuid: null });
        useLocation.mockReturnValue({
            state: {
                origem: 'ir_para_conciliacao_bancaria',
                prestacaoDeContasUuid: 'prestacao-uuid',
                periodoFormatado: 'periodo-formatado'
            }
        });

        renderComponent();

        const campoDataSaldo = await screen.findByLabelText(/Data/i);
        fireEvent.change(campoDataSaldo, { target: { value: "05/07/2025" } });
        await waitFor(() => {
          expect(campoDataSaldo).toHaveValue("05/07/2025");
        });
        expect(useLocation).toHaveBeenCalled();
        expect(useParams).toHaveBeenCalled();
    });
});