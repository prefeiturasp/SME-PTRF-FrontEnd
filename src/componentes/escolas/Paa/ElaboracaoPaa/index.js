import { React, useEffect, useState } from 'react'
import { PaginasContainer } from '../../../../paginas/PaginasContainer'
import Loading from "../../../../utils/Loading";
import { getTextoExplicacaoPaa } from '../../../../services/escolas/PrestacaoDeContas.service';
import BreadcrumbComponent from '../../../Globais/Breadcrumb';
import { useNavigate } from 'react-router-dom-v5-compat';

export const ElaboracaoPaa = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [textoPaa, setTextoPaa] = useState('');

  const itemsBreadCrumb = [
    { label: 'Plano Anual de Atividades', active: true },
  ];

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
              <button type="button" className="btn btn-success mt-2 mr-5" onClick={() => {navigate('/elaborar-novo-paa')}}>Elaborar novo PAA</button>
              <button type="button" className="btn btn-success mt-2 ml-5" onClick={() => {}}>PAA vigente e anteriores</button>
            </div>
          </div>
        </>
      }
    </PaginasContainer>
    </>
  )
}
