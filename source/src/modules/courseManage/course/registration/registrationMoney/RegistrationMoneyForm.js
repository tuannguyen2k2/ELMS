import { BaseForm } from '@components/common/form/BaseForm';
import TextField from '@components/common/form/TextField';
import { DEFAULT_FORMAT } from '@constants';
import { projectTaskState, statusOptions, registrationMoneyKind } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { formatDateString } from '@utils';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import SelectField from '@components/common/form/SelectField';
import { FormattedMessage } from 'react-intl';
import NumericField from '@components/common/form/NumericField';

const RegistrationMoneyForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues }) => {
    const translate = useTranslate();
    const [imageUrl, setImageUrl] = useState(null);

    const registrationMoneyKindValue = translate.formatKeys(registrationMoneyKind, ['label']);

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
                <NumericField 
                    label={<FormattedMessage defaultMessage="Số tiền" />} 
                    name={['money']}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    isCurrency
                    min={0}
                />
                <SelectField
                    required
                    name={['kind']}
                    label={<FormattedMessage defaultMessage="Loại tiền" />}
                    allowClear={false}
                    options={registrationMoneyKindValue}
                />
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default RegistrationMoneyForm;
