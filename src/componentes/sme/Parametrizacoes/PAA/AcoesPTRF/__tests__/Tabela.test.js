import { render, screen, fireEvent } from "@testing-library/react";
import { Tabela } from "../Tabela";
import { AcoesPTRFPaaContext } from "../context/index";
import { useGet } from "../hooks/useGet";
import { usePatch } from "../hooks/usePatch";
import { mockData } from "../__fixtures__/mockData";

// Mock das hooks
jest.mock("../hooks/useGet");
jest.mock("../hooks/usePatch");

const mockMutationPatchMutate = jest.fn();

const contexto = {
  patchingLoadingUUID: null,
  setPatchingLoadingUUID: jest.fn()
}

describe("Tabela", () => {
  const renderComponent = () => {
    return render(
      <AcoesPTRFPaaContext.Provider value={contexto}>
        <Tabela />
      </AcoesPTRFPaaContext.Provider>
    );
  }
  beforeEach(() => {
    useGet.mockReturnValue({
      isLoading: false,
      data: mockData,
    });

    usePatch.mockReturnValue({
      mutationPatch: { mutate: mockMutationPatchMutate },
    });

  });

  it("deve renderizar a tabela com dados", () => {
    renderComponent()
    mockData.forEach((row) => {
      expect(screen.getByText(row.nome)).toBeInTheDocument();
    })
  });

  it("deve exibir mensagem quando não houver dados", () => {
    useGet.mockReturnValue({ isLoading: false, data: [] });

    renderComponent()
    expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
  });

  it("Deve chamar mutationPatch.mutate quando switch for clicado", async () => {
    renderComponent();

    const switches_toggle = screen.getAllByRole('switch', { selector: '.ant-switch' });
    switches_toggle.forEach((switch_toggle) => {
      expect(switch_toggle).toBeInTheDocument();
      fireEvent.click(switch_toggle);
    })
    expect(mockMutationPatchMutate).toHaveBeenCalledTimes(switches_toggle.length);
    expect(contexto.setPatchingLoadingUUID).toHaveBeenCalled();
  });

});
