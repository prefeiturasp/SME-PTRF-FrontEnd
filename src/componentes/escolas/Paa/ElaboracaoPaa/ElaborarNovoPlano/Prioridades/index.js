import { useState, useRef } from 'react';
import { Flex, Button, Spin, Alert, Typography } from 'antd';
import { Paginator } from "primereact/paginator";
import ModalFormAdicionarPrioridade from './ModalFormAdicionarPrioridade';
import { useGetPrioridadeTabelas } from "./hooks/useGetPrioridadeTabelas";
import { useGetPAAsAnteriores } from "./hooks/useGetPAAsAnteriores";
import { useGetPrioridades } from "./hooks/useGetPrioridades";
import { usePostDuplicarPrioridade } from "./hooks/usePostPrioridade";
import { useDeletePrioridade } from "./hooks/useDeletePrioridade";
import { useDeletePrioridadesEmLote } from "./hooks/useDeletePrioridadesEmLote";
import { useGetTiposDespesaCusteio } from "./hooks/useGetTiposDespesaCusteio";
import { FormFiltros } from './FormFiltros';
import { MsgImgCentralizada } from "../../../../../Globais/Mensagens/MsgImgCentralizada";
import { ModalConfirmarExclusao } from "../../../../../sme/Parametrizacoes/componentes/ModalConfirmarExclusao";
import Img404 from "../../../../../../assets/img/img-404.svg";
import { Tabela } from './Tabela';
import { Resumo } from './Resumo';
import ModalImportarPrioridades from './ModalImportarPrioridades';


const filtroInicial = {
  prioridade: "",
  programa_pdde__uuid: undefined,
  acao_pdde__uuid: undefined,
  acao_associacao__uuid: undefined,
  tipo_aplicacao: "",
  tipo_despesa_custeio: "",
  especificacao_material__uuid: undefined,
};

