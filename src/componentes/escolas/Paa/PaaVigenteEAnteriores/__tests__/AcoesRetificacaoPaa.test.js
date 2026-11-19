import React from 'react';
import { render, screen } from '@testing-library/react';
import { AcoesRetificacaoPaa } from '../components/AcoesRetificacaoPaa';
import { SecaoProximaVigencia } from '../components/SecaoProximaVigencia';

jest.mock('../../../../../services/visoes.service', () => ({
  visoesService: { featureFlagAtiva: () => true, getPermissoes: () => true },
}));
jest.mock('../components/BotaoRetificarPaa/BotaoRetificarPaa', () => ({
  BotaoRetificarPaa: ({ paa }) => <button data-testid="retificar" data-status={paa.status} data-uuid={paa.uuid} />,
}));
jest.mock('../../componentes/CancelarRetificacao', () => ({
  __esModule: true,
  default: ({ paa }) => <button data-testid="cancelar" data-uuid={paa.uuid} />,
}));
jest.mock('../components/PaaCard/PaaCard', () => ({ PaaCard: () => <div data-testid="paa-card" /> }));

const paa = (sobrescrever = {}) => ({
  uuid: 'paa-1', referencia: '2027', pode_retificar: true, esta_em_retificacao: false,
  ciclo_retificacao_sem_documento: false, original: { documento: { status: { mensagem: 'ok' } } },
  ...sobrescrever,
});

describe('AcoesRetificacaoPaa', () => {
  it('exibe Retificar quando o PAA pode ser retificado', () => {
    render(<AcoesRetificacaoPaa dados={paa()} />);

    expect(screen.getByTestId('retificar')).toHaveAttribute('data-status', 'GERADO');
    expect(screen.getByTestId('retificar')).toHaveAttribute('data-uuid', 'paa-1');
  });

  it('em retificação, trata o PAA como EM_RETIFICACAO', () => {
    render(<AcoesRetificacaoPaa dados={paa({ pode_retificar: false, esta_em_retificacao: true, ciclo_retificacao_sem_documento: true })} />);

    expect(screen.getByTestId('retificar')).toHaveAttribute('data-status', 'EM_RETIFICACAO');
  });

  it('não exibe nada quando o PAA não pode ser retificado', () => {
    render(<AcoesRetificacaoPaa dados={paa({ pode_retificar: false })} />);

    expect(screen.queryByTestId('retificar')).not.toBeInTheDocument();
  });
});

describe('SecaoProximaVigencia', () => {
  it('oferece a retificação do PAA da Próxima Vigência', () => {
    render(<SecaoProximaVigencia paa={paa({ uuid: 'proxima-1' })} onDadosAtualizados={jest.fn()} />);

    expect(screen.getByTestId('retificar')).toHaveAttribute('data-uuid', 'proxima-1');
  });

  it('sem retificação disponível, só mostra o Plano', () => {
    render(<SecaoProximaVigencia paa={paa({ pode_retificar: false })} onDadosAtualizados={jest.fn()} />);

    expect(screen.queryByTestId('retificar')).not.toBeInTheDocument();
    expect(screen.getByTestId('paa-card')).toBeInTheDocument();
  });
});
