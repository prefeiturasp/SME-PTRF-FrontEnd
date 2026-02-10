import { useMemo, useEffect, useState } from "react";
import { DatePicker, Spin, Form, Flex, Row, Col, Input, Typography, Divider } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { RodapeFormsID } from "../../../../Globais/RodapeFormsID";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"
import { ModalConfirmarExclusao } from "../../componentes/ModalConfirmarExclusao";
import { toastCustom } from "../../../../Globais/ToastCustom";
import { HabilitarOutrosRecursos } from "./OutrosRecursosPeriodo";
import { useGetPeriodoPaa } from "./hooks/useGet";
import { usePost } from "./hooks/usePost";
import { usePatch } from "./hooks/usePatch";
import { useDelete } from "./hooks/useDelete";
import dayjs from 'dayjs'
import { Icon } from "../../../../Globais/UI/Icon";

export const PeriodoPAAForm = () => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()

    const [showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao] = useState(false);

    const [form] = Form.useForm();

    Form.useWatch("referencia", form);
    Form.useWatch("data_inicial", form);
    Form.useWatch("data_final", form);

    const navigate = useNavigate();
    const { uuid } = useParams();
    const isNew = uuid === undefined;

    const onSuccessPost = (data) => {
        navigate(`/edicao-periodo-paa/${data.uuid}`);
    }

    const { mutationPost } = usePost({onSuccessPost})
    const { mutationPatch } = usePatch({})
    const { mutationDelete } = useDelete()
    const { data, isLoading } = useGetPeriodoPaa(uuid);

    const loading = useMemo(() => {
        return (
          (isLoading && !isNew) ||
          mutationPost.isPending ||
          mutationPatch.isPending ||
          mutationDelete.isPending
        );
    }, [isLoading, isNew, mutationPost.isPending, mutationPatch.isPending, mutationDelete.isPending]);

    useEffect(() => {
        if(data){
            form.setFieldsValue({
                ...data,
                data_inicial: dayjs(data.data_inicial),
                data_final: dayjs(data.data_final)
            })
        }
        if (isNew) {
            form.setFieldsValue({
                referencia: '',
                data_inicial: null,
                data_final: null,
                editavel: true
            });
        }
    }, [data, form])
    
    const disabledDate = (current, data_inicial) => {
        return current && current < dayjs(data_inicial).endOf('month');
    };

    const handleExcluir = async (uuid) => {
        if (!uuid) {
            console.error("Período de PAA sem UUID. Não é possível excluir: ", uuid)
            toastCustom.ToastCustomError(
                'Erro ao remover período de PAA',
                `Período de PAA sem UUID identificado. Não é possível excluir: ${uuid}`)
        } else {
            mutationDelete.mutate(uuid)
            setShowModalConfirmacaoExclusao(false)
            navigate("/parametro-periodos-paa")
        }
    };

    const handleSubmit = async (values) => {
        await form.validateFields();

        const payload = {
            referencia: values.referencia,
            data_inicial: values.data_inicial.format("YYYY-MM-DD"),
            data_final: values.data_final.format("YYYY-MM-DD"),
        }

        if (uuid) {
            mutationPatch.mutate({ uuid: data.uuid, payload });
        } else {
            mutationPost.mutate({ payload });
        }
    };

    const handleCancelar = () => {
        navigate("/parametro-periodos-paa");
    };
    
    return (
        <>
            <Spin spinning={loading}>
                <Flex justify="flex-end">
                    <span>* Preenchimento obrigatório</span>
                </Flex>
                <Typography.Title level={5} strong>Período</Typography.Title>
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                    role="form"
                >
                    <Row gutter={16}>
                        <Col md={24}>
                            <Form.Item
                                label={
                                    <>
                                        Referência do período de PAA
                                        <Icon iconProps={{style: {marginLeft: 3} }} icon="faInfoCircle" tooltipMessage="Preencher com o período de vigência do PAA. Por exemplo: 2025 a 2026"/>
                                    </>
                                }
                                name="referencia"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[{ required: true, message: "Campo obrigatório" }]}
                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                <Input name="referencia" placeholder="Descrição do período (Ex: 2025 a 2026)" />
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <Form.Item
                                name="data_inicial"
                                label="Data inicial"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[{ required: true, message: "Campo obrigatório" }]}
                                style={{ width: "100%" }}>
                                    <DatePicker
                                        name="data_inicial"
                                        id="data_inicial"
                                        onChange={(date) => form.setFieldValue("data_inicial", date ? date : null)}
                                        value={form.getFieldValue("data_inicial") ? dayjs(form.getFieldValue("data_inicial")) : null}
                                        format="MM/YYYY"
                                        className='w-100'
                                        picker="month"
                                        inputReadOnly
                                        disabled={(!form.getFieldValue("editavel")) || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        data-qa={"input-data-inicial"}
                                        data-testid={"input-data-inicial"}
                                    />
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <Form.Item
                                name="data_final"
                                label="Data final"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                dependencies={['data_inicial']}
                                rules={[
                                    { required: true, message: "Campo obrigatório" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const dataInicial = getFieldValue("data_inicial");

                                            // Se não há data ou o campo ainda está vazio, não valida agora
                                            if (!value || !dataInicial) {
                                                return Promise.resolve();
                                            }

                                            // Converter para dayjs caso estejam como Date
                                            const inicio = dayjs(dataInicial);
                                            const fim = dayjs(value);

                                            if (fim.isBefore(inicio, "month")) {
                                                return Promise.reject(
                                                    new Error("A data final não pode ser anterior à data inicial.")
                                                );
                                            }

                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                                style={{ width: "100%" }}>
                                    <DatePicker
                                        name="data_final"
                                        id="data_final"
                                        onChange={(date) => form.setFieldValue("data_final", date ? date : null)}
                                        value={form.getFieldValue("data_final") ? dayjs(form.getFieldValue("data_final")) : null}
                                        format="MM/YYYY"
                                        className='w-100'
                                        picker="month"
                                        inputReadOnly
                                        disabled={(!form.getFieldValue("editavel")) || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        dataQa={"input-data-final"}
                                        data-testid={"input-data-final"}
                                    />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Flex gap="small" justify={uuid ? "space-between" : "flex-end"}>
                        <div>
                            {!!data?.uuid && (
                                <button
                                    onClick={() => setShowModalConfirmacaoExclusao(true)}
                                    type="button"
                                    className="btn btn btn-danger"
                                    disabled={!data?.editavel || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    >
                                    Excluir
                                </button>
                            )}
                        </div>

                        <div>
                            <button
                                type="button"
                                className="btn btn-outline-success mr-2"
                                onClick={handleCancelar}>
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn btn-success"
                                disabled={(!!data?.uuid && !data?.editavel) || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                Salvar
                            </button>
                        </div>

                    </Flex>
                </Form>
                
                {data?.uuid && (
                    <section>
                        <ModalConfirmarExclusao
                            open={showModalConfirmacaoExclusao}
                            onOk={() => handleExcluir(uuid)}
                            okText="Excluir"
                            onCancel={() => setShowModalConfirmacaoExclusao(false)}
                            cancelText="Cancelar"
                            cancelButtonProps={{ className: "btn-base-verde-outline" }}
                            titulo="Excluir Período PAA"
                            bodyText={<p>Tem certeza que deseja excluir este período?</p>}
                        />
                    </section>
                )}
            </Spin>
            {!!data?.uuid && <>
                <Divider />

                <HabilitarOutrosRecursos periodoUuid={data?.uuid}/>

                <Divider />

                <Row>
                    <Col md={24}>
                        <RodapeFormsID value={data?.id} />
                    </Col>
                </Row>
            </>}



        </>
    )

}