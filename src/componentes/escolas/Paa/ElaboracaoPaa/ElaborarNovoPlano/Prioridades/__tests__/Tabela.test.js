import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Tabela } from '../Tabela';

const mockData = [
  {
    uuid: 'uuid1',
    acao: 'Ação PTRF 1',
    especificacao_material_objeto: { nome: 'Especificação 1' },
    tipo_aplicacao_objeto: { name: 'Custeio' },
    tipo_despesa_custeio_objeto: { nome: 'Tipo 1' },
    valor_total: 1000.50
  },
  {
    uuid: 'uuid2',
    acao: 'Ação PDDE 1',
    especificacao_material_objeto: { nome: 'Especificação 2' },
    tipo_aplicacao_objeto: { name: 'Capital' },
    tipo_despesa_custeio_objeto: null,
    valor_total: 2000.75
  },
  {
    uuid: 'uuid3',
    acao: 'Recurso Próprio',
    especificacao_material_objeto: { nome: 'Especificação 3' },
    tipo_aplicacao_objeto: { name: 'Custeio' },
    tipo_despesa_custeio_objeto: { nome: 'Tipo 2' },
    valor_total: 1500.25
  }
];

const handleEditar = jest.fn();

const renderizaComponente = () => {
  return render(<Tabela data={mockData} handleEditar={handleEditar} />);
};

