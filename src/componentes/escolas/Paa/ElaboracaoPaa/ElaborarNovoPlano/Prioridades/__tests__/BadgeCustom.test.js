import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BadgeCustom } from "../BadgeCustom";

describe("BadgeCustom", () => {
  it("deve acionar a ação ao clicar no rótulo", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <BadgeCustom
        buttonLabel="Capital"
        buttonColor="#297805"
        handleClick={handleClick}
      />
    );

    await user.click(screen.getByRole("button", { name: "Capital" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("!")).not.toBeInTheDocument();
  });

  it("deve destacar a prioridade com o indicador de atenção", () => {
    render(<BadgeCustom badge buttonLabel="Custeio" />);

    expect(screen.getByRole("button", { name: "Custeio" })).toBeInTheDocument();
    expect(screen.getByText("!")).toBeInTheDocument();
  });
});
