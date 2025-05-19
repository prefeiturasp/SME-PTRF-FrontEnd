import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Link, useParams, MemoryRouter} from "react-router-dom";
import {
  getPeriodos,
  getTiposDeConta,
  getDres,
  getSaldosDetalhesAssociacoes,
  getSaldosDetalhesAssociacoesExportar} from "../../../../services/sme/ConsultaDeSaldosBancarios.service";
import { getDownloadExtratoBancario, getVisualizarExtratoBancario } from "../../../../services/escolas/PrestacaoDeContas.service";
import { getTabelaAssociacoes } from "../../../../services/sme/Parametrizacoes.service";
import { ConsultaDeSaldosBancariosDetalhesAssociacoes } from "../ConsultaDeSaldosBancariosDetalhesAssociacoes"
import { mockPeriodos, mockTiposDeConta, mockDres, mockTabelaAssociacoes } from "../__fixtures__/mockData";
import { fi } from 'date-fns/locale';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('../../../../services/sme/ConsultaDeSaldosBancarios.service', () => ({
  getPeriodos: jest.fn(),
  getTiposDeConta: jest.fn(),
  getDres: jest.fn(),
  getSaldosDetalhesAssociacoes: jest.fn(),
  getSaldosDetalhesAssociacoesExportar: jest.fn()
}));

jest.mock('../../../../services/escolas/PrestacaoDeContas.service', () => ({
  getDownloadExtratoBancario: jest.fn(),
  getVisualizarExtratoBancario: jest.fn()
}));

jest.mock('../../../../services/sme/Parametrizacoes.service', () => ({
  getTabelaAssociacoes: jest.fn()
}));

