import React, { useState, useEffect, useCallback } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, faExclamationTriangle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import {
  verificacaoRegularidade,
  salvarItensRegularidade,
} from "../../../../../services/dres/RegularidadeUnidadeEducaional.service";
import { visoesService } from "../../../../../services/visoes.service";
import MotivoNaoRegularidade from "./MotivoNaoRegularidade";
import { ModalConfirmaApagarMotivoNaoRegularidade } from "./ModalConfirmarApagarMotivoNaoRegularidade";
import { toastCustom } from "../../../../Globais/ToastCustom";
import { Checkbox, Collapse, Form, Spin } from "antd";
const { Panel } = Collapse;

export const RegularidadeAssociacaoNoAno = ({ associacaoUuid, ano, apenasLeitura = false }) => {
  const [dadosRegularidade, setDadosRegularidade] = useState({});
  const [checklists, setChecklists] = useState({});
  const [loading, setLoading] = useState(false);
  const [statusChecklist, setStatusChecklists] = useState({});
  const [dicionarioDeItens, setDicionarioDeItens] = useState({});
  const [showModalConfirmaApagarMotivoNaoRegularidade, setShowModalConfirmaApagarMotivoNaoRegularidade] =
    useState(false);
  const [arrayStatus, setArrayStatus] = useState([]);
  const [exibeCampoMotivoNaoRegularidade, setExibeCampoMotivoNaoRegularidade] = useState(false);
  const [campoMotivoNaoRegularidade, setCampoMotivoNaoRegularidade] = useState("");
  const [objSalvarItemVerificacao, setObjSalvarItemVerificacao] = useState({});

  const checaSeExibeMotivoNaoRegularidade = useCallback(() => {
    let exibeMotivo;
    if (arrayStatus && arrayStatus.length > 0) {
      exibeMotivo = arrayStatus.find((element) => element === "Pendente");
    } else {
      exibeMotivo = false;
    }
    setExibeCampoMotivoNaoRegularidade(exibeMotivo);
    return exibeMotivo;
  }, [arrayStatus]);

  useEffect(() => {
    checaSeExibeMotivoNaoRegularidade();
  }, [checaSeExibeMotivoNaoRegularidade]);

  const buscaDadosRegularidade = useCallback(async () => {
    if (associacaoUuid) {
      try {
        setLoading(true);
        let dados = await verificacaoRegularidade(associacaoUuid, ano);
        setDadosRegularidade(dados);
        setCampoMotivoNaoRegularidade(dados.motivo_nao_regularidade);
        let dicionarioItensListaVerificacao = {};
        let dicionarioItens = {};
        let status = {};
        let expande = {};
        dados.verificacao_regularidade.grupos_verificacao.map((grupo) => {
          grupo.listas_verificacao.map((itemLista) => {
            dicionarioItensListaVerificacao[itemLista.uuid] = itemLista.itens_verificacao;
            status[itemLista.uuid] = itemLista.status_lista_verificacao;
            expande[itemLista.uuid] = false;
            itemLista.itens_verificacao.map((item) => {
              dicionarioItens[item.uuid] = item;
            });
          });
        });
        setChecklists(dicionarioItensListaVerificacao);
        setDicionarioDeItens(dicionarioItens);
        setArrayStatus(Object.values(status));
        setStatusChecklists(status);
      } catch (e) {
        console.log("Erro ao buscar verificacao regularidade ", e.response);
      } finally {
        setLoading(false);
      }
    }
  }, [associacaoUuid, ano]);

  useEffect(() => {
    buscaDadosRegularidade();
  }, [buscaDadosRegularidade]);

  const montaGrupo = (grupo, index) => {
    return (
      <div className="mt-3" key={index}>
        <div style={{ margin: "2px 0px 20px 0px", fontWeight: "bold" }}>{grupo.titulo}</div>
        {montaListaVerificacao(grupo.listas_verificacao)}
      </div>
    );
  };

  const selecionarTodos = (lista_verificacao, e) => {
    let itensGrupo = checklists;

    var d = { ...dicionarioDeItens };
    var itens = itensGrupo[lista_verificacao.uuid].map((item) => {
      var i = { ...item };
      i.regular = e.target.checked === true ? true : false;
      d[item.uuid] = i;
      return i;
    });

    let status = { ...statusChecklist };
    status[lista_verificacao.uuid] = e.target.checked === true ? "Regular" : "Pendente";
    itensGrupo[lista_verificacao.uuid] = itens;
    setChecklists(itensGrupo);
    setDicionarioDeItens(d);
    setArrayStatus(Object.values(status));
    setStatusChecklists(status);
  };

  const selecionarItem = (lista_verificacao, item) => {
    let itensGrupo = checklists;

    let itens = itensGrupo[lista_verificacao.uuid].map((i) => {
      if (i.uuid === item.uuid) {
        i.regular = !i.regular;
      }
      return i;
    });
    itensGrupo[lista_verificacao.uuid] = itens;

    setChecklists(itensGrupo);

    var d = { ...dicionarioDeItens };
    d[item.uuid] = item;
    setDicionarioDeItens(d);

    const estaRegular = itens.every((item, index, array) => {
      return item.regular;
    });
    let status = { ...statusChecklist };
    status[lista_verificacao.uuid] = estaRegular === true ? "Regular" : "Pendente";
    setArrayStatus(Object.values(status));
    setStatusChecklists(status);
  };

  const salvarItemVerificacao = useCallback(
    async (lista_verificacao) => {
      setShowModalConfirmaApagarMotivoNaoRegularidade(false);

      let itens = [];
      for (let lista in checklists) {
        for (let item_lista in checklists[lista]) {
          itens.push({ uuid: checklists[lista][item_lista].uuid, regular: checklists[lista][item_lista].regular });
        }
      }
      const payload = {
        itens: itens,
        motivo_nao_regularidade: campoMotivoNaoRegularidade,
        ano: ano,
      };
      try {
        await salvarItensRegularidade(associacaoUuid, payload);
        toastCustom.ToastCustomSuccess(
          "Análise de regularidade salva com sucesso.",
          `O novo status de regularidade da associação foi salvo com sucesso.`
        );
        await buscaDadosRegularidade();
      } catch (e) {
        console.log("Erro ao salvar item verificação ", e.response);
        toastCustom.ToastCustomError(
          "Erro ao salvar análise de regularidade.",
          `Houve algum problema ao tentar salvar a análise de regularidade da associação.`
        );
      }
    },
    [associacaoUuid, checklists, campoMotivoNaoRegularidade, buscaDadosRegularidade]
  );

  const onClickCancelModalApagarCampoRegularidade = async () => {
    setShowModalConfirmaApagarMotivoNaoRegularidade(false);
    await buscaDadosRegularidade();
  };

  const onClickSalvarSalvarItemVerificacaoTrue = async () => {
    await salvarItemVerificacao(objSalvarItemVerificacao);
  };

  const salvaAnaliseRegularidade = useCallback(
    async (obj) => {
      setObjSalvarItemVerificacao(obj);
      if (!checaSeExibeMotivoNaoRegularidade() && campoMotivoNaoRegularidade) {
        setShowModalConfirmaApagarMotivoNaoRegularidade(true);
      } else {
        setShowModalConfirmaApagarMotivoNaoRegularidade(false);
        await salvarItemVerificacao(obj);
      }
    },
    [campoMotivoNaoRegularidade, checaSeExibeMotivoNaoRegularidade, salvarItemVerificacao]
  );

  const montaListaVerificacao = (listaVerificacao) => {
    const podeSalvar = [["change_regularidade"]].some(visoesService.getPermissoes) && !apenasLeitura;

    return (
      <Collapse
        accordion
        expandIconPosition="end"
        expandIcon={({ isActive }) => <FontAwesomeIcon icon={isActive ? faChevronUp : faChevronDown} />}
      >
        {listaVerificacao.map((obj, index) => (
          <Panel
            header={
              <div className="row w-100 align-items-center">
                <div className="col-9">
                  <span style={{ fontSize: "17px", color: "var(--color-primary)" }}>{obj.titulo}</span>
                </div>
                <div className="col-2 d-flex align-items-center justify-content-end">
                  <FontAwesomeIcon
                    style={{
                      fontSize: "17px",
                      marginRight: "4px",
                      color: statusChecklist[obj.uuid] === "Pendente" ? "#cc5104" : "green",
                    }}
                    icon={statusChecklist[obj.uuid] === "Pendente" ? faExclamationTriangle : faCheckCircle}
                  />
                  <span style={{ fontSize: "17px" }}>{statusChecklist[obj.uuid]}</span>
                </div>
              </div>
            }
            key={obj.uuid} // chave única
          >
            <Form>
              <Form.Item>
                <div className="row">
                  <div className="col-10">
                    <Checkbox
                      type="checkbox"
                      label="Selecionar todos"
                      onChange={(e) => selecionarTodos(obj, e)}
                      disabled={!podeSalvar}
                    >
                      Selecionar todos
                    </Checkbox>
                  </div>
                </div>
                {montaItens(obj, podeSalvar)}
              </Form.Item>
            </Form>
          </Panel>
        ))}
      </Collapse>
    );
  };

  const montaItens = (ListaVerificacao, podeSalvar) => {
    return checklists[ListaVerificacao.uuid] !== undefined
      ? checklists[ListaVerificacao.uuid].map((obj, index) => (
          <Checkbox
            type="checkbox"
            checked={dicionarioDeItens[obj.uuid] !== undefined ? dicionarioDeItens[obj.uuid].regular : false}
            key={index}
            onChange={(e) => selecionarItem(ListaVerificacao, obj)}
            disabled={!podeSalvar}
          >
            {obj.descricao}
          </Checkbox>
        ))
      : null;
  };

  const podeSalvar = [["change_regularidade"]].some(visoesService.getPermissoes) && !apenasLeitura;
  const obj = {};
  return (
    <Spin spinning={loading || !associacaoUuid}>
      {dadosRegularidade !== {} && dadosRegularidade.verificacao_regularidade !== undefined
        ? dadosRegularidade.verificacao_regularidade.grupos_verificacao.map((grupo, index) => montaGrupo(grupo, index))
        : null}

      <MotivoNaoRegularidade
        exibeCampoMotivoNaoRegularidade={exibeCampoMotivoNaoRegularidade}
        campoMotivoNaoRegularidade={campoMotivoNaoRegularidade}
        setCampoMotivoNaoRegularidade={setCampoMotivoNaoRegularidade}
        podeEditar={podeSalvar}
      />

      <div
        className="d-flex  justify-content-end pb-3"
        style={{
          visibility: podeSalvar ? "visible" : "hidden",
          marginTop: "20px",
        }}
      >
        {podeSalvar && (
          <Button variant="success" className="btn btn-sucess" onClick={(e) => salvaAnaliseRegularidade(obj)}>
            Salvar
          </Button>
        )}

        <ModalConfirmaApagarMotivoNaoRegularidade
          show={showModalConfirmaApagarMotivoNaoRegularidade}
          handleClose={() => setShowModalConfirmaApagarMotivoNaoRegularidade(false)}
          titulo="Tornar Regular"
          texto='Ao tornar "Regular" a Associação, o campo "Motivo de não regularidade da Associação" será apagado. Você confirma a regularidade da Associação?'
          primeiroBotaoTexto="Cancelar"
          primeiroBotaoCss="outline-success"
          primeiroBotaoOnclick={onClickCancelModalApagarCampoRegularidade}
          segundoBotaoOnclick={() => {
            setObjSalvarItemVerificacao(obj);
            onClickSalvarSalvarItemVerificacaoTrue();
          }}
          segundoBotaoCss="success"
          segundoBotaoTexto="Confirmar"
        />
      </div>
    </Spin>
  );
};
