import React, { useContext } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tooltip } from "antd";
import { IconButton } from "../../../../Globais/UI";
import moment from "moment";
import Loading from "../../../../../utils/Loading";
import { PeriodosPaaContext } from './context/index';
import { useGet } from "./hooks/useGet";
import { usePost } from './hooks/usePost';
import { usePatch } from './hooks/usePatch';
import { useDelete } from './hooks/useDelete';
import { ModalForm } from "./ModalForm";
import {MsgImgCentralizada} from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg";
import { ModalConfirmarExclusao } from "../../componentes/ModalConfirmarExclusao"

export const Tabela = () => {

  const {
    setShowModalForm,
    stateFormModal,
    setStateFormModal,
    setBloquearBtnSalvarForm,
    showModalForm,
    showModalConfirmacaoExclusao,
    setShowModalConfirmacaoExclusao
    } = useContext(PeriodosPaaContext)
  const { isLoading, data, total, count } = useGet()
  const { mutationPost } = usePost()
  const { mutationPatch } = usePatch()
  const { mutationDelete } = useDelete()

  // Necessária pela paginação
  const {results} = data;

  const acoesTemplate = (rowData) => {
      return (
          rowData?.editavel ? (
            <Tooltip title="Editar período do PAA">
                <IconButton
                    icon="faEdit"
                    iconProps={{style: {fontSize: '20px', marginRight: "0", color: "#00585E"}}}
                    onClick={() => handleEditFormModal(rowData)}
                    aria-label="Editar"
                    className="btn-Editar-periodo"
                />
            </Tooltip>
        ) : (
            <Tooltip title="Visualizar período do PAA">
                <IconButton
                    icon="faEye"
                    iconProps={{style: {fontSize: '20px', marginRight: "0", color: "#00585E"}}}
                    onClick={() => handleEditFormModal(rowData)}
                    aria-label="Visualizar"
                    className="btn-visualizar-periodo"
                />
            </Tooltip>
        )
      )
  };

  const handleEditFormModal = (rowData) => {
    setStateFormModal({
        ...stateFormModal,
        referencia: rowData.referencia,
        data_inicial: rowData.data_inicial,
        data_final: rowData.data_final,
        editavel: rowData.editavel,
        uuid: rowData.uuid,
        id: rowData.id,
        operacao: 'edit'
    });
    setShowModalForm(true)
  };

  const handleSubmitFormModal = async (values) => {
    // Libera o botão somente após ter resolvido a mutation em usePost e usePatch
    setBloquearBtnSalvarForm(true)
    let payload = {
        referencia: values.referencia,
        data_inicial: values.data_inicial,
        data_final: values.data_final,
    };

    if (!values.uuid) {
        mutationPost.mutate({payload: payload})
    } else {
        mutationPatch.mutate({uuid: values.uuid, payload: payload})
    }
  };

  const handleExcluir = async (uuid) => {
    if (!uuid) {
        console.log("Período de PAA sem UUID. Não é possível excluir")
    } else {
        mutationDelete.mutate(uuid)
        setShowModalConfirmacaoExclusao(false)
    }
  };

  const dataTemplate = (rowData, column) => {
        return (
            <div>
                {rowData[column.field] ? moment(rowData[column.field]).format('MM/YYYY') : ''}
            </div>
        )
    };

  if (isLoading) {
    return (
        <Loading
            corGrafico="black"
            corFonte="dark"
            marginTop="0"
            marginBottom="0"
        />
    );
  }
  return (
    <>
        {results && results.length > 0 ? (
            <div className="p-2">
                {!isLoading && total ? (
                        <p className='p-2 mb-0'>
                            Exibindo 
                            <span className='total'> {total} </span> 
                            de
                            <span className='total'> {count} </span> 
                            período{total == 1 ? '' : 's'} do PAA</p>
                    ) :
                    null
                }
                <DataTable
                    value={results}
                    className='tabela-lista-periodos-paa'
                    data-qa='tabela-lista-periodos-paa'>
                    <Column field="referencia" header="Referência"/>
                    <Column
                        field="data_inicial"
                        header="Data Inicial"
                        body={dataTemplate}/>
                    <Column
                        field="data_final"
                        header="Data Final"
                        body={dataTemplate}/>
                    <Column
                        field="acao"
                        header="Ações"
                        body={acoesTemplate}
                        style={{width: '10%', textAlign: "center",}}/>
                </DataTable>
            </div>
        ) :
        <MsgImgCentralizada
                data-qa="imagem-lista-sem-periodos-paa"
                texto='Nenhum resultado encontrado.'
                img={Img404}
            />
        }
        <section>
            <ModalForm
                show={showModalForm}
                handleSubmitFormModal={handleSubmitFormModal}
            />
        </section>
        <section>
            <ModalConfirmarExclusao
                open={showModalConfirmacaoExclusao}
                onOk={() => handleExcluir(stateFormModal.uuid)}
                okText="Excluir"
                onCancel={() => setShowModalConfirmacaoExclusao(false)}
                cancelText="Cancelar"
                cancelButtonProps={{ className: "btn-base-verde-outline" }}
                titulo="Excluir Período PAA"
                bodyText={<p>Tem certeza que deseja excluir este período?</p>}
            />
        </section>
        
    </>
  )
}