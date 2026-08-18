import { render, screen } from '@testing-library/react';
import { Tags } from '../index';

// Mock do wrapper de páginas
jest.mock('../../../../../../paginas/PaginasContainer', () => ({
  PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}));

// Mock do Context Provider (substituído por um wrapper simples)
jest.mock('../context/TagsContext', () => ({
  TagsContextProvider: ({ children }) => <div data-testid="tags-context-provider">{children}</div>,
}));

// Mock dos subcomponentes da tela
jest.mock('../../../componentes/AbasPorRecurso', () => ({
  AbasPorRecurso: () => <div data-testid="abas-por-recurso" />,
}));

jest.mock('../components/TopoComBotoes', () => ({
  TopoComBotoes: () => <div data-testid="topo-com-botoes" />,
}));

jest.mock('../components/Filtros', () => ({
  Filtros: () => <div data-testid="filtros" />,
}));

// Mocks para EXPORTAÇÕES DEFAULT: import Componente from '...'
jest.mock('../components/TabelaTags', () => () => <div data-testid="tabela-tags" />);
jest.mock('../components/ModalFormTags', () => () => <div data-testid="modal-form-tags" />);

describe('Componente da Página <Tags />', () => {
  it('deve renderizar a estrutura de layout e o título principal', () => {
    render(<Tags />);

    // Valida o título da página
    const titulo = screen.getByRole('heading', { level: 1, name: /etiquetas\/tags/i });
    expect(titulo).toBeInTheDocument();
    expect(titulo).toHaveClass('titulo-itens-painel');

    // Valida se os wrappers do layout foram renderizados
    expect(screen.getByTestId('paginas-container')).toBeInTheDocument();
    expect(screen.getByTestId('tags-context-provider')).toBeInTheDocument();
  });

  it('deve renderizar todos os subcomponentes na ordem correta', () => {
    render(<Tags />);

    expect(screen.getByTestId('abas-por-recurso')).toBeInTheDocument();
    expect(screen.getByTestId('topo-com-botoes')).toBeInTheDocument();
    expect(screen.getByTestId('filtros')).toBeInTheDocument();
    expect(screen.getByTestId('tabela-tags')).toBeInTheDocument();
    expect(screen.getByTestId('modal-form-tags')).toBeInTheDocument();
  });
});