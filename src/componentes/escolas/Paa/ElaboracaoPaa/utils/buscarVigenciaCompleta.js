import { getVigenciaElaboracaoPaa } from "./../../../../../services/escolas/Paa.service";

export const buscarVigenciaCompleta = async (associacaoUuid) => {
    const primeiraPagina = await getVigenciaElaboracaoPaa(associacaoUuid, 1);
    const totalPaginas = primeiraPagina.periodos.total_pages;

    const demaisPaginas = await Promise.all(
      Array.from({ length: totalPaginas - 1 }, (_, i) =>
        getVigenciaElaboracaoPaa(associacaoUuid, i + 2)
      )
    );

    const periodos = [primeiraPagina, ...demaisPaginas].flatMap((pagina) => pagina.periodos.results);
    return {
        hoje: primeiraPagina.hoje,
        mes_elaboracao_paa: primeiraPagina.mes_elaboracao_paa,
        proximaVigenciaHabilitada: primeiraPagina.proxima_vigencia_habilitada,
        periodosSobrepostos: primeiraPagina.periodos_sobrepostos,
        statusVigenteExigidosParaProximaVigencia: primeiraPagina.status_vigente_exigidos_para_proxima_vigencia,
        periodos,
    };
};
