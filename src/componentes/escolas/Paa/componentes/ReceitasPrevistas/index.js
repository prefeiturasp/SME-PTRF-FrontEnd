import { Fragment, useState, useEffect } from "react";
import "./style.css";
import DetalhamentoRecursosProprios from "../DetalhamentoRecursosProprios";
import { DetalhamentoAcoesPdde } from "../DetalhamentoAcoesPdde";

import ReceitasPrevistasPTRF from "./ReceitasPrevistasPTRF";
import ReceitasPrevistasPDDE from "./ReceitasPrevistasPDDE";
import ReceitasPrevistasOutrosRecursos from "./ReceitasPrevistasOutrosRecursos";

const mapDestinoParaTab = (destino) => {
  switch (destino) {
    case "pdde":
      return "detalhamento-das-acoes-pdde";
    case "recursos-proprios":
      return "detalhamento-de-recursos-proprios";
    default:
      return "receitas-previstas";
  }
};

const ReceitasPrevistas = ({ receitasDestino = null, paa }) => {
  const [activeTab, setActiveTab] = useState(() =>
    mapDestinoParaTab(receitasDestino),
  );

  const tabs = [
    {
      id: "receitas-previstas",
      label: "Receitas Previstas",
      component: (
        <>
          <ReceitasPrevistasPTRF />
          <ReceitasPrevistasPDDE setActiveTab={setActiveTab} />
          <ReceitasPrevistasOutrosRecursos setActiveTab={setActiveTab}/>
        </>
      ),
    },
    {
      id: "detalhamento-das-acoes-pdde",
      label: "Detalhamento das ações PDDE",
      component: (
        <>
          <DetalhamentoAcoesPdde />
        </>
      ),
    },
    {
      id: "detalhamento-de-recursos-proprios",
      label: "Detalhamento de Recursos Próprios",
      component: (
        <>
          <DetalhamentoRecursosProprios />
        </>
      ),
    },
  ];

  useEffect(() => {
    if (receitasDestino) {
      const tab = mapDestinoParaTab(receitasDestino);
      setActiveTab(tab);
    }
  }, [receitasDestino]);

  return (
    <div>
      <nav className="nav mb-4 mt-4 menu-interno">
        {tabs.map((tab, index) => (
          <Fragment key={index}>
            <li className="nav-item">
              <button
                className={`nav-link btn-escolhe-acao mr-4 ${
                  activeTab === tab.id && "btn-escolhe-acao-active"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          </Fragment>
        ))}
      </nav>

      {tabs.map((tab, index) => (
        <Fragment key={index}>{activeTab === tab.id && tab.component}</Fragment>
      ))}
    </div>
  );
};

export default ReceitasPrevistas;
