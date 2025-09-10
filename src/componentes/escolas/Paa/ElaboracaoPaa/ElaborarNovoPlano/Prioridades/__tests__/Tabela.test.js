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
  },
  {
    uuid: 'uuid4',
    acao: 'Teste Sem Valor',
    especificacao_material_objeto: { nome: 'Especificação 4' },
    tipo_aplicacao_objeto: { name: 'Custeio' },
    tipo_despesa_custeio_objeto: { nome: 'Tipo 2' },
    valor_total: null
  }
];

const handleEditar = jest.fn();
const handleDuplicar = jest.fn();
const handleExcluir = jest.fn();
const handleExcluirEmLote = jest.fn();

const renderizaComponente = () => {
  return render(<Tabela 
    data={mockData} 
    handleEditar={handleEditar} 
    handleDuplicar={handleDuplicar}
    handleExcluir={handleExcluir}
    handleExcluirEmLote={handleExcluirEmLote}
    ref={null}
  />);
};

describe('Tabela', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza a tabela contendo os headers', () => {
    renderizaComponente();

    // Verifica se os headers estão presentes
    expect(screen.getAllByText('Especificação do material, bem ou serviço').length).toBeGreaterThan(1);
    expect(screen.getAllByText('Tipo de aplicação').length).toBeGreaterThan(1);
    expect(screen.getAllByText('Tipo de despesa').length).toBeGreaterThan(1);
    expect(screen.getAllByText('Valor total').length).toBeGreaterThan(1);
  });

  test('exibe dados corretos nas colunas', () => {
    renderizaComponente();

    // Verifica se os dados estão sendo exibidos
    expect(screen.getByText('Ação PTRF 1')).toBeInTheDocument();
    expect(screen.getByText('Ação PDDE 1')).toBeInTheDocument();
    expect(screen.getByText('Recurso Próprio')).toBeInTheDocument();
    expect(screen.getByText('Teste Sem Valor')).toBeInTheDocument();
    expect(screen.getByText('Especificação 1')).toBeInTheDocument();
    expect(screen.getByText('Especificação 2')).toBeInTheDocument();
    expect(screen.getByText('Especificação 3')).toBeInTheDocument();
    expect(screen.getByText('Especificação 4')).toBeInTheDocument();
  });

  test('mostra checkbox para seleção individual', () => {
    renderizaComponente();

    // Verifica se os checkboxes estão presentes
    const checkboxes = document.getElementsByClassName('seletor-individual')

    expect(checkboxes).toHaveLength(mockData.length);
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

  test('seleciona todos os itens com checkbox do header', async () => {
    renderizaComponente({
      data: [
        { uuid: '1', acao: 'Ação 1' },
        { uuid: '2', acao: 'Ação 2' },
        { uuid: '3', acao: 'Ação 3' },
      ],
    });
  
    // Pega todos os checkboxes
    let checkboxes = screen.getAllByRole('checkbox');
    const headerCheckbox = checkboxes[0];
  
    // Seleciona todos
    fireEvent.click(headerCheckbox);
  
    // Busca novamente os checkboxes após o re-render
    const updatedCheckboxes = await screen.findAllByRole('checkbox');
    const itemCheckboxes = updatedCheckboxes.slice(1);
  
    itemCheckboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked();
    });
  
    // Deseleciona todos
    fireEvent.click(updatedCheckboxes[0]);
    const uncheckedCheckboxes = await screen.findAllByRole('checkbox');
    const itemCheckboxesAfterUncheck = uncheckedCheckboxes.slice(1);
  
    itemCheckboxesAfterUncheck.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
  });
  
  test('mostra estado intermediário quando alguns itens estão selecionados', async () => {
    renderizaComponente({
      data: [
        { uuid: '1', acao: 'Ação 1' },
        { uuid: '2', acao: 'Ação 2' },
      ],
    });
  
    let checkboxes = screen.getAllByRole('checkbox');
    const firstItemCheckbox = checkboxes[1];
  
    // Seleciona apenas o primeiro item
    fireEvent.click(firstItemCheckbox);
  
    // Aguarda o re-render e pega o header atualizado
    const updatedCheckboxes = await screen.findAllByRole('checkbox');
    const headerCheckbox = updatedCheckboxes[0];
  
    // Verifica se o header continua marcado após um dos checks for marcado
    expect(headerCheckbox).toBeChecked();
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

    render(<Tabela data={[mockData[3]]} handleEditar={handleEditar} handleDuplicar={handleDuplicar} />);

    expect(screen.getByText('Teste Sem Valor')).toBeInTheDocument();
    // Exibe o botão para inserir valor quando não há valor (item duplicado)
    const botaoEditarDuplicado = screen.getByText('Informar Valor');
    expect(botaoEditarDuplicado).toBeInTheDocument();
    fireEvent.click(botaoEditarDuplicado)
    expect(handleEditar).toHaveBeenCalled();

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
    const linhas_tabela = mockData.length
    const botoes_acoes = ['Editar', 'Excluir', 'Duplicar'].length
    expect(iconButtons).toHaveLength(linhas_tabela * botoes_acoes);

    // Clica em cada botão
    iconButtons.forEach(button => {
      fireEvent.click(button);
    });

  });

  test('chamar o handleEditar/Duplicar', () => {
    renderizaComponente();

    // Encontra todos os botões de ação (Edit, Delete, Duplicate)
    const actionsEditar = document.querySelectorAll('button[aria-label="Editar"]');
    expect(actionsEditar).toHaveLength(mockData.length);

    const actionsExcluir = document.querySelectorAll('button[aria-label="Excluir"]');
    expect(actionsExcluir).toHaveLength(mockData.length);

    const actionsDuplicar = document.querySelectorAll('button[aria-label="Duplicar"]');
    expect(actionsDuplicar).toHaveLength(mockData.length);

    // Clica em cada botão Editar
    actionsEditar.forEach(button => {
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
      fireEvent.click(button);
    });
    expect(handleEditar).toHaveBeenCalledTimes(mockData.length);
    
    // Clica em cada botão Duplicar
    actionsDuplicar.forEach(button => {
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
      fireEvent.click(button);
    });
    expect(handleDuplicar).toHaveBeenCalledTimes(mockData.length);

    // Clica em cada botão Excluir
    actionsExcluir.forEach(button => {
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
      fireEvent.click(button);
    });
    expect(handleExcluir).toHaveBeenCalledTimes(mockData.length);
  });

  test('deve exluir em lote', async () => {
    renderizaComponente();

    // Seleciona todos os itens usando o checkbox do header
    const checkboxes = screen.getAllByRole('checkbox');
    const selectAllCheckbox = checkboxes[0]; // Checkbox do header
    
    fireEvent.click(selectAllCheckbox);
    
    // Verifica se a barra de ação em lote aparece
    expect(screen.getByText('Excluir prioridades')).toBeInTheDocument();

    // Clica no botão de excluir em lote
    const excluirEmLoteButton = screen.getByText('Excluir prioridades');
    fireEvent.click(excluirEmLoteButton);

    // Verifica se a função handleExcluirEmLote foi chamada com os UUIDs corretos
    expect(handleExcluirEmLote).toHaveBeenCalledWith(['uuid1', 'uuid2', 'uuid3', 'uuid4']);
  });
}); 