import React from 'react';
import { render, screen } from '@testing-library/react';
import { BarraAvisoErroProcessamentoPC } from '../BarraAvisoErroProcessamentoPC';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faExclamationCircle);

describe('BarraAvisoErroProcessamentoPC', () => {
  it('exibe mensagem de erro padrão quando "excede_tentativas" é false', () => {
    const registroFalha = {
      excede_tentativas: false,
      periodo_referencia: '01/2025',
    };

    render(<BarraAvisoErroProcessamentoPC registroFalhaGeracaoPc={registroFalha} />);

    expect(screen.getByText(
      /Erro no processamento da conclusão do período 01\/2025/i
    )).toBeInTheDocument();

    expect(screen.queryByText(/diversas tentativas/i)).not.toBeInTheDocument();
  });

  it('exibe mensagem de falha após várias tentativas quando "excede_tentativas" é true', () => {
    const registroFalha = {
      excede_tentativas: true,
      periodo_referencia: '03/2025',
    };

    render(<BarraAvisoErroProcessamentoPC registroFalhaGeracaoPc={registroFalha} />);

    expect(screen.getByText(
      /Já foram feitas diversas tentativas para a conclusão do período 03\/2025/i
    )).toBeInTheDocument();

    expect(screen.queryByText(/Erro no processamento/i)).not.toBeInTheDocument();
  });

  it('renderiza o ícone de aviso', () => {
    const registroFalha = {
      excede_tentativas: false,
      periodo_referencia: '04/2025',
    };

    const { container } = render(<BarraAvisoErroProcessamentoPC registroFalhaGeracaoPc={registroFalha} />);
    
    const iconElement = container.querySelector('.icone-barra-aviso-erro-conclusao-pc');
    expect(iconElement).toBeInTheDocument();
  });
});
