import { useCallback, useEffect, useMemo, useState } from "react";
import { Checkbox, Input, List } from "antd";
import { useGetObjetivosPaa } from "./hooks/useGetObjetivosPaa";
import { IconButton } from "../../../../../Globais/UI/Button/IconButton";
import "./styles.css";
import { EditIconButton } from "../../../../../Globais/UI/Button";

export const RelSecaoObjetivos = ({ paaVigente, onSalvarObjetivos, isSaving }) => {
  const { data, isLoading } = useGetObjetivosPaa();
  const [items, setItems] = useState(data);

  useEffect(() => {
    const selecionados = paaVigente?.objetivos?.map((o) => o.uuid) || [];

    const novosItems = data.map((item) => ({
      ...item,
      checked: selecionados.includes(item.uuid),
    }));

    setItems(novosItems);
  }, [data, paaVigente]);

  const getPayload = useCallback(() => {
    const objetivosPayload = items
      .filter((item) => item.nome !== "" && (item.checked || item._destroy))
      .map((item) =>
        item.uuid ? { objetivo: item.uuid, nome: item.nome, _destroy: item._destroy || false } : { nome: item.nome }
      );
    return objetivosPayload;
  }, [items]);

  const podeSalvar = useMemo(() => {
    const objetivosPayload = getPayload();

    return objetivosPayload.length > 0;
  }, [getPayload]);

  const handleSave = () => {
    const objetivosPayload = getPayload();

    onSalvarObjetivos(objetivosPayload);
  };

  const onChangeObjetivos = ({ target: { checked, value, ...props } }) => {
    setItems((prev) => prev.map((item) => ((item.uuid || item.key) === value ? { ...item, checked } : item)));
  };

  const isSameItem = (a, b) => {
    if (a.uuid && b.uuid) return a.uuid === b.uuid;
    return a.key === b.key;
  };

  const handleAddNew = () => {
    setItems((prev) => [...prev, { key: crypto.randomUUID(), nome: "", checked: true, inputOpen: true }]);
  };

  const handleEdit = (item) => {
    setItems((prev) => prev.map((it) => (isSameItem(it, item) ? { ...it, inputOpen: true } : it)));
  };

  const handleCloseEdit = (item) => {
    setItems((prev) => prev.map((it) => (isSameItem(it, item) ? { ...it, inputOpen: false } : it)));
  };

  const handleRemove = (item) => {
    setItems((prev) => prev.map((it) => (isSameItem(it, item) ? { ...it, _destroy: true } : it)));
  };

  const handleNameChange = (item, nome) => {
    setItems((prev) => prev.map((it) => (isSameItem(it, item) ? { ...it, nome } : it)));
  };

  return (
    <>
      <List
        size="small"
        footer={
          <button className="btn btn-outline-success" onClick={handleAddNew}>
            Adicionar mais objetivos
          </button>
        }
        loading={isLoading || isSaving}
        bordered
        dataSource={items.filter((i) => !i._destroy)}
        renderItem={(item) => (
          <List.Item>
            <div className="d-flex w-100">
              <Checkbox onChange={onChangeObjetivos} value={item.uuid || item.key} checked={item.checked} />
              {!item.inputOpen ? (
                <div className="d-flex align-items-center justify-content-between w-100 ml-2">
                  {item.nome}

                  {(item.key || item.paa) && (
                    <div className="d-flex">
                      <EditIconButton
                        onClick={(e) => handleEdit(item)}
                        buttonStyle={{ padding: "0 12px" }}
                      />

                      <IconButton
                        icon="faTrash"
                        tooltipMessage="Excluir"
                        onClick={() => handleRemove(item)}
                        aria-label="Excluir"
                        type="button"
                        buttonStyle={{ padding: "0 12px" }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="d-flex align-items-center w-100 ml-2">
                  <Input
                    size="small"
                    placeholder="Digite o objetivo"
                    value={item.nome}
                    onChange={(e) => handleNameChange(item, e.target.value)}
                  />

                  <IconButton
                    icon="faSave"
                    tooltipMessage="Salvar"
                    aria-label="Salvar"
                    disabled={!item.nome}
                    onClick={() => handleCloseEdit(item)}
                    type="button"
                  />

                  <IconButton
                    icon="faTrash"
                    tooltipMessage="Excluir"
                    onClick={() => handleRemove(item)}
                    aria-label="Excluir"
                    type="button"
                  />
                </div>
              )}
            </div>
          </List.Item>
        )}
      />

      <div className="d-flex  justify-content-end pb-3 mt-3">
        <button className="btn btn btn-success" onClick={handleSave} disabled={!podeSalvar}>
          Salvar
        </button>
      </div>
    </>
  );
};
