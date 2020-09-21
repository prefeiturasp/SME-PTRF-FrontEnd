import React, {useState, useEffect} from "react";
import {Redirect} from "react-router-dom";
import {Accordion, Card, Button, Form }from 'react-bootstrap';
import {TopoComBotoes} from "../TopoComBotoes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp, faChevronDown, faExclamationTriangle, faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import {verificacaoRegularidade, salvarItensRegularidade} from "../../../../../services/dres/RegularidadeUnidadeEducaional.service";
import {ModalConfirmaSalvar} from "../../../../../utils/Modais";

export const RegularidadeUnidadeEducacional = () => {
    let dadosDaAssociacao = JSON.parse(localStorage.getItem("DADOS_DA_ASSOCIACAO"));

    const [dadosRegularidade, setDadosRegularidade] = useState({});
    const [checklists, setChecklists] = useState({});
    const [statusChecklist, setStatusChecklists] = useState({});
    const [dicionarioDeItens, setDicionarioDeItens] = useState({});
    const [expandir, setExpandir] = useState({});
    const [showSalvar, setShowSalvar] = useState(false);

    useEffect(() => {
      const buscaDadosRegularidade = async () => {
        verificacaoRegularidade(dadosDaAssociacao.dados_da_associacao.uuid)
        .then(response => {
          const dados = response.data
          setDadosRegularidade(dados);
          let dicionarioItensListaVerificacao = {}
          let dicionarioItens = {}
          let status = {}
          let expande = {}
          dados.verificacao_regularidade.grupos_verificacao.map(grupo => {
            grupo.listas_verificacao.map(itemLista => {
              dicionarioItensListaVerificacao[itemLista.uuid] = itemLista.itens_verificacao
              status[itemLista.uuid] = itemLista.status_lista_verificacao
              expande[itemLista.uuid] = false
              itemLista.itens_verificacao.map(item => {
                dicionarioItens[item.uuid] = item
              })
            })
            })
          setChecklists(dicionarioItensListaVerificacao);
          setDicionarioDeItens(dicionarioItens);
          setStatusChecklists(status);
        })
        .catch(error => {
          console.log(error);
        })
      };
      buscaDadosRegularidade();
    }, 
    []);

    const montaGrupo = (grupo, index) => {
      return (
        <div key={index}>
          <div style={{margin: "2px 0px 20px 0px", fontWeight: 'bold'}}>
            {grupo.titulo}
          </div>
          <Accordion>
          {montaListaVerificacao(grupo.listas_verificacao)}
          </Accordion>
        </div>
      )
    }

    const selecionarTodos = (lista_verificacao, e) => {
      let itensGrupo = checklists

      var d = {...dicionarioDeItens}
      var itens = itensGrupo[lista_verificacao.uuid].map(item => {
        var i = {...item}
        i.regular = e.target.checked === true ? true : false
        d[item.uuid] = i
        return i
      })

      let status = {...statusChecklist}
      status[lista_verificacao.uuid] = e.target.checked === true ? 'Regular' : 'Pendente';
      itensGrupo[lista_verificacao.uuid] = itens
      setChecklists(itensGrupo);
      setDicionarioDeItens(d);
      setStatusChecklists(status);
    }

    const selecionarItem = (lista_verificacao, item) => {
      var itensGrupo = checklists
      var itens = itensGrupo[lista_verificacao.uuid].map(i => {
        if (i.uuid === item.uuid) {
          i.regular = !i.regular
        }
        return i
      })
      itensGrupo[lista_verificacao.uuid] = itens
      setChecklists(itensGrupo);
      
      var d = {...dicionarioDeItens}
      d[item.uuid] = item
      setDicionarioDeItens(d);

      const estaRegular = itens.every((item, index, array) => { return item.regular});
      let status = {...statusChecklist}
      status[lista_verificacao.uuid] = estaRegular === true ? 'Regular' : 'Pendente';
      setStatusChecklists(status);
    }

    const salvarItemVerificacao = async (lista_verificacao) => {
      var itens = checklists[lista_verificacao.uuid].map(item => {
        return {uuid: item.uuid, regular: item.regular}
      })
      salvarItensRegularidade(dadosDaAssociacao.dados_da_associacao.uuid, itens).then(response => {
        setShowSalvar(true);
        console.log("OK, Salvo com sucesso");
      })
    }

    const montaListaVerificacao = (listaVerificacao) => {
      return (
        listaVerificacao.map((obj, index) => (
          <Card key={index}>
            <Accordion.Toggle as={Card.Header} variant="link" eventKey={index} onClick={e => handleExpandir(obj.uuid)}>
              <div className="row">
                  <div className="col-9">
                    <span style={{fontSize: '17px', color: '#00585e'}}>{obj.titulo}</span>
                  </div>
                  <div className="col-2">
                      <FontAwesomeIcon
                        style={{fontSize: '17px', marginRight: "0", paddingRight:"4px", color: statusChecklist[obj.uuid] === 'Pendente' ? '#cc5104' : 'green'}}
                        icon={statusChecklist[obj.uuid] === 'Pendente' ? faExclamationTriangle : faCheckCircle}
                      />
                      <span style={{marginRight: "0", fontSize: '17px'}}>{statusChecklist[obj.uuid]}</span>
                  </div>
                  <div className="col-1" style={{ paddingLeft:"0px" }}>
                    <span style={{ backgroundColor:"#c7c9c8", borderRadius: '67px', border: 'solid 1px #c7c9c8', padding: '4px 7px'}}>
                    <FontAwesomeIcon
                        style={{marginRight: "0", color: 'black'}}
                        icon={expandir[obj.uuid] === true ? faChevronUp : faChevronDown}
                      />
                    </span>
                  </div>
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index}>
            <Card.Body>
              <Form>
                <Form.Group controlId="formBasicCheckbox">
                  <div className="row">
                    <div className="col-10">
                    <Form.Check type="checkbox" label="Selecionar todos" key={index} onChange={e => selecionarTodos(obj, e)} />
                    </div>
                    <div className="col-2">
                      <Button variant="success" className="btn btn-sucess" onClick={e => salvarItemVerificacao(obj)}>Salvar</Button>
                    </div>
                  </div>
                  
                  {montaItens(obj)}
                </Form.Group>
              </Form>
            </Card.Body>
          </Accordion.Collapse>
          </Card>
        ))
      )
    }

    const montaItens = (ListaVerificacao) => {
      return (
        checklists[ListaVerificacao.uuid] !== undefined 
        ? checklists[ListaVerificacao.uuid].map((obj, index) => (
          <Form.Check type="checkbox" checked={ dicionarioDeItens[obj.uuid] !== undefined ? dicionarioDeItens[obj.uuid].regular: false} label={obj.descricao} key={index} onChange={e => selecionarItem(ListaVerificacao, obj)}/>
        )): null
      )
    }

    const handleExpandir = (uuid) => {
      let expand = {...expandir};
      for (var prop in expand) {
        if (uuid !== prop) {
          expand[prop] = false
        }
      }
      
      expand[uuid] = !expand[uuid];
      setExpandir(expand);
    }

    return (
        <>
            {dadosDaAssociacao ? (
                    <>
                        <TopoComBotoes
                            dadosDaAssociacao={dadosDaAssociacao}
                        />
                        <div className="page-content-inner">
                        {dadosRegularidade !== {} && dadosRegularidade.verificacao_regularidade !== undefined ? (
                          dadosRegularidade.verificacao_regularidade.grupos_verificacao.map((grupo, index) => (
                            montaGrupo(grupo, index)
                          ))
                        ) : null}
                        <ModalConfirmaSalvar
                          show={showSalvar}
                          handleClose={()=>setShowSalvar(false)}
                          titulo="Itens salvos!"
                          texto="Os dados foram salvos com sucesso."
                          primeiroBotaoCss="success"
                        />
                        </div>
                    </>
                ) :
                <Redirect
                    to={{
                        pathname: "/dre-associacoes",
                    }}
                />
            }
        </>
    );
};