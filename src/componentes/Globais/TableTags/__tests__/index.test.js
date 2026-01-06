import React from 'react';
import { render, screen } from '@testing-library/react';
import { TableTags } from '../index';
import '@testing-library/jest-dom';

jest.mock('react-tooltip', () => ({
  Tooltip: ({ children, id }) => <div data-testid={`tooltip-${id}`}>{children}</div>
}));

describe('TableTags', () => {
  const mockData = {
    informacoes: [
      {
        tag_id: 1,
        tag_nome: 'Tag 1',
        tag_hint: 'Dica da tag 1'
      },
      {
        tag_id: 2,
        tag_nome: 'Tag 2',
        tag_hint: ['Dica 1', 'Dica 2']
      }
    ]
  };

  const mockCoresTags = {
    1: 'tag-azul',
    2: 'tag-verde'
  };

  it('deve renderizar as tags corretamente', () => {
    render(<TableTags data={mockData} coresTags={mockCoresTags} />);
    
    expect(screen.getByText('Tag 1')).toBeInTheDocument();
    expect(screen.getByText('Tag 2')).toBeInTheDocument();
  });

  it('deve excluir tags quando estão em excludeTags', () => {
    render(<TableTags data={mockData} coresTags={mockCoresTags} excludeTags={['Tag 1']} />);
    
    expect(screen.queryByText('Tag 1')).not.toBeInTheDocument();
    expect(screen.getByText('Tag 2')).toBeInTheDocument();
  });

  it('deve retornar "-" quando não há informacoes', () => {
    render(<TableTags data={{}} coresTags={mockCoresTags} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('deve aplicar classe CSS correta baseada em tag_id', () => {
    const { container } = render(<TableTags data={mockData} coresTags={mockCoresTags} />);
    expect(container.querySelector('.tag-azul')).toBeInTheDocument();
    expect(container.querySelector('.tag-verde')).toBeInTheDocument();
  });
});