const Prioridades = () => {
  const [filtros, setFiltros] = useState(filtroInicial);
  const [currentPage, setCurrentPage] = useState(1);
  const [firstPage, setFirstPage] = useState(0);
  const [modalForm, setModalForm] = useState({ open: false, tabelas: null, formModal: null });
  const [modalExclusao, setModalExclusao] = useState({ open: false, item: null, tipo: 'individual' });
  const tabelaRef = useRef(null);
  const { prioridadesTabelas, recursos, tipos_aplicacao } = useGetPrioridadeTabelas();
  const { tipos_despesa_custeio } = useGetTiposDespesaCusteio();
  const { isFetching: isLoadingPrioridades, prioridades, quantidade, refetch } = useGetPrioridades(filtros, currentPage);

  // PAA`s Anteriores
  const [modalImportarPrioridades, setModalImportarPrioridades] = useState({ open: false, paas: [] });
  const { paas_anteriores, isFetching: isLoadingPAAsAnteriores } = useGetPAAsAnteriores();
  
  const { mutationDelete } = useDeletePrioridade(() => setModalExclusao({ open: false, item: null, tipo: 'individual' }));
  const { mutationDeleteEmLote } = useDeletePrioridadesEmLote(() => {
    setModalExclusao({ open: false, item: null, tipo: 'lote' });
    if (tabelaRef.current) {
      tabelaRef.current.clearSelectedItems();
    }
  });

  const dadosTabelas = {
    prioridades: prioridadesTabelas,
    recursos: recursos,
    tipos_aplicacao: tipos_aplicacao,
    tipos_despesa_custeio: tipos_despesa_custeio
  }

  const onPageChange = (event) => {
    setFirstPage(event.first);
    setCurrentPage(event.page + 1);
  };

  const onFiltrar = () => {
    refetch();
    setCurrentPage(1);
    setFirstPage(0);
  };

  const onFiltrosChange = (campo, valor) => {
    setFiltros((prev) => {
      return { ...prev, [campo]: valor };
    });
  };

  const limpaFiltros = () => {
    setFiltros(filtroInicial);
    setTimeout(() => refetch(), 0);
    setCurrentPage(1);
    setFirstPage(0);
  };

  const abrirModalImportarPAAsAnteriores = async () => {
    setModalImportarPrioridades({ open: true, paas: paas_anteriores });
  };

  const abrirModalNovaPrioridade = async () => {
    setModalForm({ open: true, tabelas: dadosTabelas, formModal: null });
  };

  const onEditar = (rowData, focusValor=false) => {
    setModalForm({ open: true, tabelas: dadosTabelas, formModal: rowData, focusValor: focusValor });
  };

  const { mutationPost: mutationPostDuplicar } = usePostDuplicarPrioridade();

  const onDuplicar = (rowData) => {
    mutationPostDuplicar.mutate({uuid: rowData.uuid});
  };

  const onExcluir = (rowData) => {
    setModalExclusao({ open: true, item: rowData, tipo: 'individual' });
  };

  const onExcluirEmLote = (listaUuids) => {
    setModalExclusao({ open: true, item: { lista_uuids: listaUuids }, tipo: 'lote' });
  };

  const handleConfirmarExclusao = () => {
    if (modalExclusao.tipo === 'individual') {
      mutationDelete.mutate({ uuid: modalExclusao.item.uuid });
    } else {
      mutationDeleteEmLote.mutate({ payload: modalExclusao.item });
    }
    onFiltrar();
  };

  const existePrioridadesSemValor = () => {
    return prioridades.some((prioridade) => !prioridade?.valor_total);
  };

  return (
    <div>
      <Resumo />

      <Flex gutter={8} justify="space-between" align="center" className="my-4">
        <Typography.Title level={5} style={{ color: '#00585E', fontWeight: 'bold',}}>
            Registro de prioridades
        </Typography.Title>

        <Flex>
          <Spin spinning={isLoadingPAAsAnteriores}>
            <button
              className="btn btn-outline-success btn-sm mx-2"
              onClick={abrirModalImportarPAAsAnteriores}
              type="button">
                Importar PAAs anteriores
            </button>
          </Spin>
          <button
              className="btn btn-success btn-sm"
              onClick={abrirModalNovaPrioridade}
              type="button">
              Adicionar prioridade
          </button>
        </Flex>
      </Flex>

      {/* Bloco de filtros com 7 selects */}
      {recursos && prioridadesTabelas && tipos_aplicacao && tipos_despesa_custeio && (
        <FormFiltros
          tabelas={dadosTabelas}
          onFiltrar={onFiltrar}
          onFiltrosChange={onFiltrosChange}
          onLimparFiltros={limpaFiltros}
        />
      )}

      <Spin spinning={isLoadingPrioridades}>
        {prioridades && quantidade > 0 ? (
        <>
          <p className="mb-2 mt-4">
            <Flex justify="space-between" align="center">
              {existePrioridadesSemValor() && <Alert
                showIcon
                className="mr-2"
                type="warning"
                style={{flex: 'auto', fontSize: '13px'}}
                description={<>O campo <b>Valor Total</b> é de preenchimento obrigatório.</>}
              />}

              <Typography.Text type="secondary">
                {`Exibindo ${prioridades?.length} de ${quantidade} registros`}
              </Typography.Text>

            </Flex>
          </p>
          <Tabela
            ref={tabelaRef}
            data={prioridades}
            handleEditar={onEditar}
            handleDuplicar={onDuplicar}
            handleExcluir={onExcluir}
            handleExcluirEmLote={onExcluirEmLote}
          />
          {quantidade > 20 && (
            <Paginator
              first={firstPage}
              rows={20}
              totalRecords={quantidade}
              template="PrevPageLink PageLinks NextPageLink"
              onPageChange={onPageChange}
              alwaysShow={false}
            />
          )}
        </>
      ) : (
        <MsgImgCentralizada
            texto={
              "Nenhum resultado encontrado."
            }
            img={Img404}
          />
      )}
    </Spin>

      {modalForm.open && (
        <ModalFormAdicionarPrioridade
          open={modalForm.open}
          tabelas={modalForm.tabelas}
          formModal={modalForm.formModal}
          focusValor={modalForm.focusValor}
          onClose={() => setModalForm({
            open: false,
            tabelas: null,
            formModal: null,
            focusValor: false })}
        />
      )}

      {modalImportarPrioridades.open && (
        <ModalImportarPrioridades
          open={modalImportarPrioridades.open}
          paas={modalImportarPrioridades.paas}
          onClose={() => setModalImportarPrioridades({
            open: false,
            paas: []})}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      <ModalConfirmarExclusao
        open={modalExclusao.open}
        onOk={handleConfirmarExclusao}
        okText="Excluir"
        onCancel={() => setModalExclusao({ open: false, item: null, tipo: 'individual' })}
        cancelText="Cancelar"
        cancelButtonProps={{ className: "btn-base-verde-outline" }}
        titulo={modalExclusao.tipo === 'individual' ? "Excluir Prioridade" : "Excluir Prioridades"}
        bodyText={
          modalExclusao.tipo === 'individual'
            ? <p>Tem certeza que deseja excluir a prioridade selecionada? Esta ação não poderá ser desfeita.</p>
            : <p>Tem certeza que deseja excluir as prioridades selecionadas? Esta ação não poderá ser desfeita.</p>
        }
      />
    </div>
  );
};

export default Prioridades;