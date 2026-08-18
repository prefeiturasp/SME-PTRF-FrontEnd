import { render, screen } from '@testing-library/react';
import { TotalRegistros } from "../index";

describe('TotalRegistros', () => {
  it('deve renderizar o componente com as propriedades corretas', () => {
    const titulo = 'Registros';
    const total_registros = 42;

    render(<TotalRegistros titulo={titulo} total_registros={total_registros} />);

    // Verifica se o título em minúsculas é exibido
    expect(screen.getByText(/registros/i)).toBeInTheDocument();

    // Verifica se o total de registros é exibido
    expect(screen.getByText(total_registros.toString())).toBeInTheDocument();
  });

  it('deve exibir o total em um span com classe "total"', () => {
    render(<TotalRegistros titulo="Dados" total_registros={10} />);

    const spanTotal = screen.getByText('10');
    expect(spanTotal).toHaveClass('total');
  });

  it('deve converter o título para minúsculas', () => {
    render(<TotalRegistros titulo="USUARIOS" total_registros={5} />);

    // Verifica se o texto exibido é "usuarios" (minúsculas)
    expect(screen.getByText(/exibindo/i)).toHaveTextContent('usuarios');
  });

  it('deve exibir o texto completo no formato correto', () => {
    render(<TotalRegistros titulo="Transações" total_registros={99} />);

    const paragraph = screen.getByText(/exibindo/i);
    expect(paragraph).toHaveTextContent('Exibindo 99 transações');
  });

  it('deve ter a classe CSS "mb-2" no parágrafo', () => {
    const { container } = render(<TotalRegistros titulo="Items" total_registros={7} />);

    const paragraph = container.querySelector('p.mb-2');
    expect(paragraph).toBeInTheDocument();
  });
});
