import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { DetalheDasPrestacoes } from "../index";
import { BrowserRouter } from "react-router-dom";
import * as prestacaoService from "../../../../../services/escolas/PrestacaoDeContas.service";
import * as associacaoService from "../../../../../services/escolas/Associacao.service";
import * as receitaService from "../../../../../services/escolas/Receitas.service";
import { SidebarContext } from "../../../../../context/Sidebar";
import { useParams, useLocation } from 'react-router-dom';
import * as tabelaValoresPendentesService from "../../../../../services/escolas/TabelaValoresPendentesPorAcao.service";
import { conciliacaoStorageService } from "../../../../../services/storages/Conciliacao.storage.service";

jest.mock("../../../../../services/escolas/TabelaValoresPendentesPorAcao.service");
jest.mock("../../../../../services/storages/Conciliacao.storage.service", () => ({
    conciliacaoStorageService: {
        getPeriodoConta: jest.fn(),
        setPeriodoConta: jest.fn(),
        removePeriodoConta: jest.fn(),
    },
}));
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

jest.mock('../../../../../componentes/Globais/ReactNumberFormatInput/indexv2', () => ({
  __esModule: true,
  ReactNumberFormatInputV2: (props) => <input data-testid="react-number-format-mock" {...props} />,
}));

jest.mock('../../../../../componentes/Globais/ReactNumberFormatInput', () => ({
  __esModule: true,
  ReactNumberFormatInput: (props) => <input data-testid="react-format-input-mock" {...props} />,
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

const criaPromiseControlada = () => {
  let resolver;
  let rejeitador;
  const promise = new Promise((resolve, reject) => {
    resolver = resolve;
    rejeitador = reject;
  });

  return { promise, resolver, rejeitador };
};

describe("DetalheDasPrestacoes", () => {

    beforeEach(() => {
      jest.clearAllMocks();

      useParams.mockReturnValue({ periodo_uuid: null });
      useLocation.mockReturnValue({ state: null });
      conciliacaoStorageService.getPeriodoConta.mockReturnValue(null);

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
      conciliacaoStorageService.getPeriodoConta.mockReturnValue({ periodo: 'periodo-uuid', conta: 'conta-uuid' });
      associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao.mockResolvedValue([{
          uuid: 'periodo-uuid',
          referencia: '2025',
          data_inicio_realizacao_despesas: '2025-01-01',
          data_fim_realizacao_despesas: '2025-12-31',
      }]);
      useParams.mockReturnValue({ periodo_uuid: null });

      renderComponent();

      await waitFor(() => {
        expect(receitaService.getTabelasReceita).toHaveBeenCalledTimes(1);
        expect(associacaoService.getContas).toHaveBeenCalledTimes(1);
        expect(prestacaoService.getObservacoes).toHaveBeenCalledTimes(1);
      });
    });

    it("renderiza o componente e carregaObservacoes em (if(periodosAssociacao) em carregaObservacoes())", async () => {
        const ls = JSON.stringify({periodo: 'periodo-uuid', conta: 'conta-uuid'})
        localStorage.setItem('periodoConta', ls);
        useParams.mockReturnValue({ periodo_uuid: 'periodo-uuid', conta_uuid: 'conta-uuid' });
        associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao.mockResolvedValue([{uuid: 'periodo-uuid', referencia: '2025', data_inicio_realizacao_despesas: '2025-01-01', data_fim_realizacao_despesas: '2025-12-31'}]);

        renderComponent();

        await waitFor(() => {
            expect(localStorage.getItem('periodoConta')).toBe(ls);
            expect(receitaService.getTabelasReceita).toHaveBeenCalledTimes(1);
            expect(associacaoService.getContas).toHaveBeenCalledTimes(1);
        });
    });

    it("renderiza o componente e periodo_uuid SEM parâmetro de url e SEM localStorage periodoConta (else em getPeriodoConta())", async () => {
        useParams.mockReturnValue({ periodo_uuid: null });
        // conciliacaoStorageService.getPeriodoConta returns null (default from beforeEach)

        renderComponent();
        await waitFor(() => {
            expect(receitaService.getTabelasReceita).toHaveBeenCalledTimes(1);
        });
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

        await waitFor(() => {
            expect(associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao).toHaveBeenCalledTimes(1);
        });
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

        await waitFor(() => {
            expect(associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao).toHaveBeenCalledTimes(1);
        });
        expect(useLocation).toHaveBeenCalled();
    });

    it("renderiza o componente e alterando o campo Data Saldo", async () => {
        conciliacaoStorageService.getPeriodoConta.mockReturnValue({ periodo: 'periodo-uuid', conta: 'conta-uuid' });
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue({prestacao_contas_status: {periodo_bloqueado: false}});
        associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao.mockResolvedValue([{
            uuid: 'periodo-uuid',
            referencia: '2025',
            data_inicio_realizacao_despesas: '2025-01-01',
            data_fim_realizacao_despesas: '2025-12-31',
        }]);
        associacaoService.getContas.mockResolvedValue([{ uuid: 'conta-uuid', conta: 'conta-nome', tipo_conta: { nome: 'conta-tipo' } }]);
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

    it("exibe loading e limpa os dados do extrato antes de carregar carregaObservacoes", async () => {
      const observacao = criaPromiseControlada();
      conciliacaoStorageService.getPeriodoConta.mockReturnValue({ periodo: 'periodo-uuid', conta: 'conta-uuid' });
      associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao.mockResolvedValue([{
        uuid: 'periodo-uuid',
        data_inicio_realizacao_despesas: '2025-01-01',
      }]);
      associacaoService.getContas.mockResolvedValue([{
        uuid: 'conta-uuid',
        nome: 'Conta principal',
        tipo_conta: { nome: 'conta-tipo' },
      }]);
      prestacaoService.getObservacoes.mockReturnValue(observacao.promise);

      renderComponent();

      expect(await screen.findByText('Carregando...')).toBeInTheDocument();

      observacao.resolver({
        possui_solicitacao_encerramento: false,
        data_extrato: '2025-07-05',
        saldo_extrato: 100,
        comprovante_extrato: 'extrato-atual.pdf',
        data_atualizacao_comprovante_extrato: '2025-07-05T10:00:00',
      });

      await waitFor(() => {
        expect(screen.getByText('extrato-atual.pdf')).toBeInTheDocument();
        expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
      });
    });

    it("exibe erro e remove os dados do extrato quando getObservacoes falha", async () => {
      conciliacaoStorageService.getPeriodoConta.mockReturnValue({ periodo: 'periodo-uuid', conta: 'conta-uuid' });
      associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao.mockResolvedValue([{
        uuid: 'periodo-uuid',
        data_inicio_realizacao_despesas: '2025-01-01',
      }]);
      associacaoService.getContas.mockResolvedValue([{
        uuid: 'conta-uuid',
        nome: 'Conta principal',
        tipo_conta: { nome: 'conta-tipo' },
      }]);
      prestacaoService.getObservacoes.mockRejectedValue(new Error('falha de rede'));

      renderComponent();

      expect(await screen.findByText(/Não foi possível carregar os dados do saldo bancário/)).toBeInTheDocument();
      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
      expect(screen.queryByText('comprovante.pdf')).not.toBeInTheDocument();
    });

    it("ignora a resposta antiga de carregaObservacoes quando uma nova conta é selecionada", async () => {
      const primeiraObservacao = criaPromiseControlada();
      const segundaObservacao = criaPromiseControlada();
      conciliacaoStorageService.getPeriodoConta.mockReturnValue({ periodo: 'periodo-uuid', conta: 'conta-1' });
      associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao.mockResolvedValue([{
        uuid: 'periodo-uuid',
        referencia: '2025',
        data_inicio_realizacao_despesas: '2025-01-01',
      }]);
      associacaoService.getContas.mockResolvedValue([
        { uuid: 'conta-1', nome: 'Conta 1', tipo_conta: { nome: 'corrente' } },
        { uuid: 'conta-2', nome: 'Conta 2', tipo_conta: { nome: 'poupança' } },
      ]);
      prestacaoService.getObservacoes
        .mockReturnValueOnce(primeiraObservacao.promise)
        .mockReturnValueOnce(segundaObservacao.promise);

      renderComponent();
      await waitFor(() => expect(prestacaoService.getObservacoes).toHaveBeenCalledTimes(1));

      fireEvent.change(screen.getByLabelText('Conta:'), { target: { value: 'conta-2' } });
      await waitFor(() => expect(prestacaoService.getObservacoes).toHaveBeenCalledTimes(2));

      segundaObservacao.resolver({
        possui_solicitacao_encerramento: false,
        data_extrato: '2025-07-06',
        saldo_extrato: 222,
        comprovante_extrato: 'conta-2.pdf',
      });
      await screen.findByText('conta-2.pdf');

      primeiraObservacao.resolver({
        possui_solicitacao_encerramento: false,
        data_extrato: '2025-07-05',
        saldo_extrato: 111,
        comprovante_extrato: 'conta-1.pdf',
      });

      await waitFor(() => {
        expect(screen.getByText('conta-2.pdf')).toBeInTheDocument();
        expect(screen.queryByText('conta-1.pdf')).not.toBeInTheDocument();
      });
    });
});
