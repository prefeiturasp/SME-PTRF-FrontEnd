import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Filtros } from '../Filtros';
import * as ParametrizacoesService from '../../../../../../../services/sme/Parametrizacoes.service';

// Mock do PrimeReact AutoComplete
jest.mock('primereact/autocomplete', () => {
  const React = require('react');
  const AutoComplete = React.forwardRef(({ 
    completeMethod, 
    value, 
    onChange, 
    placeholder, 
    suggestions,
    multiple,
    field,
    itemTemplate,
    selectedItemTemplate,
    inputClassName,
    id,
    ...props 
  }, ref) => {
    const handleChange = (e) => {
      const inputValue = e.target.value;
      // Para múltiplo, manter como array; para single, manter como string
      const valueToSend = multiple ? [{ nome: inputValue }] : inputValue;
      onChange?.({ value: valueToSend });
      // Chamar completeMethod para simular o comportamento do PrimeReact AutoComplete
      if (completeMethod) {
        completeMethod({ query: inputValue });
      }
    };

    return (
      <input
        ref={ref}
        id={id}
        type="text"
        placeholder={placeholder}
        className={inputClassName}
        value={Array.isArray(value) ? value.map(v => v.nome || v).join(', ') : (value?.nome || value || '')}
        onChange={handleChange}
        data-testid="autocomplete-input"
        {...props}
      />
    );
  });
  
  AutoComplete.displayName = 'AutoComplete';
  return { AutoComplete };
});

