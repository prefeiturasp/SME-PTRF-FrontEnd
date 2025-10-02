import { fireEvent, render, screen } from "@testing-library/react";
import { TabelaDownloads } from "../TabelaDownloads";

const arquivoConcluido = {
  id: "id-123",
  criado_em: "2025-04-24T17:35:32.940427",
  alterado_em: "2025-04-24T17:36:00.339650",
  uuid: "f5b6b04d-553b-435c-bd87-0663db976330",
  identificador: "despesas_documento.csv",
  informacoes:
    "Filtro aplicado: 01/07/2021 a 31/10/2021 (data de criação do registro)",
  arquivo: "despesas_documento_mKNvqQt.csv",
  status: "CONCLUIDO",
  msg_erro: "",
  lido: false,
  usuario: 5184,
};

const arquivoEmProcessamento = {
  id: "id-123",
  criado_em: "2025-04-24T17:35:32.940427",
  alterado_em: "2025-04-24T17:36:00.339650",
  uuid: "f5b6b04d-553b-435c-bd87-0663db976330",
  identificador: "despesas_documento.csv",
  informacoes:
    "Filtro aplicado: 01/07/2021 a 31/10/2021 (data de criação do registro)",
  arquivo: "despesas_documento_mKNvqQt.csv",
  status: "EM_PROCESSAMENTO",
  msg_erro: "",
  lido: false,
  usuario: 5184,
};

describe("TabelaDownloads", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("Deve renderizar tabela corretamente", async () => {
    const mockListaArquivos = [arquivoConcluido];
    render(<TabelaDownloads listaArquivos={mockListaArquivos} />);
    expect(
      screen.getByRole("columnheader", { name: /Identificador/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Informações/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Status/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Data de solicitação/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Visto/i })
    ).toBeInTheDocument();                
    expect(screen.getAllByRole("columnheader", { name: /Ações/i })[0]).toBeInTheDocument();                
  });

  it("adiciona a classe 'marcado-como-lido' quando lido é true", () => {
    const mockListaArquivos = [{ ...arquivoConcluido, lido: true }];

    const { container } = render(
      <TabelaDownloads listaArquivos={mockListaArquivos} />
    );

    const linhas = container.querySelectorAll("tr");
    const linhaComClasse = Array.from(linhas).find((linha) =>
      linha.classList.contains("marcado-como-lido")
    );

    expect(linhaComClasse).toBeTruthy();
  });

  it("renderiza 'Erro' e o ícone quando o status é ERRO", () => {
    const mockListaArquivos = [
      {
        id: "id-123",
        criado_em: "2025-04-24T17:35:32.940427",
        alterado_em: "2025-04-24T17:36:00.339650",
        uuid: "f5b6b04d-553b-435c-bd87-0663db976330",
        identificador: "despesas_documento.csv",
        informacoes:
          "Filtro aplicado: 01/07/2021 a 31/10/2021 (data de criação do registro)",
        arquivo: "despesas_documento_mKNvqQt.csv",
        status: "ERRO",
        msg_erro: "",
        lido: false,
        usuario: 5184,
      },
    ];
    render(<TabelaDownloads listaArquivos={mockListaArquivos} />);

    expect(screen.getByText("Erro")).toBeInTheDocument();
  });

  it("renderiza 'Em processamento' quando o status é EM_PROCESSAMENTO", () => {
    const mockListaArquivos = [arquivoEmProcessamento];
    render(<TabelaDownloads listaArquivos={mockListaArquivos} />);

    expect(screen.getByText("Em processamento")).toBeInTheDocument();
  });

  it("renderiza 'Concluído' quando o status é CONCLUIDO", () => {
    const mockListaArquivos = [arquivoConcluido];
    render(<TabelaDownloads listaArquivos={mockListaArquivos} />);

    expect(screen.getByText("Concluído")).toBeInTheDocument();
  });

  it("chama marcarDesmarcarLido com os parâmetros corretos ao clicar no checkbox", () => {
    const mockMarcarDesmarcarLido = jest.fn();
    const mockListaArquivos = [arquivoConcluido];

    render(
      <TabelaDownloads
        listaArquivos={mockListaArquivos}
        marcarDesmarcarLido={mockMarcarDesmarcarLido}
      />
    );

    const checkbox = screen.getByRole("checkbox", { name: /Checkbox visto/i });
    fireEvent.click(checkbox);

    expect(mockMarcarDesmarcarLido).toHaveBeenCalled();
  });

  it("chama downloadArquivo com os parâmetros corretos ao clicar no botão de download", () => {
    const mockDownloadArquivo = jest.fn();
    const mockListaArquivos = [arquivoConcluido];

    render(
      <TabelaDownloads
        listaArquivos={mockListaArquivos}
        downloadArquivo={mockDownloadArquivo}
      />
    );

    const button = screen.getByRole("button", { name: /Botão download/i });
    fireEvent.click(button);

    expect(mockDownloadArquivo).toHaveBeenCalled();
  });

  it("chama downloadArquivo com os parâmetros corretos ao clicar no botão de download", () => {
    const excluirArquivo = jest.fn();
    const mockListaArquivos = [arquivoConcluido];

    render(
      <TabelaDownloads
        listaArquivos={mockListaArquivos}
        excluirArquivo={excluirArquivo}
      />
    );

    const button = screen.getByRole("button", { name: /Botão excluir/i });
    fireEvent.click(button);

    expect(excluirArquivo).toHaveBeenCalled();
  });

  it("não renderiza o checkbox se status for 'EM_PROCESSAMENTO'", () => {
    const mockListaArquivos = [arquivoEmProcessamento];

    render(<TabelaDownloads listaArquivos={mockListaArquivos} />);

    expect(screen.queryByTestId("checkbox-visto")).toBeNull();
  });
});
