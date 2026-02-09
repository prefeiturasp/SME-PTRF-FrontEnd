import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Rotas } from "./rotas";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./assets/css/styles.scss";
import { Cabecalho } from "./componentes/Globais/Cabecalho";
import { SidebarLeft } from "./componentes/Globais/SidebarLeft";
import { ToastContainer } from "react-toastify";
import Modal from "./componentes/Globais/Modal/Modal";
import { useTheme } from "./context/Tema";
import useRecursoSelecionado from "./hooks/Globais/useRecursoSelecionado";
import { visoesService } from "./services/visoes.service";

export const App = () => {
  const pathName = useLocation().pathname;

  const { recursoSelecionado } = useRecursoSelecionado({ visoesService });

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (recursoSelecionado?.cor && recursoSelecionado.cor !== theme) {
      setTheme(recursoSelecionado.cor);
    }
  }, [recursoSelecionado, theme]);

  return (
    <>
      <ToastContainer />
      <section role="main" id="main" className="row">
        {pathName === "/login" ||
        pathName === "/login-suporte" ||
        pathName === "/esqueci-minha-senha/" ||
        pathName.match(/\/redefinir-senha\/[a-zA-Z0-9]/) ? (
          <Rotas />
        ) : pathName.match(/\/visualizacao-da-ata\/[a-zA-Z0-9]/) ||
          pathName.match(/\/edicao-da-ata\/[a-zA-Z0-9]/) ||
          pathName.match(/\/relatorios-paa\/edicao-ata\/[a-zA-Z0-9]/) ||
          pathName.match(/\/relatorios-paa\/visualizacao-da-ata-paa\/[a-zA-Z0-9]/) ||
          pathName.match(/\/visualizacao-da-ata-parecer-tecnico\/[a-zA-Z0-9]/) ||
          pathName.match(/\/edicao-da-ata-parecer-tecnico\/[a-zA-Z0-9]/) ||
          pathName.match(/\/dre-relatorio-consolidado-apuracao\/[a-zA-Z0-9]/) ||
          pathName.match(/\/dre-relatorio-consolidado-em-tela\/[a-zA-Z0-9]/) ||
          pathName.match(/\/dre-relatorio-consolidado-dados-das-ues\/[a-zA-Z0-9]/) ||
          pathName.match(/\/relatorios-componentes\/plano-aplicacao/) ||
          pathName.match(/\/relatorios-componentes\/plano-orcamentario/) ||
          pathName.match(/\/relatorios-componentes\/atividades-previstas/) ? (
          <>
            <Cabecalho />
            <Rotas />
          </>
        ) : (
          <>
            <Cabecalho />
            <SidebarLeft />
            <Rotas />
          </>
        )}
        <Modal />
      </section>
      </>
  );
};

export default App;
