import { useState } from 'react';
import { Flex, Button, Spin, Alert, Typography } from 'antd';
import { Paginator } from "primereact/paginator";
import ModalFormAdicionarPrioridade from './ModalFormAdicionarPrioridade';
import { useGetPrioridadeTabelas } from "./hooks/useGetPrioridadeTabelas";
import { useGetPrioridades } from "./hooks/useGetPrioridades";
import { usePostDuplicarPrioridade } from "./hooks/usePostPrioridade";
import { useGetTiposDespesaCusteio } from "./hooks/useGetTiposDespesaCusteio";
import { FormFiltros } from './FormFiltros';
import { MsgImgCentralizada } from "../../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../../assets/img/img-404.svg";
import { Tabela } from './Tabela';


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
  const [ultimoDuplicado, setUltimoDuplicado] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [firstPage, setFirstPage] = useState(0);
  const [modalForm, setModalForm] = useState({ open: false, tabelas: null, formModal: null });
  const { prioridadesTabelas, recursos, tipos_aplicacao } = useGetPrioridadeTabelas();
  const { tipos_despesa_custeio } = useGetTiposDespesaCusteio();
  const { isFetching: isLoadingPrioridades, prioridades, quantidade, refetch } = useGetPrioridades(filtros, currentPage);

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

  const abrirModal = async () => {
    setModalForm({ open: true, tabelas: dadosTabelas, formModal: null });
  };

  const onEditar = (rowData, focusValor=false) => {
    setModalForm({ open: true, tabelas: dadosTabelas, formModal: rowData, focusValor: focusValor });
  };

  const { mutationPost: mutationPostDuplicar } = usePostDuplicarPrioridade();

  const onDuplicar = (rowData) => {
    mutationPostDuplicar.mutate({uuid: rowData.uuid});
  };

  const existePrioridadesSemValor = () => {
    return prioridades.some((prioridade) => !prioridade?.valor_total);
  };

  return (
    <div>
      <Flex gutter={8} justify="space-between" align="flex-end" className="mb-4">
        <h5 className="mb-0">Prioridades</h5>
        <Button
          type="primary"
          onClick={abrirModal}
          style={{ marginTop: '20px' }}
        >
          Adicionar nova prioridade
        </Button>
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
            data={prioridades}
            handleEditar={onEditar}
            handleDuplicar={onDuplicar}
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
    </div>
  );
};

export default Prioridades;