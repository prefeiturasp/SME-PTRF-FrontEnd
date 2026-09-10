import { render, screen } from '@testing-library/react';
import AlertaMensagem from '../AlertaMensagem';

describe('AlertaMensagem', () => {
  it('renderiza a mensagem e o ícone quando a prop mensagem é informada', () => {
    render(<AlertaMensagem mensagem="Lembre-se que você pode realizar o bloqueio de saldo." />);

    expect(screen.getByText('Lembre-se que você pode realizar o bloqueio de saldo.')).toBeInTheDocument();
    expect(document.querySelector('.alert-mensagem')).toBeInTheDocument();
    expect(document.querySelector('.alert-icon')).toBeInTheDocument();
    expect(document.querySelector('.anticon-exclamation-circle')).toBeInTheDocument();
  });

  it('não renderiza nada quando a prop mensagem está vazia', () => {
    const { container } = render(<AlertaMensagem mensagem="" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('não renderiza nada quando a prop mensagem é undefined', () => {
    const { container } = render(<AlertaMensagem />);

    expect(container).toBeEmptyDOMElement();
  });
});
