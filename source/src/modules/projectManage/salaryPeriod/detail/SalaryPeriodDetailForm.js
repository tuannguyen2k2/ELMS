import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import apiConfig from '@constants/apiConfig';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

const SalaryPeriodDetailForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues }) => {
    const translate = useTranslate();
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);


    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <AutoCompleteField
                            required
                            label={<FormattedMessage defaultMessage="Lập trình viên" />}
                            name="developerId"
                            apiConfig={apiConfig.developer.autocomplete}
                            mappingOptions={(item) => ({
                                value: item.id,
                                label: item.studentInfo.fullName,
                            })}
                            searchParams={(text) => ({ name: text })}
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            required
                            label={<FormattedMessage defaultMessage="Dự án" />}
                            name="projectId"
                            apiConfig={apiConfig.project.autocomplete}
                            mappingOptions={(item) => ({
                                value: item.id,
                                label: item.name,
                            })}
                            searchParams={(text) => ({ name: text })}
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default SalaryPeriodDetailForm;
