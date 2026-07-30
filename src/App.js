import React, { useEffect, useState } from "react";
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
import { useRecursoSelecionadoContext } from "./context/RecursoSelecionado";
import { authService } from "./services/auth.service";
import Loading from "./utils/Loading";

export const App = () => {
  const pathName = useLocation().pathname;

  const { recursoSelecionado } = useRecursoSelecionadoContext();

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (recursoSelecionado?.cor && recursoSelecionado.cor !== theme) {
      setTheme(recursoSelecionado.cor);
    }
  }, [recursoSelecionado, theme]);

  const PUBLIC_PATHS = ["/login", "/login-suporte", "/esqueci-minha-senha/"];
  const isPublicPath = PUBLIC_PATHS.includes(pathName) || pathName.match(/\/redefinir-senha\//);

  // Enquanto true, a tela fica em loading para evitar renderizar com permissões
  // desatualizadas do localStorage antes do "/me" responder.
  const [carregandoPermissoes, setCarregandoPermissoes] = useState(
    () => !isPublicPath && authService.isLoggedIn()
  );

  // Atualiza permissões e grupos do usuário a cada reload da página.
  // Dependência vazia ([]) garante execução apenas no mount — não a cada navegação,
  // evitando chamadas repetidas ao backend durante a sessão.
  useEffect(() => {
    if (!isPublicPath && authService.isLoggedIn()) {
      authService.refreshUserData().finally(() => setCarregandoPermissoes(false));
    } else {
      setCarregandoPermissoes(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ToastContainer />
      <section role="main" id="main" className="row">
        {!isPublicPath && carregandoPermissoes ? (
          <div style={{ justifySelf: "center", alignItems: "center", width: "100%" }}>
            <Loading
              style={{ paddingTop: "200px" }}
              corGrafico="black"
              corFonte="dark"
              marginTop="0"
              marginBottom="0"
            />
          </div>
        ) : pathName === "/login" ||
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
