import { VincularUnidades } from "./VincularUnidades"
import { UnidadesVinculadas } from "./UnidadesVinculadas"

export const VinculoUnidades = ({
  // Instância do Vínculo
  instanceUUID,
  instanceLabel,

  // Services API para Unidades Vinculadas
  apiServiceGetUnidadesVinculadas,
  apiServiceDesvincularUnidade,
  apiServiceDesvincularUnidadeEmLote,
  exibirUnidadesVinculadas=true,

  // Services API para Unidades Não vinculadas
  apiServiceGetUnidadesNaoVinculadas,
  apiServiceVincularUnidade,
  apiServiceVincularUnidadeEmLote,
  apiServiceVincularTodasUnidades,

  // Botoes extras
  extraUnidadesVinculadasButtonFilters=null,
  extraVincularUnidadesButtonFilters=null,

  // Header
  headerUnidadesVinculadas=null,
  headerVincularUnidades=null,

  // callback de Ações
  onDesvincular=()=>{},
  onVincular=()=>{},
  
}) => {
  if (!instanceUUID) throw new Error("VinculoUnidades: instanceUUID não informado");
  if (!instanceLabel) throw new Error("VinculoUnidades: instanceLabel não informado");

  if (!apiServiceGetUnidadesVinculadas) throw new Error("VinculoUnidades: Service API apiServiceGetUnidadesVinculadas não informado");
  if (!apiServiceDesvincularUnidade) throw new Error("VinculoUnidades: Service API apiServiceDesvincularUnidade não informado");
  if (!apiServiceDesvincularUnidadeEmLote) throw new Error("VinculoUnidades: Service API apiServiceDesvincularUnidadeEmLote não informado");
  
  if (!apiServiceGetUnidadesNaoVinculadas) throw new Error("VinculoUnidades: Service API apiServiceGetUnidadesNaoVinculadas não informado");
  if (!apiServiceVincularUnidade) throw new Error("VinculoUnidades: Service API apiServiceVincularUnidade não informado");
  if (!apiServiceVincularUnidadeEmLote) throw new Error("VinculoUnidades: Service API apiServiceVincularUnidadeEmLote não informado");
  if (!apiServiceVincularTodasUnidades) throw new Error("VinculoUnidades: Service API apiServiceVincularTodasUnidades não informado");
  
  return (
    <>
      <div>
          <UnidadesVinculadas
              instanceUUID={instanceUUID}
              instanceLabel={instanceLabel}
              exibirUnidadesVinculadas={exibirUnidadesVinculadas}
              apiServiceGetUnidadesVinculadas={apiServiceGetUnidadesVinculadas}
              apiServiceDesvincularUnidade={apiServiceDesvincularUnidade}
              apiServiceDesvincularUnidadeEmLote={apiServiceDesvincularUnidadeEmLote}
              apiServiceVincularTodasUnidades={apiServiceVincularTodasUnidades}
              extraButtonFilters={extraUnidadesVinculadasButtonFilters}
              header={headerUnidadesVinculadas}
              onDesvincular={onDesvincular}
          />
      </div>

      <div>
          <VincularUnidades
              instanceUUID={instanceUUID}
              instanceLabel={instanceLabel}
              apiServiceGetUnidadesNaoVinculadas={apiServiceGetUnidadesNaoVinculadas}
              apiServiceVincularUnidade={apiServiceVincularUnidade}
              apiServiceVincularUnidadeEmLote={apiServiceVincularUnidadeEmLote}
              extraButtonFilters={extraVincularUnidadesButtonFilters}
              header={headerVincularUnidades}
              onVincular={onVincular}
          />
      </div>
    </>
  )
}
