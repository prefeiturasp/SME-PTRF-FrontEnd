import { useParams } from "react-router-dom";
import { IconButton } from "../../../Globais/UI";
import { Steps } from "./components/Steps";
import { VincularDespesas } from "./VincularDespesas";
import { useEffect, useState } from "react";
import { useGetBemProduzido } from "./hooks/useGetBemProduzido";
import { InformarValores } from "./InformarValores";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePostBemProduzido } from "./hooks/usePostBemProduzido";
import { usePatchBemProduzido } from "./hooks/usePatchBemProduzido";
import { ClassificarBem } from "./ClassificarBem";
import { usePatchBemProduzidoItems } from "./ClassificarBem/hooks/usePatchBemProduzidoItems";
import { usePatchBemProduzidoItemsRascunho } from "./ClassificarBem/hooks/usePatchBemProduzidoItemsRascunho";

const stepList = [
  { label: "Selecionar despesas" },
  { label: "Informar valores utilizados" },
  { label: "Classificar o bem", qa: "circulo-em-analise-trilha-status-pc" },
];

export const FormularioBemProduzido = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [despesasSelecionadas, setDespesasSelecionadas] = useState([]);
  const [rateiosComValores, setRateiosComValores] = useState([]);
  const [bemProduzidoItems, setBemProduzidoItems] = useState([]);
  const [habilitaClassificarBem, setHabilitaClassificarBem] = useState(false);
  const [habilitaCadastrarBem, setHabilitaCadastrarBem] = useState(false);

  const { data } = useGetBemProduzido(uuid);
  const { mutationPost } = usePostBemProduzido();
  const { mutationPatch } = usePatchBemProduzido();
  const { mutationPatch: mutationPatchBemProduzidoItems } =
    usePatchBemProduzidoItems();
  const { mutationPatch: mutationPatchBemProduzidoItemsRascunho } =
    usePatchBemProduzidoItemsRascunho();

  const podeEditar = uuid && data?.status === "INCOMPLETO";
  const paramStep = searchParams.get("step");

  useEffect(() => {
    if (paramStep) {
      setStep(parseInt(paramStep));
    }
  }, [paramStep]);

  const salvarRascunhoVincularDespesas = async () => {
    try {
      await mutationPost.mutateAsync({
        payload: {
          despesas: despesasSelecionadas.map((despesa) => despesa.uuid),
        },
      });

      navigate(`/lista-situacao-patrimonial`);
    } catch (error) {}
  };

  const salvarRascunhoInformarValores = async () => {
    try {
      await mutationPatch.mutateAsync({
        uuid: uuid,
        payload: { rateios: rateiosComValores },
      });

      navigate(`/lista-situacao-patrimonial`);
    } catch (error) {}
  };

  const informarValores = async () => {
    try {
      const mutationResp = await mutationPatch.mutateAsync({
        uuid: uuid,
        payload: { rateios: rateiosComValores },
      });
      navigate(`/edicao-bem-produzido/${mutationResp.uuid}/?step=3`);
    } catch (error) {}
  };

  const salvarRascunhoClassificarBens = async () => {
    try {
      await mutationPatchBemProduzidoItemsRascunho.mutateAsync({
        uuid: uuid,
        payload: {
          itens: bemProduzidoItems,
        },
      });

      navigate(`/lista-situacao-patrimonial`);
    } catch (error) {}
  };

  const cadastrarBens = async () => {
    try {
      await mutationPatchBemProduzidoItems.mutateAsync({
        uuid: uuid,
        payload: {
          itens: bemProduzidoItems,
        },
      });

      navigate(`/lista-situacao-patrimonial`);
    } catch (error) {}
  };

  const salvarDespesas = async () => {
    try {
      const mutationResp = await mutationPost.mutateAsync({
        payload: {
          despesas: despesasSelecionadas.map((despesa) => despesa.uuid),
        },
      });
      navigate(`/edicao-bem-produzido/${mutationResp.uuid}/?step=2`);
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
            disabled={!despesasSelecionadas.length && !uuid}
            onClick={salvarDespesas}
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
            onClick={informarValores}
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
            onClick={cadastrarBens}
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
          salvarRascunho={salvarRascunhoVincularDespesas}
        />
      ) : null}
      {step === 2 ? (
        <InformarValores
          uuid={uuid}
          despesas={data?.despesas || []}
          salvarRascunhoInformarValores={salvarRascunhoInformarValores}
          podeEditar={podeEditar}
          setRateiosComValores={setRateiosComValores}
          setHabilitaClassificarBem={setHabilitaClassificarBem}
        />
      ) : step === 3 ? (
        <ClassificarBem
          total={data?.valor_total_informado}
          items={data?.items || []}
          salvarRascunhoClassificarBens={salvarRascunhoClassificarBens}
          cadastrarBens={cadastrarBens}
          setBemProduzidoItems={setBemProduzidoItems}
          bemProduzidoItems={bemProduzidoItems}
          setHabilitaCadastrarBem={setHabilitaCadastrarBem}
          habilitaCadastrarBem={habilitaCadastrarBem}
        />
      ) : null}
    </div>
  );
};
