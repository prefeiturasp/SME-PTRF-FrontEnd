import { render, fireEvent, screen } from "@testing-library/react";
import { BadgeCustom } from "../BadgeCustom";
import { Button } from "antd";

jest.mock("antd", () => {
  const original = jest.requireActual("antd");
  return {
    ...original,
    Button: ({ children, ...props }) => (
      <button data-testid="antd-button" {...props}>
        {children}
      </button>
    ),
    Badge: ({ children, ...props }) => (
      <div data-testid="badge" {...props}>
        {children}
      </div>
    ),
  };
});

describe("BadgeCustom / ButtonCustom", () => {
  const defaultProps = {
    buttonlabel: "Salvar",
    buttoncolor: "#123456",
    handleClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o botão com o label correto", () => {
    render(<BadgeCustom {...defaultProps} badge={false} />);

    const botao = screen.getByTestId("antd-button");
    expect(botao).toBeInTheDocument();
    expect(botao).toHaveTextContent("Salvar");
  });

  it("aplica as cores e estilos corretamente", () => {
    render(<BadgeCustom {...defaultProps} badge={false} />);

    const botao = screen.getByTestId("antd-button");

    expect(botao).toHaveStyle({
      backgroundColor: "#123456",
      borderColor: "transparent",
      color: "white",
      fontSize: "11px",
      height: "18px",
    });
  });

  it("executa a função handleClick ao clicar", () => {
    render(<BadgeCustom {...defaultProps} badge={false} />);

    const botao = screen.getByTestId("antd-button");
    fireEvent.click(botao);

    expect(defaultProps.handleClick).toHaveBeenCalledTimes(1);
  });

  it("renderiza SEM badge quando props.badge = false", () => {
    render(<BadgeCustom {...defaultProps} badge={false} />);

    expect(screen.queryByTestId("badge")).toBeNull();
    expect(screen.getByTestId("antd-button")).toBeInTheDocument();
  });

  it("renderiza COM badge quando props.badge = true", () => {
    render(<BadgeCustom {...defaultProps} badge={true} />);

    expect(screen.getByTestId("badge")).toBeInTheDocument();
    expect(screen.getByTestId("antd-button")).toBeInTheDocument();
  });

  it("mostra o conteúdo do badge corretamente", () => {
    render(<BadgeCustom {...defaultProps} badge={true} />);

    const badge = screen.getByTestId("badge");
    expect(badge).toHaveAttribute("count", "!");
  });

  it("mantém o comportamento do botão dentro do badge", () => {
    render(<BadgeCustom {...defaultProps} badge={true} />);

    const botao = screen.getByTestId("antd-button");
    fireEvent.click(botao);

    expect(defaultProps.handleClick).toHaveBeenCalledTimes(1);
  });
});
