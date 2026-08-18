import React from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import Loading from "../../../../../../utils/Loading";
import { ModalForm } from "./ModalForm";
import {MsgImgCentralizada} from "../../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../../assets/img/img-404.svg";
import { EditIconButton } from "../../../../../Globais/UI/Button";
import { Paginacao } from './Paginacao';
import { useFiqueDeOlhoContext } from "../hooks/useFiqueDeOlhoContext";
import { TotalRegistros } from "../../../componentes/TotalRegistros";

export const Lista = () => {
  const {
    stateFormModal,
    setStateFormModal,
    setBloquearBtnSalvarForm,
    isLoadingFiqueDeOlho,
    dataFiqueDeOlho,
    countFiqueDeOlho,
    mutationPost,
    mutationPatch,
  } = useFiqueDeOlhoContext();

  const { results } = dataFiqueDeOlho;

  const acoesTemplate = (rowData) => {
      return (
        <EditIconButton
            onClick={() => handleEditFormModal(rowData)}
            data-testid="btn-editar-fique-de-olho"
        />
      )
  };

  const handleEditFormModal = (rowData) => {
    setStateFormModal({
        ...stateFormModal,
        texto: rowData.texto,
        tipo_texto: rowData.tipo_texto,
        uuid: rowData.uuid,
        id: rowData.id,
        isOpen: true,
        recurso_uuid: rowData?.recurso
    });
  };

  const handleSubmitFormModal = async (values) => {
    setBloquearBtnSalvarForm(true)

    let payload = {
        texto: values.texto,
        tipo_texto: values.tipo_texto,
        recurso: values.recurso_uuid
    };

    if (values.uuid) {
        mutationPatch.mutate({
            uuid: values.uuid,
            ...payload
        })
    } else {
        mutationPost.mutate({ ...payload })
    }
  };

  if (isLoadingFiqueDeOlho) {
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
            <>
                <TotalRegistros
                    titulo="Texto(s) do Fique de Olho"
                    total_registros={countFiqueDeOlho}
                />

                <DataTable
                    value={results}
                    className='tabela-lista-fique-de-olho'
                    data-qa='tabela-lista-fique-de-olho'
                    data-testid="tabela-lista-fique-de-olho"
                >
                    <Column
                        field="tipo_texto_display"
                        header="Tipo de Texto"
                    />
                    <Column
                        field="acao"
                        header="Ação"
                        body={acoesTemplate}
                        style={{width: '10%', textAlign: "center",}}
                    />
                </DataTable>
            </>
        ) :
            <MsgImgCentralizada
                data-qa="imagem-lista-sem-fique-de-olho"
                texto='Nenhum resultado encontrado.'
                img={Img404}
            />
        }

        <Paginacao
            isFetching={isLoadingFiqueDeOlho}
            total={countFiqueDeOlho}
        />

        <ModalForm
            handleSubmitFormModal={handleSubmitFormModal}
        />
    </>
  )
}
