import { IconButton } from "../../../Globais/UI";
import { Steps } from "./components/Steps";
import { VincularDespesas } from "./VincularDespesas";
import { useState } from "react";

const stepList = [
  { label: "Selecionar despesas" },
  { label: "Informar valores utilizados" },
  { label: "Classificar o bem", qa: "circulo-em-analise-trilha-status-pc" },
];

export const FormularioBemProduzido = (props) => {
  const [step, setStep] = useState(1);

  return (
    <div>
      <div className="d-flex justify-content-end pb-4 mt-2 mb-4">
        <IconButton
          icon="faAngleDoubleRight"
          label="Informar valores"
          iconPosition="right"
          variant="success"
          iconProps={{
            style: { color: "white" },
          }}
        />
      </div>

      <Steps currentStep={step} stepList={stepList} />

      {step === 1 ? <VincularDespesas /> : null}
    </div>
  );
};
