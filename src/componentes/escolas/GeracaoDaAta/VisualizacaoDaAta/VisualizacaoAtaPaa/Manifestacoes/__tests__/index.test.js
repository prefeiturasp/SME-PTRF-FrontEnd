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

  it('deve renderizar o título principal do componente', () => {
    render(<Manifestacoes {...defaultProps} />);
    
    const titulo = screen.getByRole('heading', { name: /manifestações/i, level: 4 });
    expect(titulo).toBeInTheDocument();
  });

  describe('Renderização de Comentários', () => {
    it('deve renderizar os comentários quando fornecidos', () => {
      render(<Manifestacoes {...defaultProps} />);
      
      expect(screen.getByText('Comentário padrão da ata')).toBeInTheDocument();
    });

    it('não deve renderizar o parágrafo de comentários quando dadosAta.comentarios for nulo ou vazio', () => {
      const propsSemComentarios = {
        ...defaultProps,
        dadosAta: { ...defaultProps.dadosAta, comentarios: '' },
      };
      
      render(<Manifestacoes {...propsSemComentarios} />);
      
      expect(screen.queryByText('Comentário padrão da ata')).not.toBeInTheDocument();
    });
  });

  describe('Condições de Retorno Nulo do Parecer (Guard Clauses)', () => {
    it('deve retornar nulo se dadosAta.parecer_conselho não for fornecido', () => {
      const props = {
        ...defaultProps,
        dadosAta: { ...defaultProps.dadosAta, parecer_conselho: undefined },
      };
      render(<Manifestacoes {...props} />);
      
      expect(screen.queryByText(/diante ao exposto/i)).not.toBeInTheDocument();
    });

    it('deve retornar nulo se tabelas.pareceres não for fornecido', () => {
      const props = {
        ...defaultProps,
        tabelas: {},
      };
      render(<Manifestacoes {...props} />);
      
      expect(screen.queryByText(/diante ao exposto/i)).not.toBeInTheDocument();
    });

    it('deve retornar nulo se o parecer correspondente não for encontrado na tabela', () => {
      const props = {
        ...defaultProps,
        dadosAta: { ...defaultProps.dadosAta, parecer_conselho: 'ID_INEXISTENTE' },
      };
      render(<Manifestacoes {...props} />);
      
      expect(screen.queryByText(/diante ao exposto/i)).not.toBeInTheDocument();
    });

    it('deve retornar nulo se o parecerId não corresponder a nenhum padrão conhecido (Aprovado/Rejeitado/Reprovado)', () => {
      const props = {
        ...defaultProps,
        dadosAta: { ...defaultProps.dadosAta, parecer_conselho: 'OUTRO_STATUS' },
        tabelas: {
          pareceres: [{ id: 'OUTRO_STATUS' }]
        }
      };
      render(<Manifestacoes {...props} />);
      
      expect(screen.queryByText(/diante ao exposto/i)).not.toBeInTheDocument();
    });
  });

  describe('Fluxo de Aprovação', () => {
    it('deve exibir mensagem de aprovado sem o termo "retificado" por padrão', () => {
      render(<Manifestacoes {...defaultProps} />);
      
      const textoAprovado = screen.getByText(/diante ao exposto, o plano anual de atividades foi aprovado\./i);
      expect(textoAprovado).toBeInTheDocument();
      expect(textoAprovado).not.toHaveTextContent(/retificado/i);
    });

    it('deve exibir o termo "retificado" se paaRetificacao for verdadeiro e isLoading for falso', () => {
      const props = {
        ...defaultProps,
        paaRetificacao: true,
        isLoading: false,
      };
      render(<Manifestacoes {...props} />);
      
      expect(screen.getByText(/diante ao exposto, o plano anual de atividades retificado foi aprovado\./i)).toBeInTheDocument();
    });

    it('não deve exibir o termo "retificado" se paaRetificacao for verdadeiro mas isLoading for verdadeiro', () => {
      const props = {
        ...defaultProps,
        paaRetificacao: true,
        isLoading: true,
      };
      render(<Manifestacoes {...props} />);
      
      const textoAprovado = screen.getByText(/diante ao exposto, o plano anual de atividades foi aprovado\./i);
      expect(textoAprovado).toBeInTheDocument();
      expect(textoAprovado).not.toHaveTextContent(/retificado/i);
    });

    it('deve identificar a aprovação mesmo se o ID do parecer usar variações como minúsculas ou termos parciais ("APROV")', () => {
      const props = {
        ...defaultProps,
        dadosAta: { ...defaultProps.dadosAta, parecer_conselho: 'aprov' },
        tabelas: {
          pareceres: [{ id: 'aprov' }]
        }
      };
      render(<Manifestacoes {...props} />);
      
      expect(screen.getByText(/foi aprovado\./i)).toBeInTheDocument();
    });
  });

  describe('Fluxo de Reprovação / Rejeição', () => {
    const mockTabelasReprovacao = {
      pareceres: [
        { id: 'REJEITADA', nome: 'Rejeitada' },
        { id: 'REPROVADO_PELO_CONSELHO', nome: 'Reprovado' }
      ]
    };

    const propsReprovadaBase = {
      ...defaultProps,
      tabelas: mockTabelasReprovacao,
      dadosAta: {
        ...defaultProps.dadosAta,
        parecer_conselho: 'REJEITADA',
        justificativa: 'Justificativa de reprovação.',
      },
    };

    it('deve exibir mensagem de reprovado com a respectiva justificativa se fornecida', () => {
      render(<Manifestacoes {...propsReprovadaBase} />);
      
      const textoPrincipal = screen.getByText((content, element) => {
        const hasText = (node) => node.textContent.includes("Diante ao exposto, o Plano Anual de Atividades foi reprovado.");
        const nodeHasText = hasText(element);
        const childrenDontHaveText = Array.from(element.children).every(child => !hasText(child));
        return nodeHasText && childrenDontHaveText;
      });
      expect(textoPrincipal).toBeInTheDocument();

      expect(screen.getByText(/Justificativa de reprovação\./i)).toBeInTheDocument();
    });

    it('deve exibir mensagem de reprovado sem estourar erro se a justificativa não for fornecida', () => {
      const propsSemJustificativa = {
        ...propsReprovadaBase,
        dadosAta: {
          ...propsReprovadaBase.dadosAta,
          justificativa: undefined,
        },
      };
      render(<Manifestacoes {...propsSemJustificativa} />);
      
      const textoPrincipal = screen.getByText((content, element) => {
        const hasText = (node) => node.textContent.includes("Diante ao exposto, o Plano Anual de Atividades foi reprovado.");
        const nodeHasText = hasText(element);
        const childrenDontHaveText = Array.from(element.children).every(child => !hasText(child));
        return nodeHasText && childrenDontHaveText;
      });
      expect(textoPrincipal).toBeInTheDocument();

      expect(screen.queryByText(/Justificativa de reprovação\./i)).not.toBeInTheDocument();
    });

    it('deve identificar a reprovação se o ID contiver termos como "REPROV"', () => {
      const propsreprov = {
        ...defaultProps,
        tabelas: mockTabelasReprovacao,
        dadosAta: { ...defaultProps.dadosAta, parecer_conselho: 'REPROVADO_PELO_CONSELHO' }
      };
      render(<Manifestacoes {...propsreprov} />);
      
      expect(screen.getByText('reprovado')).toBeInTheDocument();
    });
  });
});

