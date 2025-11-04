import { useContext, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tooltip } from "antd";
import { AcoesPTRFPaaContext } from './context/index';
import { useGet } from "./hooks/useGet";
import { usePatch } from './hooks/usePatch';
import {MsgImgCentralizada} from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg";
import { Switch, Spin } from 'antd';
import { ModalConfirmarExclusao as ModalConfirmarDesabilitarPTRF } from "../../componentes/ModalConfirmarExclusao";

export const Tabela = () => {

    //useState para loading e desativação apenas do botão switch clicado
    const { patchingLoadingUUID, setPatchingLoadingUUID } = useContext(AcoesPTRFPaaContext)

    const [showModalConfirmarDesabilitarAcao, setShowModalConfirmarDesabilitarAcao] = useState({open: false, form: {}});
    const { isLoading, data } = useGet()
    const { mutationPatch } = usePatch()

    const results = data

    const acoesTemplate = (rowData) => {
        return (
            <Tooltip title="Alterna exibição no PAA" placement='left'>
                <Switch
                    style={{ width: 86 }}
                    value={rowData.exibir_paa}
                    onChange={(e) => handleSubmit(rowData, e)}
                    disabled={mutationPatch.isPending || !!patchingLoadingUUID}
                    loading={mutationPatch.isPending && rowData.uuid === patchingLoadingUUID}
                    />
            </Tooltip>
        )
    };

    const handleCloseConfirmarDesabilitarAcao = () => {
        setShowModalConfirmarDesabilitarAcao({open: false, form: {}});
    };

    const handleSubmit = async (values, newValue) => {
        const valor_anterior = values.exibir_paa
        const valor_novo = newValue

        setPatchingLoadingUUID(values.uuid)
        // valida quando uma ação estiver sendo desabilitada
        const desabilitando_acao = valor_anterior && !valor_novo
        // verifica quando houver receitas previstas indicadas
        const tem_receitas_previstas_indicadas = values?.tem_receitas_previstas_paa_em_elaboracao;
        const tem_prioridades = values?.tem_prioridades_paa_em_elaboracao;
        if (desabilitando_acao && (tem_receitas_previstas_indicadas || tem_prioridades)) {
            // Exibe Modal de confirmação da desativacão da ação, 
            // guardando o values para ser utilizado posteriormente na modal de
            // confirmação sem a perda dos dados em edição
            setShowModalConfirmarDesabilitarAcao({open: true, form: values});            
        } else {
            // Fluxo normal
            await handleToggleExibirPaa(values);
        }
        setPatchingLoadingUUID(null)
    }

    const handleToggleExibirPaa = async (values) => {
        // Libera o botão somente após ter resolvido a mutation em usePatch
        setPatchingLoadingUUID(values.uuid)
        let payload = {
            exibir_paa: !values.exibir_paa,
        };
        mutationPatch.mutate({uuid: values.uuid, payload: payload})
        handleCloseConfirmarDesabilitarAcao()
        setPatchingLoadingUUID(null)
    };

    return (
        <>
            <Spin spinning={isLoading} >
                {results && results.length > 0 ? (
                    <div className="p-2">
                        <DataTable
                            value={results}
                            className='tabela-lista-acoes-ptrf-paa'
                            data-qa='tabela-lista-acoes-ptrf-paa'>
                            <Column field="nome" header="Ações PTRF" textAlign="center"/>
                            <Column
                                field="acao"
                                header="Exibição no PAA"
                                body={acoesTemplate}
                                style={{width: '150px', textAlign: "center",}}/>
                        </DataTable>
                    </div>
                ) :
                <MsgImgCentralizada
                    data-qa="imagem-lista-sem-acoes-ptrf-paa"
                    texto='Nenhum resultado encontrado.'
                    img={Img404}
                />
                }
            </Spin>
            <section>
                <ModalConfirmarDesabilitarPTRF
                    open={showModalConfirmarDesabilitarAcao?.open}
                    onOk={() => handleToggleExibirPaa(showModalConfirmarDesabilitarAcao?.form)}
                    okText="Confirmar"
                    onCancel={handleCloseConfirmarDesabilitarAcao}
                    cancelText="Cancelar"
                    cancelButtonProps={{ className: "btn-base-verde-outline-desabilita-acao" }}
                    titulo="Desabilitar ação PTRF"
                    bodyText={
                    <p>A acão PTRF que deseja desabilitar possui receitas previstas indicadas e/ou prioridades no PAA. Deseja continuar?</p>
                    }
                />
            </section>
        </>
    )
}