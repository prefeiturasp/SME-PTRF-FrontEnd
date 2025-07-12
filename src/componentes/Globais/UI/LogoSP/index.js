import logoSP from "../../../../assets/img/logos/logo_PrefSP_sem_fundo_horizontal_colorida.svg";
import logoSPHorizontalMonocromatica from "../../../../assets/img/logos/logo_PrefSP_sem_fundo_horizontal_branco_monocromatico.svg";

export const LogoSPHorizontalColorida = () => {
  return <img src={logoSP} alt="logo prefeitura de são paulo" />;
};

export const LogoSPHorizontalMonocromatica = () => {
  return (
    <img
      src={logoSPHorizontalMonocromatica}
      alt="logo prefeitura de são paulo monocromática"
    />
  );
};
