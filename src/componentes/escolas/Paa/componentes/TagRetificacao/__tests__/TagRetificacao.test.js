import { render, screen } from "@testing-library/react";
import { TagRetificacao } from "../index";

jest.mock("antd", () => ({
  Tag: ({ style, children }) => (
    <span data-testid="tag-retificacao" style={style}>
      {children}
    </span>
  ),
}));

describe("TagRetificacao", () => {
  it("renderiza o texto 'Em retificação'", () => {
    render(<TagRetificacao />);
    expect(screen.getByText("Em retificação")).toBeInTheDocument();
  });

  it("aplica backgroundColor white", () => {
    render(<TagRetificacao />);
    const tag = screen.getByTestId("tag-retificacao");
    expect(tag).toHaveStyle({ backgroundColor: "white" });
  });

  it("aplica color #01585E", () => {
    render(<TagRetificacao />);
    const tag = screen.getByTestId("tag-retificacao");
    expect(tag).toHaveStyle({ color: "#01585E" });
  });

  it("aplica border 2px solid #01585E", () => {
    render(<TagRetificacao />);
    const tag = screen.getByTestId("tag-retificacao");
    expect(tag).toHaveStyle({ border: "2px solid #01585E" });
  });

  it("renderiza o texto da prop label quando fornecida", () => {
    render(<TagRetificacao label="Texto customizado" />);
    expect(screen.getByText("Texto customizado")).toBeInTheDocument();
    expect(screen.queryByText("Em retificação")).not.toBeInTheDocument();
  });
});
