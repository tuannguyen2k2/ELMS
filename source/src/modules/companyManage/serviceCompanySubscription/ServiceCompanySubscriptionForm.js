import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import SelectField from '@components/common/form/SelectField';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import NumericField from '@components/common/form/NumericField';
import { defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import { FormattedMessage } from 'react-intl';
import { statusOptions } from '@constants/masterData';
import { commonMessage } from '@locales/intl';

const ServiceCompanySubscriptionForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues }) => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
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


    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange} >
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.ServiceCompanySubscriptionName)}
                            name="name"
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <NumericField
                            label={translate.formatMessage(commonMessage.price)}
                            name='price'
                            min={0}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            isCurrency
                            required
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <NumericField
                            label={<FormattedMessage defaultMessage="Số ngày sử dụng" />}
                            name='valueable'
                            required
                            min={0}
                            type='number'
                        />
                    </Col>
                    <Col span={12}>
                        <NumericField
                            label={<FormattedMessage defaultMessage="Giảm giá" />}
                            name="saleOff"
                            min={0}
                            max={100}
                            formatter={(value) => `${value}%`}
                            parser={(value) => value.replace('%', '')}
                        />
                    </Col>

                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <SelectField
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            name="status"
                            required
                            options={statusValues}
                        />
                    </Col>

                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default ServiceCompanySubscriptionForm;
