import { React, useEffect, useState, useCallback } from 'react'
import { PaginasContainer } from '../../../../paginas/PaginasContainer'
import Loading from "../../../../utils/Loading";
import { getTextoExplicacaoPaa } from '../../../../services/escolas/PrestacaoDeContas.service';
import BreadcrumbComponent from '../../../Globais/Breadcrumb';
import { useNavigate } from 'react-router-dom-v5-compat';
import {ASSOCIACAO_UUID} from "../../../../services/auth.service";
import { usePostPaa } from "./hooks/usePostPaa";
import { getPaaVigente, getParametroPaa } from "../../../../services/sme/Parametrizacoes.service";

export const ElaboracaoPaa = () => {
  const associacao_uuid = localStorage.getItem(ASSOCIACAO_UUID);
  const navigate = useNavigate();

  const [notValidPaa, setNotValidPaa] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingPaa, setLoadingPaa] = useState(false);
  const [validMonthPaa, setValidMonthPaa] = useState('');
  const [textoPaa, setTextoPaa] = useState('');
  const { mutationPost } = usePostPaa();

  const itemsBreadCrumb = [
    { label: 'Plano Anual de Atividades', active: true },
  ];
  const dataAtual = new Date();

  const carregaPaa = useCallback(async ()=>{
    setLoadingPaa(true);
    try {
        let response = await getPaaVigente(associacao_uuid)
        localStorage.setItem("PAA", response.data.uuid);
        localStorage.setItem("DADOS_PAA", JSON.stringify(response.data));
        setNotValidPaa(false);
    } catch (error) {
        setNotValidPaa(true);
    }
    setLoadingPaa(false);
  }, [])

    useEffect(()=>{
      carregaPaa()
    }, [carregaPaa])

  const carregaParametroPaa = useCallback(async ()=>{
    try {
        let response = await getParametroPaa();
        setValidMonthPaa((dataAtual.getMonth() + 1) >= response.detail);
    } catch (error) {
      console.log(error);
    }
    }, [])

    useEffect(()=>{
      carregaParametroPaa()
    }, [carregaParametroPaa])

  useEffect(() => {
    getTextoExplicacaoPaa().then((response) => {
      setTextoPaa(response.detail);
      setLoading(false);
    }
    ).catch((error) => {
      setLoading(false);
      console.log(error);
    });
  }, []);

  const handlePaa = () => {
    if (notValidPaa){
      const payload = {
        associacao: associacao_uuid
      }
      mutationPost.mutate({payload: payload})
    }
    navigate('/elaborar-novo-paa');
};

  return (
    <>
    <PaginasContainer>
      <BreadcrumbComponent items={itemsBreadCrumb}/>
      <h1 className="titulo-itens-painel mt-5">Plano Anual de Atividades</h1>
      {loading ? (
        <Loading
            corGrafico="black"
            corFonte="dark"
            marginTop="50"
            marginBottom="0"
        />
        ) : <>
          <div className="page-content-inner">
            <div className="col-12 mb-4 mt-3">
              <div dangerouslySetInnerHTML={{__html: textoPaa}}/>
            </div>
            <p>Confira a estrutura completa aqui.</p>
            <div className="d-flex justify-content-center">
              <button type="button" className="btn btn-success mt-2 mr-5" data-testid="elaborar-paa-button" onClick={handlePaa} disabled={!validMonthPaa}>{!notValidPaa ? "Continuar elaboração de PAA" : "Elaborar novo PAA"}</button>
              <button type="button" className="btn btn-success mt-2 ml-5" onClick={() => {}}>PAA vigente e anteriores</button>
            </div>
          </div>
        </>
      }
    </PaginasContainer>
    </>
  )
}
