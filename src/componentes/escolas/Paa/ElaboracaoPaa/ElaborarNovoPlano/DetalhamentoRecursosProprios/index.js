import React, { useCallback, useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { DatePicker, Flex, Input, InputNumber, Select, Spin } from "antd";
import { IconButton } from "../../../../../Globais/UI";
import { useGetRecursosProprios } from "./hooks/useGetRecursosProprios";
import "./style.css";
import {
  formatMoneyBRL,
  formatMoneyByCentsBRL,
  parseMoneyBRL,
} from "../../../../../../utils/money";
import { formataData } from "../../../../../../utils/FormataData";
import locale from "antd/es/date-picker/locale/pt_BR";
import moment from "moment";
import { useGetFontesRecursos } from "./hooks/useGetFontesRecursos";
import { usePatchRecursoProprio } from "./hooks/usePatchRecursoProprio";
import { ASSOCIACAO_UUID } from "../../../../../../services/auth.service";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import { CustomModalConfirm } from "../../../../../Globais/Modal/CustomModalConfirm";
import { useDispatch } from "react-redux";
import { useDeleteRecursoProprio } from "./hooks/useDeleteRecursoProprio";
import { usePostRecursoProprio } from "./hooks/usePostRecursoProprio";
import { useGetTotalizadorRecursoProprio } from "./hooks/useGetTotalizarRecursoProprio";
const DatePickerCustom = DatePicker.generatePicker(momentGenerateConfig);
const { TextArea } = Input;

const DetalhamentoRecursosProprios = () => {
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);

  const { data, isLoading } = useGetRecursosProprios();
  const { data: totalRecursosProprios } = useGetTotalizadorRecursoProprio();
  const { data: fontesRecursos, isLoading: isLoadingFontesRecursos } =
    useGetFontesRecursos();

  const handleCloseFieldsToEdit = (item) => {
    updateValue(item.uuid, "edit", false);
  };

  const { mutationPatch } = usePatchRecursoProprio(handleCloseFieldsToEdit);
  const { mutationPost } = usePostRecursoProprio(handleCloseFieldsToEdit);
  const { mutationDelete } = useDeleteRecursoProprio();

  useEffect(() => {
    if (data && data.results) {
      setItems(data.results);
    }
  }, [data]);

  const handleOpenFieldsToEdit = (item) => {
    updateValue(item.uuid, "edit", true);
  };

  const handleRemoveItem = (item, column) => {
    if (item.uuid) {
      CustomModalConfirm({
        dispatch,
        title: "Excluir Recurso Próprio",
        message: "Tem certeza que deseja excluir esse recurso próprio?",
        cancelText: "Voltar",
        confirmText: "Excluir",
        isDanger: true,
        onConfirm: () => mutationDelete.mutate(item.uuid),
      });
    } else {
      setItems((prevItems) => {
        return prevItems.filter((_, index) => index !== column.rowIndex);
      });
    }
  };

  const handleAddNewItem = () => {
    setItems((prev) => [
      {
        descricao: "",
        fonte_recurso: null,
        valor: undefined,
        data_prevista: null,
        edit: true,
      },
      ...prev,
    ]);
  };

  const validFields = (rowData) => {
    return (
      rowData.descricao !== "" &&
      rowData?.fonte_recurso?.uuid &&
      rowData.valor !== null &&
      rowData.data_prevista !== null
    );
  };

  const updateValue = (uuid, key, value) => {
    setItems((prev) =>
      prev.map((prevItem) => {
        if (prevItem.uuid === uuid) {
          return { ...prevItem, [key]: value };
        }
        return prevItem;
      })
    );
  };

  const handleSave = (rowData) => {
    const associacao_uuid = localStorage.getItem(ASSOCIACAO_UUID);

    const payload = {
      associacao: associacao_uuid,
      fonte_recurso: rowData?.fonte_recurso?.uuid,
      data_prevista: rowData?.data_prevista,
      descricao: rowData?.descricao,
      valor: rowData?.valor,
    };

    if (rowData.uuid) {
      mutationPatch.mutate({ uuid: rowData.uuid, payload: payload });
    } else {
      mutationPost.mutate({ payload: payload });
    }
  };

  const totalRecursoProprioTemplate = useCallback(() => {
    return (
      <span style={{ color: "white" }} className="font-weight-bold">
        {totalRecursosProprios
          ? formatMoneyBRL(totalRecursosProprios.total)
          : "__"}
      </span>
    );
  }, [totalRecursosProprios]);

  const acoesTemplate = (rowData, column) => {
    return !rowData["fixed"] ? (
      <Flex>
        {rowData["edit"] ? (
          <IconButton
            icon="faSave"
            tooltipMessage="Salvar"
            iconProps={{
              style: { fontSize: "20px", marginRight: "0", color: "#00585E" },
            }}
            disabled={!validFields(rowData)}
            aria-label="Salvar"
            onClick={() => handleSave(rowData)}
          />
        ) : (
          <IconButton
            icon="faEdit"
            tooltipMessage="Editar"
            iconProps={{
              style: { fontSize: "20px", marginRight: "0", color: "#00585E" },
            }}
            aria-label="Editar"
            onClick={() => handleOpenFieldsToEdit(rowData)}
          />
        )}
        <IconButton
          icon="faTrash"
          tooltipMessage="Apagar"
          iconProps={{
            style: {
              fontSize: "20px",
              marginRight: "0",
              color: "rgba(180, 12, 2, 1)",
            },
          }}
          aria-label="Apagar"
          onClick={() => handleRemoveItem(rowData, column)}
        />
      </Flex>
    ) : null;
  };

  const valorTemplate = (rowData) => {
    if (rowData["edit"] === true) {
      const handleChange = (value) => {
        updateValue(rowData.uuid, "valor", value / 100);
      };

      return (
        <InputNumber
          placeholder="00,00"
          formatter={formatMoneyByCentsBRL}
          parser={parseMoneyBRL}
          value={rowData?.valor * 100}
          style={{ width: "100%" }}
          onChange={handleChange}
        />
      );
    }

    if (rowData.fonte_recurso?.nome === "TOTAL") {
      return totalRecursoProprioTemplate();
    }

    return formatMoneyBRL(rowData?.valor);
  };

  const descricaoTemplate = (rowData) => {
    if (rowData["edit"] === true) {
      const handleChange = (ev) => {
        updateValue(rowData.uuid, "descricao", ev.target.value);
      };

      return (
        <TextArea
          placeholder="Descrição de atividade prevista"
          style={{ width: "100%" }}
          value={rowData?.descricao}
          autoSize
          onChange={handleChange}
        />
      );
    }
    return rowData?.descricao;
  };

  const dataPrevistaTemplate = (rowData) => {
    if (rowData["edit"] === true) {
      const handleChange = (date) => {
        updateValue(
          rowData.uuid,
          "data_prevista",
          date ? date.format("YYYY-MM-DD") : null
        );
      };

      let dateValue = null;
      if (rowData?.data_prevista) {
        dateValue = moment(rowData.data_prevista, "YYYY-MM-DD");

        if (!dateValue.isValid()) {
          dateValue = null;
        }
      }

      return (
        <DatePickerCustom
          locale={locale}
          format={"DD/MM/YYYY"}
          style={{ width: "100%" }}
          placeholder="Data prevista"
          defaultValue={dateValue}
          onChange={handleChange}
        />
      );
    }

    return rowData?.data_prevista ? formataData(rowData?.data_prevista) : null;
  };

  const nomeTemplate = (rowData) => {
    if (rowData["edit"] === true) {
      const handleChangeFonteRecurso = (value) => {
        const newValue = fontesRecursos.find(
          (fontesRecurso) => fontesRecurso.uuid === value
        );
        if (newValue) {
          updateValue(rowData.uuid, "fonte_recurso", newValue);
        } else {
          updateValue(rowData.uuid, "fonte_recurso", null);
        }
      };

      return (
        <Select
          allowClear
          placeholder="Selecione"
          options={fontesRecursos.map((fonteRecurso) => {
            return { label: fonteRecurso.nome, value: fonteRecurso.uuid };
          })}
          value={rowData?.fonte_recurso?.nome}
          onChange={handleChangeFonteRecurso}
          style={{ width: "100%" }}
          size="small"
        ></Select>
      );
    }
    return rowData?.fonte_recurso?.nome;
  };

  return (
    <div>
      <Spin spinning={isLoading || isLoadingFontesRecursos}>
        <Flex gutter={8} justify="space-between" className="mb-4">
          <h5 className="mb-0">Detalhamento de Recursos Próprios</h5>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => handleAddNewItem()}
          >
            Adicionar fonte de recurso
          </button>
        </Flex>

        <DataTable
          className="tabela-recursos-proprios-lista"
          value={[...items, { fonte_recurso: { nome: "TOTAL" }, fixed: true }]}
        >
          <Column
            field="fonte_recurso.nome"
            header="Fonte de recurso"
            body={nomeTemplate}
            edit
          />
          <Column
            field="data_prevista"
            header="Data prevista"
            body={dataPrevistaTemplate}
          />
          <Column
            field="descricao"
            header="Descrição da atividade prevista"
            body={descricaoTemplate}
          />
          <Column field="valor" header="Valor estimado" body={valorTemplate} />
          <Column field="acoes" header="Ações" body={acoesTemplate} />
        </DataTable>
      </Spin>
    </div>
  );
};

export default DetalhamentoRecursosProprios;
