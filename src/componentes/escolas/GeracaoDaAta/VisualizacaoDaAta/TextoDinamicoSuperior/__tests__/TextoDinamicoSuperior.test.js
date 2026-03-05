import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextoDinamicoSuperior } from '../index';

// Mock do hook useRecursoSelecionado
jest.mock('../../../../../../hooks/Globais/useRecursoSelecionado', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../../../../../../services/visoes.service', () => ({
  visoesService: {}
}));

describe('TextoDinamicoSuperior - Verificação de Nome do Recurso', () => {
  const mockUseRecursoSelecionado = require('../../../../../../hooks/Globais/useRecursoSelecionado').default;

  const dadosAtaMock = {
    tipo_ata: 'APRESENTACAO',
    associacao: {
      nome: 'Associação Teste',
      unidade: {
        nome: 'Escola Teste',
        tipo_unidade: 'EMEI'
      }
    },
    local_reuniao: 'Sala de reuniões',
    hora_reuniao: '14:00'
  };

  const retornaDadosAtaFormatadoMock = (campo) => {
    const dados = {
      'tipo_reuniao': 'ORDINÁRIA',
      'periodo.data_inicio_realizacao_despesas': '01/01/2024',
      'periodo.data_fim_realizacao_despesas': '31/12/2024',
      'periodo.referencia': 'Janeiro a Dezembro de 2024',
      'data_reuniao': '15/01/2025'
    };
    return dados[campo] || '';
  };

  it('deve renderizar o nome do recurso selecionado no texto', () => {
    mockUseRecursoSelecionado.mockReturnValue({
      recursoSelecionado: {
        nome_exibicao: 'PTRF'
      }
    });

    render(
      <TextoDinamicoSuperior
        dadosAta={dadosAtaMock}
        retornaDadosAtaFormatado={retornaDadosAtaFormatadoMock}
        prestacaoDeContasDetalhe={null}
      />
    );

    expect(screen.getByText(/PTRF/)).toBeInTheDocument();
  });

  it('deve atualizar o nome do recurso quando o recurso é alterado', () => {
    mockUseRecursoSelecionado.mockReturnValue({
      recursoSelecionado: {
        nome_exibicao: 'PTRF'
      }
    });

    const { rerender } = render(
      <TextoDinamicoSuperior
        dadosAta={dadosAtaMock}
        retornaDadosAtaFormatado={retornaDadosAtaFormatadoMock}
        prestacaoDeContasDetalhe={null}
      />
    );

    expect(screen.getByText(/PTRF/)).toBeInTheDocument();

    // Alterar o recurso
    mockUseRecursoSelecionado.mockReturnValue({
      recursoSelecionado: {
        nome_exibicao: 'PEE'
      }
    });

    rerender(
      <TextoDinamicoSuperior
        dadosAta={dadosAtaMock}
        retornaDadosAtaFormatado={retornaDadosAtaFormatadoMock}
        prestacaoDeContasDetalhe={null}
      />
    );

    expect(screen.getByText(/PEE/)).toBeInTheDocument();
  });
});