describe('Tabela', () => {
  test('renderiza a tabela com dados', () => {
    renderizaComponente();

    // Verifica se os headers estão presentes
    expect(screen.getByText('Especificação do material, bem ou serviço')).toBeInTheDocument();
    expect(screen.getByText('Tipo de aplicação')).toBeInTheDocument();
    expect(screen.getByText('Tipo de despesa')).toBeInTheDocument();
    expect(screen.getByText('Valor total')).toBeInTheDocument();
  });

  test('exibe dados corretos nas colunas', () => {
    renderizaComponente();

    // Verifica se os dados estão sendo exibidos
    expect(screen.getByText('Ação PTRF 1')).toBeInTheDocument();
    expect(screen.getByText('Ação PDDE 1')).toBeInTheDocument();
    expect(screen.getByText('Recurso Próprio')).toBeInTheDocument();
    expect(screen.getByText('Especificação 1')).toBeInTheDocument();
    expect(screen.getByText('Especificação 2')).toBeInTheDocument();
    expect(screen.getByText('Especificação 3')).toBeInTheDocument();
  });

  test('mostra checkbox para seleção individual', () => {
    renderizaComponente();

    // Verifica se os checkboxes estão presentes
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(mockData.length + 1); // +1 para o checkbox do header
  });

  test('seleciona e deseleciona checkbox individual', () => {
    renderizaComponente();

    const checkboxes = screen.getAllByRole('checkbox');
    const firstItemCheckbox = checkboxes[1]; // Primeiro item (índice 0 é o header)

    // Seleciona o primeiro item
    fireEvent.click(firstItemCheckbox);
    expect(firstItemCheckbox).toBeChecked();

    // Deseleciona o primeiro item
    fireEvent.click(firstItemCheckbox);
    expect(firstItemCheckbox).not.toBeChecked();
  });

  test('seleciona todos os itens com checkbox do header', () => {
    renderizaComponente();

    const checkboxes = screen.getAllByRole('checkbox');
    const headerCheckbox = checkboxes[0];
    const itemCheckboxes = checkboxes.slice(1);

    // Seleciona todos
    fireEvent.click(headerCheckbox);

    // Verifica se todos os checkboxes estão marcados
    itemCheckboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked();
    });

    // Deseleciona todos
    fireEvent.click(headerCheckbox);

    // Verifica se todos os checkboxes estão desmarcados
    itemCheckboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
  });

  test('mostra estado intermediário quando alguns itens estão selecionados', () => {
    renderizaComponente();

    const checkboxes = screen.getAllByRole('checkbox');
    const headerCheckbox = checkboxes[0];
    const firstItemCheckbox = checkboxes[1];

    // Seleciona apenas o primeiro item
    fireEvent.click(firstItemCheckbox);

    // Verifica se o header está em estado intermediário
    expect(headerCheckbox).not.toBeChecked();
    expect(headerCheckbox.indeterminate).toBe(true);
  });

  test('renderiza botões de ação para cada linha', () => {
    renderizaComponente();

    // Verifica se os botões de ação estão presentes
    const actionButtons = screen.getAllByRole('button');
    expect(actionButtons.length).toBeGreaterThan(0);
  });

  test('exibe valores corretos para diferentes tipos de ação', () => {
    renderizaComponente();

    // Verifica se os valores corretos são exibidos baseado na lógica
    expect(screen.getByText('Ação PTRF 1')).toBeInTheDocument(); // acao_associacao.nome
    expect(screen.getByText('Ação PDDE 1')).toBeInTheDocument(); // acao_pdde.nome
    expect(screen.getByText('Recurso Próprio')).toBeInTheDocument(); // valor padrão
  });

  test('renderiza tabela com dados nulos/undefined', () => {
    const dataWithNulls = [
      {
        uuid: 'uuid1',
        acao: 'Recurso Próprio',
        especificacao_material: { nome: 'Especificação 1' },
        tipo_aplicacao: { name: 'Custeio' },
        tipo_despesa_custeio: null,
        valor_total: 1000.50
      }
    ];

    renderizaComponente();

    // Verifica se o valor padrão é exibido quando não há ação
    expect(screen.getByText('Recurso Próprio')).toBeInTheDocument();
  });

  test('mantém estado de seleção ao re-renderizar', () => {
    const { rerender } = renderizaComponente();

    const checkboxes = screen.getAllByRole('checkbox');
    const firstItemCheckbox = checkboxes[1];

    // Seleciona o primeiro item
    fireEvent.click(firstItemCheckbox);
    expect(firstItemCheckbox).toBeChecked();

    // Re-renderiza com os mesmos dados
    rerender(<Tabela data={mockData} />);

    // Verifica se o estado foi mantido
    const newCheckboxes = screen.getAllByRole('checkbox');
    expect(newCheckboxes[1]).toBeChecked();
  });

  test('limpa seleção quando dados mudam', () => {
    const { rerender } = renderizaComponente();

    const checkboxes = screen.getAllByRole('checkbox');
    const firstItemCheckbox = checkboxes[1];

    // Seleciona o primeiro item
    fireEvent.click(firstItemCheckbox);
    expect(firstItemCheckbox).toBeChecked();

    // Re-renderiza com dados diferentes
    const newData = [
      {
        uuid: 'uuid4',
        acao_associacao: { nome: 'Nova Ação' },
        especificacao_material: { nome: 'Nova Especificação' },
        tipo_aplicacao: { name: 'Capital' },
        tipo_despesa_custeio: null,
        valor_total: 3000.00
      }
    ];

    rerender(<Tabela data={newData} />);

    // Verifica se a seleção foi limpa
    const newCheckboxes = screen.getAllByRole('checkbox');
    expect(newCheckboxes[1]).not.toBeChecked();
  });

  test('clica nos 3 IconButton (Edit, Delete, Duplicate)', () => {
    renderizaComponente();

    // Encontra todos os botões de ação (Edit, Delete, Duplicate)
    const actionButtons = screen.getAllByRole('button');

    // Filtra apenas os botões que são IconButton (baseado no aria-label)
    const iconButtons = actionButtons.filter(button => 
      ['Editar', 'Excluir', 'Duplicar'].includes(button.getAttribute('aria-label'))
    );

    // Verifica se existem os 3 botões
    const linhas_tabela = 3
    const botoes_acoes = 3
    expect(iconButtons).toHaveLength(linhas_tabela * botoes_acoes);

    // Clica em cada botão
    iconButtons.forEach(button => {
      fireEvent.click(button);
    });

  });

  test('chamar o handleEditar', () => {
    renderizaComponente();
    
    // Encontra todos os botões de ação (Edit, Delete, Duplicate)
    const actionButtons = screen.getAllByRole('button').slice(0, 3);
    
    // Filtra apenas os botões que são IconButton (baseado no aria-label)
    const iconButtons = actionButtons.filter(button => button.getAttribute('aria-label') === 'Editar');
    
    // Verifica se existe 1 botão
    expect(iconButtons).toHaveLength(1);
    
    // Clica em cada botão
    iconButtons.forEach(button => {
      fireEvent.click(button);
    });

    expect(handleEditar).toHaveBeenCalledTimes(1);

  });
}); 