import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import SelectField from '@components/common/form/SelectField';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import useFetch from '@hooks/useFetch';
import { FormattedMessage } from 'react-intl';
import apiConfig from '@constants/apiConfig';
import { useState } from 'react';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants } from '@constants';
import { companySeekOptions, statusOptions } from '@constants/masterData';
import { commonMessage } from '@locales/intl';
import { stateCourseRequestOptions } from '@constants/masterData';

const CompanySeekForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues, handleFocus }) => {
    const translate = useTranslate();
    const stateValues = translate.formatKeys(companySeekOptions, ['label']);
    const [logoUrl, setLogoUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const uploadLogoFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'LOGO',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setLogoUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values, logo: logoUrl });
    };

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
        setLogoUrl(dataDetail.logo);
    }, [dataDetail]);
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange} >
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.developerName)}
                            disabled={isEditing}
                            name={['developer', 'studentInfo', 'fullName']} />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.role)}
                            disabled={isEditing}
                            name={['role', 'projectRoleName']}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <SelectField
                            name="state"
                            label={<FormattedMessage defaultMessage="Tình trạng" />}
                            allowClear={false}
                            options={stateValues}
                        />
                    </Col>
                    {/* <Col span={12}>
                        <SelectField
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            name="status"
                            options={statusValues}
                        />
                    </Col> */}
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default CompanySeekForm;
