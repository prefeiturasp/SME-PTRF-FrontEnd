import { useState, useCallback } from "react";
import { Checkbox, Flex, Spin } from "antd";
import { useGetReceitasPrevistas } from "./hooks/useGetReceitasPrevistas";
import "./style.css";
import ReceitasPrevistasModalForm from "./ReceitasPrevistasModalForm";
import { Icon } from "../../../../Globais/UI/Icon";
import { useGetTotalizadorRecursoProprio } from "../DetalhamentoRecursosProprios/hooks/useGetTotalizarRecursoProprio";
import TabelaReceitasPrevistas from "./TabelaReceitasPrevistas";
import ModalConfirmaPararAtualizacaoSaldo from "./ModalConfirmarPararAtualizacaoSaldo";
import { visoesService } from "../../../../../services/visoes.service";
import { useQueryClient } from "@tanstack/react-query";
import { usePaaContext } from "../PaaContext";

const ReceitasPrevistasPTRF = () => {
  const queryClient = useQueryClient();

  const { paa } = usePaaContext();

  const [checkPararAtualizacaoSaldo, setValorCheckPararAtualizacaoSaldo] =
    useState(!!paa?.saldo_congelado_em);

  const [modalForm, setModalForm] = useState({ open: false, data: null });
  const [
    showModalConfirmaPararAtualizacaoSaldo,
    setShowModalConfirmaPararAtualizacaoSaldo,
  ] = useState(false);

  const {
    data: dataReceitasPrevistas,
    isLoading: isLoadingReceitasPrevistas,
    refetch: refetchReceitasPrevistas,
    isFetching: isFetchingReceitasPrevistas,
  } = useGetReceitasPrevistas();

  const { data: totalRecursosProprios } = useGetTotalizadorRecursoProprio(
    paa.associacao,
    paa.uuid,
  );

  const handleOpenEditar = (rowData) => {
    setModalForm({ open: true, data: rowData });
  };

  const handleCloseModalForm = () => {
    setModalForm({ open: false, data: null });
  };

  const carregaPaa = useCallback(async () => {
    queryClient.invalidateQueries({
      queryKey: [`retrieve-paa`, paa.uuid],
      exact: false,
    });
  }, [queryClient, paa.uuid]);

  const onTogglePararAtualizacoesSaldo = (e) => {
    setValorCheckPararAtualizacaoSaldo(e.target.checked);
    setShowModalConfirmaPararAtualizacaoSaldo(true);
  };

  const recarregarAcoesAssociacoes = async () => {
    return await refetchReceitasPrevistas();
  };

  const onSubmitParadaSaldo = async () => {
    await recarregarAcoesAssociacoes();
    await carregaPaa();
    setShowModalConfirmaPararAtualizacaoSaldo(false);
  };

  const onCancelConfirmaParadaSaldo = () => {
    setShowModalConfirmaPararAtualizacaoSaldo(false);
  };

  return (
    <div>
      {modalForm.open && (
        <ReceitasPrevistasModalForm
          open={modalForm.open}
          acaoAssociacao={modalForm.data}
          onClose={handleCloseModalForm}
        />
      )}

      <>
        <Flex gutter={8} justify="space-between" className="mb-4">
          <h4 className="mb-0">Receitas Previstas</h4>
          <Flex align="center">
            {!!paa?.uuid && paa?.status !== "EM_RETIFICACAO" && (
              <>
                <Checkbox
                  data-testid="checkbox-parar-atualizacoes-saldo"
                  checked={!!paa?.saldo_congelado_em}
                  onChange={(e) => onTogglePararAtualizacoesSaldo(e)}
                  disabled={
                    !visoesService.getPermissoes(["custom_change_paa"]) ||
                    isLoadingReceitasPrevistas ||
                    isFetchingReceitasPrevistas
                  }
                >
                  Parar atualizações do saldo
                </Checkbox>
                <Icon
                  tooltipMessage="Ao selecionar esta opção os valores dos recursos não serão atualizados e serão mantidos os valores da última atualização automática ou da edição realizada."
                  icon="faExclamationCircle"
                  iconProps={{
                    style: {
                      fontSize: "16px",
                      marginLeft: 4,
                    },
                  }}
                />
              </>
            )}
          </Flex>
        </Flex>

        <ModalConfirmaPararAtualizacaoSaldo
          open={showModalConfirmaPararAtualizacaoSaldo}
          onClose={onCancelConfirmaParadaSaldo}
          check={checkPararAtualizacaoSaldo}
          paa={paa}
          onSubmitParadaSaldo={onSubmitParadaSaldo}
        />
        <Spin
          spinning={isLoadingReceitasPrevistas || isFetchingReceitasPrevistas}
        >
          <TabelaReceitasPrevistas
            data={dataReceitasPrevistas}
            handleOpenEditar={handleOpenEditar}
            totalRecursosProprios={totalRecursosProprios}
          />
        </Spin>
      </>
    </div>
  );
};

export default ReceitasPrevistasPTRF;
