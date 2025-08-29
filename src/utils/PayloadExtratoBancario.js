import dayjs from "dayjs";
import { trataNumericos } from "./ValidacoesAdicionaisFormularios";

export const criarPayloadExtratoBancario = ({
  periodoConta,
  dataSaldoBancario,
  selectedFile,
  dataAtualizacaoComprovanteExtrato
}) => {
  return {
    periodo_uuid: periodoConta.periodo,
    conta_associacao_uuid: periodoConta.conta,
    data_extrato: dataSaldoBancario.data_extrato && dayjs(dataSaldoBancario.data_extrato).isValid()
      ? dayjs(dataSaldoBancario.data_extrato).format("YYYY-MM-DD")
      : null,
    saldo_extrato: dataSaldoBancario.saldo_extrato
      ? trataNumericos(dataSaldoBancario.saldo_extrato)
      : 0,
    comprovante_extrato: selectedFile,
    data_atualizacao_comprovante_extrato: dataAtualizacaoComprovanteExtrato && dayjs(dataAtualizacaoComprovanteExtrato).isValid()
      ? dayjs(dataAtualizacaoComprovanteExtrato).format("YYYY-MM-DD HH:mm:ss")
      : null,
  };
};
