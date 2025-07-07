import { useParams } from "react-router-dom";
import { IconButton } from "../../../Globais/UI";
import { Steps } from "./components/Steps";
import { VincularDespesas } from "./VincularDespesas";
import { useMemo, useState } from "react";
import { useGetBemProduzido } from "./hooks/useGetBemProduzido";
import { InformarValores } from "./InformarValores";
import { useNavigate } from "react-router-dom-v5-compat";
import { usePostBemProduzido } from "./hooks/usePostBemProduzido";
import { usePatchBemProduzido } from "./hooks/usePatchBemProduzido";
import { usePostBemProduzidoRascunho } from "./hooks/usePostBemProduzidoRascunho";
import { usePatchBemProduzidoRascunho } from "./hooks/usePatchBemProduzidoRascunho";
import { ClassificarBem } from "./ClassificarBem";

const stepList = [
  { label: "Selecionar despesas" },
  { label: "Informar valores utilizados" },
  { label: "Classificar o bem", qa: "circulo-em-analise-trilha-status-pc" },
];

export const FormularioBemProduzido = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [despesasSelecionadas, setDespesasSelecionadas] = useState([]);
  const [rateiosComValores, setRateiosComValores] = useState([]);
  const [bemProduzidoItems, setBemProduzidoItems] = useState([]);
  const [habilitaClassificarBem, setHabilitaClassificarBem] = useState(false);
  const [habilitaCadastrarBem, setHabilitaCadastrarBem] = useState(false);

  const { data } = useGetBemProduzido(uuid);
  const { mutationPost } = usePostBemProduzido();
  const { mutationPatch } = usePatchBemProduzido();

  const { mutationPost: mutationPostRascunho } = usePostBemProduzidoRascunho();
  const { mutationPatch: mutationPatchRascunho } =
    usePatchBemProduzidoRascunho();

  const podeEditar = uuid && data?.status === "INCOMPLETO";

  const valorTotalUtilizado = useMemo(() => {
    const total = rateiosComValores.reduce(
      (sum, r) => sum + (Number(r.valor_utilizado) || 0),
      0
    );
    return total;
  }, [rateiosComValores]);

  const salvarRascunho = async () => {
    const payload = {
      despesas: despesasSelecionadas.map((despesa) => despesa.uuid),
      rateios: rateiosComValores,
      itens: bemProduzidoItems,
    };

    try {
      if (uuid) {
        await mutationPatchRascunho.mutateAsync({ uuid, payload });
      } else {
        await mutationPostRascunho.mutateAsync({ payload });
      }
      navigate(`/lista-situacao-patrimonial`);
    } catch (error) {}
  };

  const salvar = async () => {
    const payload = {
      despesas: despesasSelecionadas.map((despesa) => despesa.uuid),
      rateios: rateiosComValores,
      itens: bemProduzidoItems,
    };

    try {
      if (uuid) {
        await mutationPatch.mutateAsync({ uuid, payload });
      } else {
        await mutationPost.mutateAsync({ payload });
      }
      navigate(`/lista-situacao-patrimonial`);
    } catch (error) {}
  };

  return (
    <div>
      {step === 1 ? (
        <div className="d-flex justify-content-end pb-4 mt-2 mb-4">
          <IconButton
            icon="faAngleDoubleRight"
            label="Informar valores"
            iconPosition="right"
            variant="success"
            iconProps={{
              style: { color: "white" },
            }}
            disabled={!despesasSelecionadas.length}
            onClick={() => setStep(2)}
          />
        </div>
      ) : step === 2 ? (
        <div className="d-flex justify-content-between pb-4 mt-2 mb-4">
          <IconButton
            icon="faAngleDoubleLeft"
            label="Selecionar despesas"
            iconPosition="left"
            variant="success"
            iconProps={{
              style: { color: "white" },
            }}
            onClick={() => setStep(1)}
          />

          <IconButton
            icon="faAngleDoubleRight"
            label="Classificar o bem"
            iconPosition="right"
            variant="success"
            iconProps={{
              style: { color: "white" },
            }}
            disabled={!habilitaClassificarBem}
            onClick={() => setStep(3)}
          />
        </div>
      ) : step === 3 ? (
        <div className="d-flex justify-content-between pb-4 mt-2 mb-4">
          <IconButton
            icon="faAngleDoubleLeft"
            label="Informar valores"
            iconPosition="left"
            variant="success"
            iconProps={{
              style: { color: "white" },
            }}
            onClick={() => setStep(2)}
          />

          <IconButton
            label="Cadastrar bem"
            variant="success"
            iconProps={{
              style: { color: "white" },
            }}
            disabled={!habilitaCadastrarBem}
            onClick={salvar}
          />
        </div>
      ) : null}

      <Steps currentStep={step} stepList={stepList} />

      {step === 1 ? (
        <VincularDespesas
          uuid={uuid}
          setStep={setStep}
          setDespesasSelecionadas={setDespesasSelecionadas}
          despesasSelecionadas={despesasSelecionadas}
          salvarRascunho={salvarRascunho}
        />
      ) : null}
      {step === 2 ? (
        <InformarValores
          uuid={uuid}
          despesas={despesasSelecionadas}
          salvarRacuscunho={salvarRascunho}
          podeEditar={podeEditar}
          setRateiosComValores={setRateiosComValores}
          setHabilitaClassificarBem={setHabilitaClassificarBem}
        />
      ) : step === 3 ? (
        <ClassificarBem
          total={valorTotalUtilizado}
          items={bemProduzidoItems}
          salvarRacuscunho={salvarRascunho}
          salvar={salvar}
          setBemProduzidoItems={setBemProduzidoItems}
          setHabilitaCadastrarBem={setHabilitaCadastrarBem}
          habilitaCadastrarBem={habilitaCadastrarBem}
        />
      ) : null}
    </div>
  );
};
