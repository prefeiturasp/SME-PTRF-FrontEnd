import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExtracaoDados } from '../index';
import { getExportaCreditos } from '../../../../services/sme/ExtracaoDados.service';
import { visoesService } from '../../../../services/visoes.service';
import { toastCustom } from '../../ToastCustom';

// Mock dos serviços e dependências
jest.mock('../../../../services/sme/ExtracaoDados.service');
jest.mock('../../ToastCustom', () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn()
  }
}));
jest.mock('../../../../services/visoes.service');
jest.mock('react-tooltip', () => ({
  __esModule: true,
  default: ({ children, id }) => <div data-testid={`tooltip-${id}`}>{children}</div>
}));

// Mock do moment para evitar problemas com datas
jest.mock('moment', () => {
  const actualMoment = jest.requireActual('moment');
  return actualMoment;
});

const mockGetExportaCreditos = getExportaCreditos;
const mockVisoesService = {
  VISOES: {
    SME: 'SME',
    DRE: 'DRE'
  }
};

describe('ExtracaoDados - Saldos Bancários', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup dos mocks
    visoesService.getItemUsuarioLogado = jest.fn();
    visoesService.VISOES = mockVisoesService.VISOES;
    
    // Mock padrão para usuário DRE
    visoesService.getItemUsuarioLogado
      .mockReturnValueOnce('DRE') // visao_selecionada.nome
      .mockReturnValueOnce('dre-uuid-123'); // unidade_selecionada.uuid
      
    // Mock do console.log para evitar spam nos testes
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('renderiza o título e filtro de data corretamente', () => {
    render(<ExtracaoDados />);
    
    expect(screen.getByText('Dados disponíveis para extração')).toBeInTheDocument();
    expect(screen.getByText('Filtrar por data')).toBeInTheDocument();
    expect(screen.getByText('Selecione o período de criação (vazio para todos)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('data inicial')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('data final')).toBeInTheDocument();
  });

  it('renderiza o card de saldos bancários com informações corretas', () => {
    render(<ExtracaoDados />);
    
    // Verifica se o card de saldos bancários está presente
    expect(screen.getByText('Saldo bancário das unidades')).toBeInTheDocument();
    expect(screen.getByText('Arquivos com informações de saldo bancário das unidades.')).toBeInTheDocument();
    
    // Verifica se há pelo menos uma tag CSV (usando getAllByText para evitar erro de múltiplos elementos)
    const csvTags = screen.getAllByText('CSV');
    expect(csvTags.length).toBeGreaterThan(0);
    
    // Verifica se há pelo menos um botão de exportar dados
    const exportButtons = screen.getAllByText('Exportar Dados');
    expect(exportButtons.length).toBeGreaterThan(0);
  });

  it('filtra cards baseado na visão do usuário (DRE)', () => {
    render(<ExtracaoDados />);
    
    // Verifica se apenas os cards com visão DRE são renderizados
    expect(screen.getByText('Saldo bancário das unidades')).toBeInTheDocument();
    expect(screen.getByText('Créditos das Unidades Educacionais no período')).toBeInTheDocument();
    expect(screen.getByText('Saldo final do período')).toBeInTheDocument();
    
    // Verifica se cards exclusivos da SME NÃO são renderizados
    expect(screen.queryByText('Especificações de materiais e serviços')).not.toBeInTheDocument();
    expect(screen.queryByText('Membros da APM')).not.toBeInTheDocument();
  });
});
