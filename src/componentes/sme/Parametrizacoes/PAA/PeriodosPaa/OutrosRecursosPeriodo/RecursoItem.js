import { useState, useEffect, useMemo } from "react";
import { Row, Col, Typography, Switch, Collapse, Spin, Divider, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { BadgeCustom } from "../../../../../Globais/BadgeCustom";
import { useGetOutrosRecursosPeriodoPaa } from "./hooks/useGet";
import { usePatchOutroRecursoPeriodo, usePatchDesativarOutroRecursoPeriodo } from "./hooks/usePatch";
import { usePostOutroRecursoPeriodo } from "./hooks/usePost";
import { VinculoUnidades } from "./../../../../../Globais/VincularUnidades";
import { ImportarUnidades } from "./ImportarUnidades";
import { useDispatch } from "react-redux";
import { ModalConfirm } from "../../../../../Globais/Modal/ModalConfirm";
import {
    getUnidadesNaoVinculadasOutrosRecursosPeriodoPaa,
    postVincularUnidadeOutrosRecursosPeriodoPaa,
    postVincularUnidadeOutrosRecursosPeriodoPaaEmLote,

    getUnidadesVinculadasOutrosRecursosPeriodoPaa,
    postDesvincularUnidadeOutrosRecursosPeriodoPaa,
    postDesvincularUnidadeOutrosRecursosPeriodoPaaEmLote,
    postVincularTodasUnidadesOutrosRecursosPeriodoPaa,
} from "../../../../../../services/sme/Parametrizacoes.service";

import { toastCustom } from "../../../../../Globais/ToastCustom";

export const RecursoItem = ({recurso, periodoUuid}) => {
    /** Este componente exibe o Objeto 'Outro Recurso' (a partir de uma lista Paginada). 
     * E, a partir dele, é requisitado o Objeto 'Outro Recurso do Período'
     * pelo filtro 'periodo_paa_uuid' e 'outro_recurso_uuid' e Salvo no stateOutroRecursoPeriodo.
     * Para o Swicth Ativar/Desativar, se já existe instancia de 'Outro Recurso do Período',
     * ele atualiza o campo 'ativo' no Objeto 'Outro Recurso do Período'.
     * Caso contrário, ele cria um novo Objeto 'Outro Recurso do Período'.
     **/

    const dispatch = useDispatch();

    // Filtro para buscar o Outro Recurso do Período (de acordo com o Outro Recurso Listado e Período PAA em edição)
    const filtroOutroRecursoPeriodo = { periodo_paa_uuid: periodoUuid, outro_recurso_uuid: recurso?.uuid}

    const {
        data: outrosRecursosPeriodo,
        isLoading: isLoadingOutroRecursoPeriodo,
        refetch: refetchOutroRecursoPeriodo
    } = useGetOutrosRecursosPeriodoPaa(filtroOutroRecursoPeriodo)

    const outroRecursoPeriodo = outrosRecursosPeriodo?.results?.find(i => i.periodo_paa === periodoUuid && i.outro_recurso === recurso?.uuid)
    
    const mutationPatch = usePatchOutroRecursoPeriodo()
    const mutationPatchDesativar = usePatchDesativarOutroRecursoPeriodo()
    const mutationPost = usePostOutroRecursoPeriodo()
    
    const [ stateOutroRecursoPeriodo, setStateOutroRecursoPeriodo ] = useState({})
    const [ stateCheckAtivo, setStateCheckAtivo ] = useState(false)

    const mutateLoading = useMemo(() => 
        mutationPatch.isPending ||
        mutationPatchDesativar.isPending ||
        mutationPost.isPending
    ,
    [mutationPatch.isPending, mutationPost.isPending, mutationPatchDesativar.isPending])

    const onVincularUnidades = ()=>{
        refetchOutroRecursoPeriodo()
    }

    const onDesvincularUnidades = ()=>{
        refetchOutroRecursoPeriodo()
    }

    useEffect(() => {
        setStateOutroRecursoPeriodo(outroRecursoPeriodo || {})
        setStateCheckAtivo(!!outroRecursoPeriodo?.ativo)
    }, [outroRecursoPeriodo])

    const handleAtivarOutroRecursoPeriodo = async (ativo) => {
        try {
            await mutationPatch.mutateAsync({
                uuid: outroRecursoPeriodo?.uuid,
                payload: { ativo }
            })
            setStateCheckAtivo(ativo)
            toastCustom.ToastCustomSuccess(`Recurso ativado com sucesso.`);
        } catch (e) {
            toastCustom.ToastCustomError(
                `Erro ao ativar recurso`,
                e.response.data.non_field_errors ||
                e.response.data.detail ||
                e.response.data.mensagem ||
                'Falha ao ativar recurso'
            )
            console.error(e)
        } finally {
            await refetchOutroRecursoPeriodo()
        }
    }

    const handleDesativarOutroRecursoPeriodo = async () => {
        try {
            await mutationPatchDesativar.mutateAsync({
                uuid: outroRecursoPeriodo?.uuid
            })
            setStateCheckAtivo(false)
            toastCustom.ToastCustomSuccess(`Recurso desativado com sucesso.`);
        } catch (e) {
            toastCustom.ToastCustomError(
                `Erro ao desativar recurso`,
                e.response.data.non_field_errors ||
                e.response.data.detail ||
                e.response.data.mensagem ||
                'Falha ao desativar recurso'
            )
            console.error(e)
        } finally {
            await refetchOutroRecursoPeriodo()
        }
    }

    const handleCriarOutroRecursoPeriodo = async () => {
        try {
            await mutationPost.mutateAsync({payload: { periodo_paa: periodoUuid, outro_recurso: recurso?.uuid }})
            await refetchOutroRecursoPeriodo()
        } catch (e) {
            console.error(e)
        }
    }

    const onChangeCheckAtivo = (e) => {
        if(stateOutroRecursoPeriodo?.uuid){
            /* Quando existe outroRecursoPeriodo já criado para o Outro Recurso do Período */
            if (!e) {
                ModalConfirm({
                    dispatch,
                    title: "Desvinculação de recurso no PAA",
                    children: <>
                        <p style={{fontSize: "14px", fontWeight: "bold"}}>
                            As receitas previstas e prioridades serão removidas dos PAAs que estão em elaboração.
                        </p>
                        <p style={{fontSize: "14px"}}>
                            Confirma a desvinculação do recurso para o período do PAA?
                        </p>
                    </>,
                    cancelText: "Cancelar",
                    confirmText: "Confirmar",
                    confirmButtonClass: "btn-success",
                    dataQa: "modal-confirmar-desativacao-recurso-periodo",
                    onConfirm: () => handleDesativarOutroRecursoPeriodo(),
                });
            } else {
                handleAtivarOutroRecursoPeriodo(e)
            }
        } else {
            /* Quando não existe outroRecursoPeriodo cadastrado, então, somente criar */
            handleCriarOutroRecursoPeriodo()
        }
    }

    const badgeUsoAssociacao = () => {
        const labelUsoAssociacao = stateOutroRecursoPeriodo?.uso_associacao || '-'
        const colorUsoAssociacao = stateOutroRecursoPeriodo?.uso_associacao === 'Todas' ? '#2B7D83' : 'orange'

        return (
            <>
                {!!stateOutroRecursoPeriodo?.uso_associacao ? <BadgeCustom
                    buttoncolor={colorUsoAssociacao}
                    buttonlabel={labelUsoAssociacao}
                    style={{ width: '120px' }}
                /> : '-'}
            </>
        )
    }
    
    const mapBooleanFieldsLabel = (recurso) => {
        const mapBool = {
            aceita_capital: "Capital",
            aceita_custeio: "Custeio",
            aceita_livre_aplicacao: "Livre aplicação",
        }
        const label = Object.entries(mapBool)
            .filter(([key]) => recurso[key] === true)
            .map(([, label]) => label)
            .join(" • ");

        return label || '-'
    }

    const cardRecursoItem = () => {
        return (
            <Spin spinning={mutateLoading || isLoadingOutroRecursoPeriodo}>
                <Row>
                    <Col span={3} align="middle" style={{ alignContent: "center"}}>
                        <Switch size="large" style={{ pointerEvents: 'all' }}
                            checked={stateCheckAtivo}
                            onChange={onChangeCheckAtivo}/>
                    </Col>
                    <Col flex='auto'>
                        <Row>
                            <Col span={12}>
                                <div className="my-1">
                                    <Typography.Text strong>{recurso.nome}</Typography.Text>
                                </div>
                                <div className="my-1">
                                    <Typography.Text type="secondary">
                                        {mapBooleanFieldsLabel(recurso)}
                                    </Typography.Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                {!!stateOutroRecursoPeriodo?.uuid && <>
                                    <div className="my-1">
                                        <Typography.Text strong>Uso associação</Typography.Text>
                                    </div>
                                    <div className="my-1">
                                        {badgeUsoAssociacao()}
                                    </div>
                                </>}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Spin>
        )
    }

    const extraButtonFilters = <>
        <ImportarUnidades outroRecursoPeriodo={outroRecursoPeriodo} />
    </>

    const headerUnidadesVinculadas = <div>
        <Typography.Text level={5} strong>Unidades vinculadas ao {outroRecursoPeriodo?.outro_recurso_objeto?.nome}</Typography.Text>
    </div>

    const headerVincularUnidades = <div>
        <Typography.Text level={5} strong>Unidades não vinculadas ao {outroRecursoPeriodo?.outro_recurso_objeto?.nome}</Typography.Text>
    </div>;

    const CollapseChildrenItemVinculoUnidades = () => {
        return (
            <div style={{ pointerEvents: 'all' /* mantem os componentes clicáveis (desativados no comportamento do Collapse) */ }}>
                <Spin spinning={isLoadingOutroRecursoPeriodo}>
                    <VinculoUnidades
                        hooksKey={recurso?.uuid}
                        instanceUUID={outroRecursoPeriodo?.uuid}
                        instanceLabel={recurso?.nome}

                        apiServiceGetUnidadesNaoVinculadas={getUnidadesNaoVinculadasOutrosRecursosPeriodoPaa}
                        apiServiceVincularUnidade={postVincularUnidadeOutrosRecursosPeriodoPaa}
                        apiServiceVincularUnidadeEmLote={postVincularUnidadeOutrosRecursosPeriodoPaaEmLote}

                        apiServiceGetUnidadesVinculadas={getUnidadesVinculadasOutrosRecursosPeriodoPaa}
                        apiServiceDesvincularUnidade={postDesvincularUnidadeOutrosRecursosPeriodoPaa}
                        apiServiceDesvincularUnidadeEmLote={postDesvincularUnidadeOutrosRecursosPeriodoPaaEmLote}
                        apiServiceVincularTodasUnidades={postVincularTodasUnidadesOutrosRecursosPeriodoPaa}
                        exibirUnidadesVinculadas={(outroRecursoPeriodo?.unidades||[]).length > 0}

                        extraUnidadesVinculadasButtonFilters={null}
                        extraVincularUnidadesButtonFilters={extraButtonFilters}
                        headerUnidadesVinculadas={headerUnidadesVinculadas}
                        headerVincularUnidades={headerVincularUnidades}

                        onDesvincular={onDesvincularUnidades}
                        onVincular={onVincularUnidades}
                    />
                </Spin>
            </div>
        )
    }

    const itemRecurso = [
        {
            key: recurso?.uuid,
            label: cardRecursoItem(),
            children: <CollapseChildrenItemVinculoUnidades />,
        },
    ];
        
    return (
        
        <Collapse
            collapsible="icon"
            className="mb-3"
            style={{ background: "transparent", pointerEvents: 'none'  }}
            expandIconPosition="end"
            expandIcon={({ isActive }) => stateOutroRecursoPeriodo?.uuid ? <FontAwesomeIcon style={
                { fontSize: "18px", position: 'absolute', top: 25, right: 20, pointerEvents: 'all' }} 
            icon={isActive ? faChevronDown : faChevronUp} />: null}
            bordered={true}
            items={itemRecurso} />
    )
}
