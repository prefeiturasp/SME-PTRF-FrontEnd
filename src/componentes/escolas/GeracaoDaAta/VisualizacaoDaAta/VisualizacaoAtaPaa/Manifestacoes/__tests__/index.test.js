import React from 'react';
import { render, screen } from '@testing-library/react';
import { Manifestacoes } from '../index';

describe('Componente Manifestacoes', () => {
  const mockTabelas = {
    pareceres: [
      { id: 'APROVADA', nome: 'Aprovada' },
      { id: 'REPROVADA', nome: 'Reprovada' },
    ],
  };

  const defaultProps = {
    dadosAta: {
      comentarios: 'Comentário padrão da ata',
      parecer_conselho: 'APROVADA',
      justificativa: '',
    },
    paaRetificacao: false,
    tabelas: mockTabelas,
    isLoading: false,
  };

  it('deve renderizar o título principal do componente quando houver comentários', () => {
    render(<Manifestacoes {...defaultProps} />);

    const titulo = screen.getByRole('heading', { name: /manifestações/i, level: 4 });
    expect(titulo).toBeInTheDocument();
  });

  describe('Renderização de Comentários', () => {
    it('deve renderizar os comentários quando fornecidos', () => {
      render(<Manifestacoes {...defaultProps} />);

      expect(screen.getByText('Comentário padrão da ata')).toBeInTheDocument();
    });

    it('não deve renderizar o título nem o parágrafo de comentários quando dadosAta.comentarios for nulo ou vazio', () => {
      const propsSemComentarios = {
        ...defaultProps,
        dadosAta: { ...defaultProps.dadosAta, comentarios: '' },
      };

      render(<Manifestacoes {...propsSemComentarios} />);

      expect(screen.queryByRole('heading', { name: /manifestações/i, level: 4 })).not.toBeInTheDocument();
      expect(screen.queryByText('Comentário padrão da ata')).not.toBeInTheDocument();
    });
  });
});
