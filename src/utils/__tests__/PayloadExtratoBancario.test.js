import { criarPayloadExtratoBancario } from "../PayloadExtratoBancario";

describe("criarPayloadExtratoBancario", () => {
  it("deve criar payload correto com datas válidas", () => {
    const payload = criarPayloadExtratoBancario({
      periodoConta: { periodo: "p1", conta: "c1" },
      dataSaldoBancario: { data_extrato: "2025-08-27", saldo_extrato: "1000" },
      selectedFile: "arquivo.pdf",
      dataAtualizacaoComprovanteExtrato: "2025-08-27 12:34:56"
    });

    expect(payload).toEqual({
      periodo_uuid: "p1",
      conta_associacao_uuid: "c1",
      data_extrato: "2025-08-27",
      saldo_extrato: 1000,
      comprovante_extrato: "arquivo.pdf",
      data_atualizacao_comprovante_extrato: "2025-08-27 12:34:56",
    });
  });

  it("deve colocar null em datas inválidas", () => {
    const payload = criarPayloadExtratoBancario({
      periodoConta: { periodo: "p1", conta: "c1" },
      dataSaldoBancario: { data_extrato: "Invalid date", saldo_extrato: null },
      selectedFile: null,
      dataAtualizacaoComprovanteExtrato: "Invalid date"
    });

    expect(payload).toEqual({
      periodo_uuid: "p1",
      conta_associacao_uuid: "c1",
      data_extrato: null,
      saldo_extrato: 0,
      comprovante_extrato: null,
      data_atualizacao_comprovante_extrato: null,
    });
  });
});