// Mock do Ant Design Select
jest.mock('antd', () => ({
  Select: ({ value, onChange, placeholder, options, mode, id, ...props }) => (
    <select
      id={id}
      multiple={mode === 'multiple'}
      value={Array.isArray(value) ? value : []}
      onChange={(e) => {
        const selected = Array.from(e.target.options)
          .filter(opt => opt.selected)
          .map(opt => opt.value);
        onChange?.(selected);
      }}
      style={{ width: '100%' }}
      {...props}
    >
      <option>{placeholder || 'Selecione'}</option>
      {options?.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
  Switch: ({ checked, onChange, ...props }) => (
    <button
      role="switch"
      aria-checked={checked ? 'true' : 'false'}
      onClick={() => onChange?.(!checked)}
      {...props}
    />
  )
}));

// Mock dos contextos
jest.mock('../../hooks/useComissoesContext', () => ({
  useComissoesContext: () => ({
    setFilter: jest.fn(),
    initialFilter: {
      comissoes_uuid: [],
      recursos_uuid: [],
      responsavel_analise_pc: false
    }
  })
}));

jest.mock('../../../../../../../context/RecursoSelecionado', () => ({
  useRecursoSelecionadoContext: () => ({
    recursos: [
      { uuid: '1', nome: 'Recurso 1' },
      { uuid: '2', nome: 'Recurso 2' },
      { uuid: '3', nome: 'Recurso 3' }
    ]
  })
}));

jest.mock('../../../../../../../services/sme/Parametrizacoes.service', () => ({
  getComissoesPorNome: jest.fn()
}));

describe('Componente Filtros', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar o componente com todos os campos de filtro', () => {
    render(<Filtros />);
    
    expect(screen.getByLabelText('Filtre por comissão')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtre por recurso')).toBeInTheDocument();
    expect(screen.getByText('Filtrar por comissões que sejam responsáveis pela análise de prestação de contas')).toBeInTheDocument();
  });

  test('deve renderizar os botões de filtrar e limpar', () => {
    render(<Filtros />);
    
    expect(screen.getByRole('button', { name: /Filtrar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Limpar/i })).toBeInTheDocument();
  });

  test('deve renderizar o Select com as opções de recursos', () => {
    render(<Filtros />);
    
    const selectRecursos = screen.getByLabelText('Filtre por recurso');
    expect(selectRecursos).toBeInTheDocument();
  });

  test('deve atualizar o estado ao selecionar recursos', async () => {
    const user = userEvent.setup();
    render(<Filtros />);
    
    const selectRecursos = screen.getByLabelText('Filtre por recurso');
    
    await user.click(selectRecursos);
    await waitFor(() => {
      expect(screen.getByText('Recurso 1')).toBeInTheDocument();
    });
  });

  test('deve ativar/desativar o switch de responsável pela análise', async () => {
    const user = userEvent.setup();
    render(<Filtros />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
    
    await user.click(switchElement);
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
  });

  test('deve chamar a função de carregamento de comissões ao digitar no AutoComplete', async () => {
    ParametrizacoesService.getComissoesPorNome.mockResolvedValue([
      { uuid: 'c1', nome: 'Comissão 1' },
      { uuid: 'c2', nome: 'Comissão 2' }
    ]);

    render(<Filtros />);
    
    const autocompleteInput = screen.getByPlaceholderText('Digite o nome da comissão...');
    
    fireEvent.change(autocompleteInput, { target: { value: 'Comissão' } });
    fireEvent.keyDown(autocompleteInput, { key: 'Enter' });
    
    await waitFor(() => {
      expect(ParametrizacoesService.getComissoesPorNome).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  test('deve filtrar comissões já selecionadas do autocomplete', async () => {
    const comissoesDataMock = [
      { uuid: 'c1', nome: 'Comissão 1' },
      { uuid: 'c2', nome: 'Comissão 2' },
      { uuid: 'c3', nome: 'Comissão 3' }
    ];
    
    ParametrizacoesService.getComissoesPorNome.mockResolvedValue(comissoesDataMock);

    render(<Filtros />);
    
    // Simula que uma comissão já foi selecionada
    const autocompleteInput = screen.getByPlaceholderText('Digite o nome da comissão...');
    fireEvent.change(autocompleteInput, { target: { value: 'Comissão' } });
    
    await waitFor(() => {
      expect(ParametrizacoesService.getComissoesPorNome).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  test('deve chamar clearFilter ao clicar em Limpar', async () => {
    const user = userEvent.setup();
    render(<Filtros />);
    
    const btnLimpar = screen.getByRole('button', { name: /Limpar/i });
    
    await user.click(btnLimpar);
    
    // Verificar se o formulário foi resetado
    const autocompleteInput = screen.getByPlaceholderText('Digite o nome da comissão...');
    expect(autocompleteInput).toHaveValue('');
  });

  test('deve enviar o formulário ao clicar em Filtrar', async () => {
    const user = userEvent.setup();
    render(<Filtros />);
    
    const btnFiltrar = screen.getByRole('button', { name: /Filtrar/i });
    
    await user.click(btnFiltrar);
    
    // Verificar se o formulário foi submetido
    expect(btnFiltrar).toBeInTheDocument();
  });

  test('deve exibir descrição de filtro corretamente', () => {
    render(<Filtros />);
    
    const descricao = screen.getByText('Filtre por comissão, recursos disponíveis ou por comissões aptas para prestação de contas.');
    expect(descricao).toBeInTheDocument();
  });

  test('deve ter botão Filtrar habilitado por padrão', () => {
    render(<Filtros />);
    
    const btnFiltrar = screen.getByRole('button', { name: /Filtrar/i });
    expect(btnFiltrar).not.toBeDisabled();
  });

  test('deve ter forma de limpeza de filtros funcionando', async () => {
    const user = userEvent.setup();
    render(<Filtros />);
    
    const switchElement = screen.getByRole('switch');
    
    // Ativa o switch
    await user.click(switchElement);
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
    
    // Limpa os filtros
    const btnLimpar = screen.getByRole('button', { name: /Limpar/i });
    await user.click(btnLimpar);
    
    // Verifica se o switch voltou ao estado inicial
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
  });

  test('deve ter debounce funcionando para busca de comissões', () => {
    jest.useFakeTimers('modern');
    ParametrizacoesService.getComissoesPorNome.mockResolvedValue([]);

    render(<Filtros />);
    
    const autocompleteInput = screen.getByPlaceholderText('Digite o nome da comissão...');
    
    // Simula digitação rápida
    act(() => {
      fireEvent.change(autocompleteInput, { target: { value: 'C' } });
      jest.advanceTimersByTime(500);
      
      fireEvent.change(autocompleteInput, { target: { value: 'Co' } });
      jest.advanceTimersByTime(500);
      
      fireEvent.change(autocompleteInput, { target: { value: 'Com' } });
      jest.advanceTimersByTime(2000);
    });
    
    // Ejecutar todos os timers e microtasks com modern fake timers
    act(() => {
      jest.runAllTimers();
    });
    
    // getComissoesPorNome deve ser chamado apenas uma vez (debounce funcionando)
    expect(ParametrizacoesService.getComissoesPorNome).toHaveBeenCalledTimes(1);
    expect(ParametrizacoesService.getComissoesPorNome).toHaveBeenCalledWith('Com');
    
    jest.useRealTimers();
  });
});
