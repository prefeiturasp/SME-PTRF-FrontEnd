import "./index.scss";
import { Select, Skeleton } from "antd";

import { ModalConfirm } from "../Modal/ModalConfirm";
import { useDispatch } from "react-redux";

import useRecursoSelecionado from "../../../hooks/Globais/useRecursoSelecionado";
import { visoesService } from "../../../services/visoes.service";

export const SelecionaRecurso = () => {
  const dispatch = useDispatch();

  const { recursoSelecionado, recursos, handleChangeRecurso, isLoading, mostrarSelecionarRecursos } = useRecursoSelecionado({ visoesService });

  const handleChangeOption = (recursoUuid) => {
    const recursoSelecionadoObj = recursos.find((r) => r.uuid === recursoUuid);

    if (recursoSelecionadoObj) {
      ModalConfirm({
        dispatch: dispatch,
        title: "Trocar de Recurso",
        // eslint-disable-next-line no-multi-str
        message: `Deseja realmente trocar de recurso para ${recursoSelecionadoObj.nome_exibicao}? <br/> \
        Ao trocar, os dados de Resumo de recursos, Créditos e Gastos da Escola e Prestação de \
        contas serão exibidos conforme o recurso selecionado.`,
        cancelText: "Cancelar",
        confirmText: "Trocar",
        dataQa: "modal-trocar-recurso",
        onConfirm: () => handleChangeRecurso(recursoSelecionadoObj),
      });
    }
  };

  const opcoes = recursos
    .filter((recurso) => recurso.uuid !== recursoSelecionado?.uuid)
    .map((recurso) => ({
      label: recurso.nome_exibicao,
      value: recurso.uuid,
    }));

  return (
    <>
      {mostrarSelecionarRecursos && (
        <div className="container-seleciona-recurso">
          {recursoSelecionado ? (
            <div className="imagem-container">
              <img src={recursoSelecionado?.icone} alt="Ícone do recurso selecionado" />
            </div>
          ) : (
            <Skeleton.Avatar active size={80} shape="circle" />
          )}

          <Select
            variant="outlined"
            className="select-recurso-antd"
            options={opcoes}
            value={recursoSelecionado?.nome_exibicao}
            placeholder="Selecione o recurso"
            onChange={handleChangeOption}
            loading={isLoading}
          />
        </div>
      )}
    </>
  );
};
