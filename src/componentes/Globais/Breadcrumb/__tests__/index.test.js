import { render, screen } from "@testing-library/react";
import BreadcrumbComponent from "../index";

describe("BreadcrumbComponent", () => {
  it('deve renderizar o breadcrumb com o item "Início"', () => {
    const items = [];

    render(<BreadcrumbComponent items={items} />);

    expect(screen.getByText("Início")).toBeInTheDocument();
  });

  it("deve renderizar os itens passados como props", () => {
    const items = [
      { label: "Categoria", url: "/categoria" },
      { label: "Produto", url: "/produto" },
    ];

    render(<BreadcrumbComponent items={items} />);

    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Produto")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Categoria/i })).toHaveAttribute(
      "href",
      "/categoria"
    );
    expect(screen.getByRole("link", { name: /Produto/i })).toHaveAttribute(
      "href",
      "/produto"
    );
  });

  it("deve renderizar itens sem URL como texto simples", () => {
    const items = [
      { label: "Categoria", url: "/categoria" },
      { label: "Produto", active: true },
    ];

    render(<BreadcrumbComponent items={items} />);

    expect(screen.getByText("Produto")).not.toHaveAttribute("href");
  });

  it('deve marcar o último item do breadcrumb como ativo', () => {
    const items = [
      { label: 'Página 1', url: '/pagina1' },
      { label: 'Página Atual', active: true }
    ];

    render(<BreadcrumbComponent items={items} />);

    const activeItem = screen.getByText('Página Atual');
    expect(activeItem).toHaveClass('active');
    expect(activeItem).toHaveAttribute('aria-current', 'page');
  });
});
