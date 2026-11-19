import { useMemo } from "react";
import { visoesService } from "../../../../../services/visoes.service";
import { calcularEstadoElaboracao } from "../regrasBotaoElaboracao";
import { useGetVigenciaElaboracaoPaa } from "./useGetVigenciaElaboracaoPaa";

// Estado da tela de elaboração: uma seção (período + botão) por período exibido.
export const useEstadoElaboracao = (associacaoUuid) => {
  const { vigencia, isLoading, isError } = useGetVigenciaElaboracaoPaa(associacaoUuid);
  const podeEditar = useMemo(() => visoesService.getPermissoes(["custom_change_paa"]), []);

  const estado = useMemo(
    () => (vigencia ? calcularEstadoElaboracao({ ...vigencia, podeEditar }) : null),
    [vigencia, podeEditar],
  );
  return { estado, isLoading, isError };
};
