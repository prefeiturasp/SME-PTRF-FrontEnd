import { OutrosRecursosPeriodosPaaProvider } from "./context/index";
import { Paginacao } from "./Paginacao";
import { Filtros } from "./Filtros";
import { Typography } from "antd";
import { useGetOutrosRecursos } from "./hooks/useGet";
import { RecursoItem } from "./RecursoItem";

export const HabilitarOutrosRecursosComponent = ({periodoUuid}) => {

    const { data: outrosRecursos } = useGetOutrosRecursos()

    return (
    <>
        {!!periodoUuid && <>
            <Typography.Title level={5}>Habilitar Outros Recursos</Typography.Title>

            {/* Filtro para vínculo de Recursos no Período */}
            <Filtros />

            {/* Vínculo de Recursos no Período */}
            <div>
                <Typography.Text type="secondary">
                    Para cada recurso habilitado, vincule UEs ou importe uma lista. Sem seleção,
                    todas as UEs disponíveis serão vinculadas.
                </Typography.Text>
                
                {(outrosRecursos?.results||[]).map((item, index) => (
                    <RecursoItem key={index} recurso={item} periodoUuid={periodoUuid}/>
                ))}
            </div>

            {/* Paginação de Recursos no Período */}
            <Paginacao/>
        </>}
    </>
    );
};




export const HabilitarOutrosRecursos = ({periodoUuid}) => {
    return (
        <OutrosRecursosPeriodosPaaProvider>
            <HabilitarOutrosRecursosComponent periodoUuid={periodoUuid}/>
        </OutrosRecursosPeriodosPaaProvider>   
    )
}