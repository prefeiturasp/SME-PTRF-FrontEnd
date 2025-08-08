import { render, screen, fireEvent } from '@testing-library/react';
import { BotaoConciliacao } from '../BotaoConciliacao';

describe('BotaoConciliacao', () => {
  const defaultProps = {
    statusPrestacaoConta: 'EM_ANDAMENTO',
    cssBotaoConciliacao: 'btn-primary',
    textoBotaoConciliacao: 'Conciliar',
    botaoConciliacaoReadonly: false,
    handleClickBotaoConciliacao: jest.fn(),
  };

  it('renderiza o botão com texto e classe correta', () => {
    render(<BotaoConciliacao {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /Conciliar/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn', 'btn-primary');
  });

  it('não renderiza o botão se statusPrestacaoConta for undefined', () => {
    render(<BotaoConciliacao {...defaultProps} statusPrestacaoConta={undefined} />);
    
    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  it('desabilita o botão quando botaoConciliacaoReadonly for true', () => {
    render(<BotaoConciliacao {...defaultProps} botaoConciliacaoReadonly={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('chama handleClickBotaoConciliacao ao clicar no botão', () => {
    render(<BotaoConciliacao {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(defaultProps.handleClickBotaoConciliacao).toHaveBeenCalledTimes(1);
  });

  it('exibe o texto do botão corretamente', () => {
    render(<BotaoConciliacao {...defaultProps} textoBotaoConciliacao="Validar" />);
    
    expect(screen.getByRole('button', { name: /Validar/i })).toBeInTheDocument();
  });
});
