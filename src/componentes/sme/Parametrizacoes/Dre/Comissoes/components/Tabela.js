import React from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import Loading from "../../../../../../utils/Loading";
import { ModalForm } from "./ModalForm";
import { ModalConfirmarExclusao } from "../../../../../Globais/ModalAntDesign/ModalConfirmarExclusao";
import {MsgImgCentralizada} from "../../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../../assets/img/img-404.svg";
import { EditIconButton } from "../../../../../Globais/UI/Button";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useComissoesContext } from "../hooks/useComissoesContext";

import { useGetComissoes } from "../hooks/useGetComissoes";
import { usePostComissoes } from "../hooks/usePostComissoes";
import { usePatchComissao } from "../hooks/usePatchComissoes";
import { useDeleteComissoes } from "../hooks/useDeleteComissoes";

import { Paginacao } from "./Paginacao";

import { IconButton } from "../../../../../Globais/UI/Button";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";


export const Tabela = () => {
  const { 
    stateFormModal, 
    setStateFormModal, 
    setBloquearBtnSalvarForm, 
    showModalConfirmacaoExclusao, 
    handleCloseModalConfirmacaoExclusao,
    handleOpenCreateModal
  } = useComissoesContext();
  const { isLoading, data, total, count } = useGetComissoes()
  const { mutationPost } = usePostComissoes()
  const { mutationPatch } = usePatchComissao()
  const { mutationDelete } = useDeleteComissoes()

  const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes();

  // Necessária pela paginação
  const { results } = data;

  const acoesTemplate = (rowData) => {
    return (
      <EditIconButton
        onClick={() => handleEditFormModal(rowData)}
      />
    )
  };

  const recursosTemplate = (rowData) => {
    if (!rowData.recursos) return null;
    
    const recursos = rowData.recursos.map(r => r.nome_exibicao);
    
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {recursos.map((recurso, index) => (
          <span
            key={index}
            style={{
              backgroundColor: '#E7F3F5',
              color: 'black',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap'
            }}
          >
            {recurso}
          </span>
        ))}
      </div>
    );
  };

  const comissaoTemplate = (rowData) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
        <span>{rowData.nome}</span>
        {rowData.responsavel_analise_pc && (
          <>
            <span
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}
            >
              Responsável pela análise de prestação de contas
            </span>
          </>
        )}
      </div>
    );
  };

  const handleEditFormModal = (rowData) => {
    setStateFormModal({
        ...stateFormModal,
        id: rowData.id,
        uuid: rowData.uuid,
        nome: rowData.nome,
        recursos: rowData.recursos.map(r => r.uuid) || [],
        responsavel_analise_pc: rowData.responsavel_analise_pc || false,
        isOpen: true,
    });
  };

  const handleSubmitFormModal = async (values) => {
    // Libera o botão somente após ter resolvido a mutation em usePostComissoes e usePatchComissoes
    setBloquearBtnSalvarForm(true)
    let payload = {
        nome: values.nome,
        recursos: values.recursos,
        responsavel_analise_pc: values.responsavel_analise_pc,
    };

    if (values.uuid) {
        mutationPatch.mutate({uuidComissao: values.uuid, payload: payload})
    } else {
        mutationPost.mutate({payload: payload})
    }
  };

  const handleExcluirComissao = async (uuid) => {
    if (!uuid) {
        toastCustom.ToastCustomError('Erro ao apagar a comissão', "Informe os campos corretamente e tente novamente.")
    }
    mutationDelete.mutate(uuid)
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
        <div style={{ borderTop: '1px solid #e0e0e0', marginBottom: '1.5rem' }}></div>
        <strong style={{ fontSize: 25 }}>Comissões adicionadas</strong>
        <div className="row align-items-center mb-4">
            <div className="col">
                <p className="mb-0">
                  A lista exibe todas as comissões cadastradas no sistema. Você pode adicionar uma
                  nova comissão e definir como responsável pela análise da prestação de contas de cada recurso
                  ao clicar em <b>"Adicionar comissão"</b>.
                </p>
            </div>
            <div className="col-auto">
                <IconButton
                  icon="faPlus"
                  iconProps={{ style: {fontSize: '15px', marginRight: "5", color:"#fff"} }}
                  label="Adicionar comissão"
                  onClick={() => handleOpenCreateModal()}
                  variant="success"
                  disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                />
            </div>
        </div>

        {results && results.length > 0 ? (
            <DataTable
                value={results}
                className='tabela-lista-detalhes-tipos-credito'
                data-qa='tabela-lista-detalhes-tipos-credito'
            >
                <Column
                    field="nome"
                    header="Comissão"
                    body={comissaoTemplate}
                />
                <Column
                    field="recursos"
                    header="Recursos Vinculados"
                    body={recursosTemplate}
                />
                <Column
                    field="acao"
                    header="Ação"
                    body={acoesTemplate}
                    style={{width: '10%', textAlign: "center",}}
                />
            </DataTable>
        ) :
            <MsgImgCentralizada
                data-qa="imagem-lista-sem-comissoes"
                texto='Nenhum resultado encontrado.'
                img={Img404}
            />
        }

        <Paginacao
            isLoading={isLoading}
            count={count}
            total={total}
        />
      
        <ModalForm
            handleSubmitFormModal={handleSubmitFormModal}
        />

        <ModalConfirmarExclusao
            open={showModalConfirmacaoExclusao.is_open}
            onOk={()=> {
                handleExcluirComissao(showModalConfirmacaoExclusao.uuid)
                handleCloseModalConfirmacaoExclusao()
            }}
            okText="Excluir"
            onCancel={() => handleCloseModalConfirmacaoExclusao()}
            cancelText="Cancelar"
            titulo="Excluir comissão"
            bodyText="Tem certeza que deseja excluir essa comissão?"
        />
    </>
  )
}