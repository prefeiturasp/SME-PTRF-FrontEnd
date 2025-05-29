import { useParams } from "react-router-dom";
import { IconButton } from "../../../Globais/UI";
import { Steps } from "./components/Steps";
import { VincularDespesas } from "./VincularDespesas";
import { useEffect, useState } from "react";
import { useGetBemProduzido } from "./hooks/useGetBemProduzido";
import { InformarValores } from "./InformarValores";
import { useNavigate } from "react-router-dom-v5-compat";
import { usePostBemProduzido } from "./hooks/usePostBemProduzido";
import { usePatchBemProduzido } from "./hooks/usePatchBemProduzido";

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
  const { data } = useGetBemProduzido(uuid);
  const { mutationPost } = usePostBemProduzido();
  const { mutationPatch } = usePatchBemProduzido();

  const podeEditar = uuid && data?.status === "INCOMPLETO";

  useEffect(() => {
    if (data?.despesas?.length) {
      setStep(2);
    }
  }, [data]);

  const salvarRascunho = async () => {
    if (uuid) {
      try {
        await mutationPatch.mutateAsync({
          uuid: uuid,
          payload: {
            despesas: despesasSelecionadas.map((despesa) => despesa.uuid),
          },
        });

        navigate(`/lista-situacao-patrimonial`);
      } catch (error) {}
    } else {
      try {
        await mutationPost.mutateAsync({
          payload: {
            despesas: despesasSelecionadas.map((despesa) => despesa.uuid),
          },
        });

        navigate(`/lista-situacao-patrimonial`);
      } catch (error) {}
    }
  };

  const salvarRascunhoInformarValores = async (rateiosComValores) => {
    try {
      await mutationPatch.mutateAsync({
        uuid: uuid,
        payload: { rateios: rateiosComValores },
      });

      navigate(`/lista-situacao-patrimonial`);
    } catch (error) {}
  };

  const informarValores = async () => {
    if (uuid) {
      try {
        const mutationResp = await mutationPatch.mutateAsync({
          uuid: uuid,
          payload: {
            despesas: despesasSelecionadas.map((despesa) => despesa.uuid),
          },
        });

        navigate(`/edicao-bem-produzido/${mutationResp.uuid}`);
      } catch (error) {}
    } else {
      try {
        const mutationResp = await mutationPost.mutateAsync({
          payload: {
            despesas: despesasSelecionadas.map((despesa) => despesa.uuid),
          },
        });

        navigate(`/edicao-bem-produzido/${mutationResp.uuid}`);
      } catch (error) {}
    }
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
            disabled={!despesasSelecionadas.length && !uuid}
            onClick={informarValores}
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
            // onClick={() => setStep(3)}
          />
        </div>
      ) : null}

      <Steps currentStep={step} stepList={stepList} />

      {step === 1 ? (
        <VincularDespesas
          uuid={uuid}
          setStep={setStep}
          despesas={data?.despesas || []}
          setDespesasSelecionadas={setDespesasSelecionadas}
          despesasSelecionadas={despesasSelecionadas}
          salvarRascunho={salvarRascunho}
        />
      ) : null}
      {step === 2 ? (
        <InformarValores
          uuid={uuid}
          despesas={data?.despesas || []}
          salvarRascunhoInformarValores={salvarRascunhoInformarValores}
          podeEditar={podeEditar}
        />
      ) : null}
    </div>
  );
};