describe('Componente Consulta de Saldos Bancarios Detalhes Associacoes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o componente', async() => {
    useParams.mockReturnValue({
      periodo_uuid: 'mock-periodo-uuid',
      conta_uuid: 'uuid-1',
      dre_uuid: 'uuid-1',
    });
    getPeriodos.mockReturnValue(mockPeriodos);
    getTiposDeConta.mockReturnValue(mockTiposDeConta);
    getDres.mockReturnValue(mockDres);
    getSaldosDetalhesAssociacoes.mockReturnValue([
      {
        unidade__codigo_eol: "123456",
        unidade__nome: "Unidade Teste123",
        obs_periodo__data_extrato: "2023-10-01",
        obs_periodo__saldo_extrato: "1000.00",
        obs_periodo__uuid: "uuid-123",
        obs_periodo__comprovante_extrato: "comprovante.pdf",
        acoes: "Ação 1"
      }
    ])
    getSaldosDetalhesAssociacoesExportar.mockReturnValue({data: 1})
    getTabelaAssociacoes.mockReturnValue(mockTabelaAssociacoes);
    getDownloadExtratoBancario.mockReturnValue({data: "extrato123"});

    render(<MemoryRouter><ConsultaDeSaldosBancariosDetalhesAssociacoes/></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText("Consulta de saldos bancários")).toBeInTheDocument();
      expect(screen.getByText("Código Eol")).toBeInTheDocument();
      expect(screen.getByText("123456")).toBeInTheDocument();
      const botaoModalExtrato = screen.getByTestId("botaoVerExtrato");
      fireEvent.click(botaoModalExtrato);
    });
  });

  it('renderiza o componente e faz download do extrato', async() => {
    useParams.mockReturnValue({
      periodo_uuid: 'mock-periodo-uuid',
      conta_uuid: 'uuid-1',
      dre_uuid: 'uuid-1',
    });
    getPeriodos.mockReturnValue(mockPeriodos);
    getTiposDeConta.mockReturnValue(mockTiposDeConta);
    getDres.mockReturnValue(mockDres);
    getSaldosDetalhesAssociacoes.mockReturnValue([
      {
        unidade__codigo_eol: "123456",
        unidade__nome: "Unidade Teste123",
        obs_periodo__data_extrato: "2023-10-01",
        obs_periodo__saldo_extrato: "1000.00",
        obs_periodo__uuid: "uuid-123",
        obs_periodo__comprovante_extrato: "comprovante.pdf",
        acoes: "Ação 1"
      }
    ])
    getSaldosDetalhesAssociacoesExportar.mockReturnValue({data: 1})
    getTabelaAssociacoes.mockReturnValue(mockTabelaAssociacoes);
    getDownloadExtratoBancario.mockReturnValue({data: "extrato123"});

    render(<MemoryRouter><ConsultaDeSaldosBancariosDetalhesAssociacoes/></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText("Consulta de saldos bancários")).toBeInTheDocument();
      expect(screen.getByText("Código Eol")).toBeInTheDocument();
      expect(screen.getByText("123456")).toBeInTheDocument();
      const botaoDownloadExtrato = screen.getByTestId("botaoDownloadExtrato");
      fireEvent.click(botaoDownloadExtrato);
    });
  
  });
    
  it('filtros', async() => {
      useParams.mockReturnValue({
        periodo_uuid: 'mock-periodo-uuid',
        conta_uuid: 'uuid-1',
        dre_uuid: 'uuid-1',
      });
      getPeriodos.mockReturnValue(mockPeriodos);
      getTiposDeConta.mockReturnValue(mockTiposDeConta);
      getDres.mockReturnValue(mockDres);
      getSaldosDetalhesAssociacoes.mockReturnValue([
        {
          unidade__codigo_eol: "123456",
          unidade__nome: "Unidade Teste123",
          obs_periodo__data_extrato: "2023-10-01",
          obs_periodo__saldo_extrato: "1000.00",
          obs_periodo__uuid: "uuid-123",
          obs_periodo__comprovante_extrato: "comprovante.pdf",
          acoes: "Ação 1"
        }
      ])
      getSaldosDetalhesAssociacoesExportar.mockReturnValue({data: 1})
      getTabelaAssociacoes.mockReturnValue(mockTabelaAssociacoes);
      getDownloadExtratoBancario.mockReturnValue({data: "extrato123"});

      render(<MemoryRouter><ConsultaDeSaldosBancariosDetalhesAssociacoes/></MemoryRouter>);
      await waitFor(() => {
        const filtroTipoUE = screen.getByLabelText("Filtrar pelo tipo de UE");
        fireEvent.change(filtroTipoUE, { target: { value: "IFSP" } });
        fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));
      });

      expect(getSaldosDetalhesAssociacoes).toHaveBeenCalledTimes(2);
  });

  it('Exportar planilha', async() => {
      useParams.mockReturnValue({
        periodo_uuid: 'mock-periodo-uuid',
        conta_uuid: 'uuid-1',
        dre_uuid: 'uuid-1',
      });
      getPeriodos.mockReturnValue(mockPeriodos);
      getTiposDeConta.mockReturnValue(mockTiposDeConta);
      getDres.mockReturnValue(mockDres);
      getSaldosDetalhesAssociacoes.mockReturnValue([
        {
          unidade__codigo_eol: "123456",
          unidade__nome: "Unidade Teste123",
          obs_periodo__data_extrato: "2023-10-01",
          obs_periodo__saldo_extrato: "1000.00",
          obs_periodo__uuid: "uuid-123",
          obs_periodo__comprovante_extrato: "comprovante.pdf",
          acoes: "Ação 1"
        }
      ])
      getSaldosDetalhesAssociacoesExportar.mockReturnValue({data: 1})
      getTabelaAssociacoes.mockReturnValue(mockTabelaAssociacoes);
      getDownloadExtratoBancario.mockReturnValue({data: "extrato123"});

      render(<MemoryRouter><ConsultaDeSaldosBancariosDetalhesAssociacoes/></MemoryRouter>);
      await waitFor(() => {
        fireEvent.click(screen.getByRole("button", { name: "Exportar planilha" }));
      });

      expect(getSaldosDetalhesAssociacoesExportar).toHaveBeenCalledTimes(1);
  });

  it('Alterar valor Select Conta e Periodo', async() => {
      useParams.mockReturnValue({
        periodo_uuid: 'mock-periodo-uuid',
        conta_uuid: 'uuid-1',
        dre_uuid: 'uuid-1',
      });
      getPeriodos.mockReturnValue(mockPeriodos);
      getTiposDeConta.mockReturnValue(mockTiposDeConta);
      getDres.mockReturnValue(mockDres);
      getSaldosDetalhesAssociacoes.mockReturnValue([
        {
          unidade__codigo_eol: "123456",
          unidade__nome: "Unidade Teste123",
          obs_periodo__data_extrato: "2023-10-01",
          obs_periodo__saldo_extrato: "1000.00",
          obs_periodo__uuid: "uuid-123",
          obs_periodo__comprovante_extrato: "comprovante.pdf",
          acoes: "Ação 1"
        }
      ])
      getSaldosDetalhesAssociacoesExportar.mockReturnValue({data: 1})
      getTabelaAssociacoes.mockReturnValue(mockTabelaAssociacoes);
      getDownloadExtratoBancario.mockReturnValue({data: "extrato123"});

      render(<MemoryRouter><ConsultaDeSaldosBancariosDetalhesAssociacoes/></MemoryRouter>);
      await waitFor(() => {
        const selectTipoConta = screen.getByLabelText("Selecione o tipo de conta:");
        const selectPeriodo = screen.getByLabelText("Selecione o período:");
        fireEvent.change(selectTipoConta, { target: { value: "uuid-3" } });
        fireEvent.change(selectPeriodo, { target: { value: "d9bc43e3-cfd5-4969-bada-af78d96e8faf" } });
      });

      expect(getPeriodos).toHaveBeenCalledTimes(1);
      expect(getTiposDeConta).toHaveBeenCalledTimes(1);
  });

});