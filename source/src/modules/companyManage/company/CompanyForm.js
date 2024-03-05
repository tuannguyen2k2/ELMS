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
import { statusOptions } from '@constants/masterData';
import { commonMessage } from '@locales/intl';
import NumericField from '@components/common/form/NumericField';

const CompanyForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues, handleFocus }) => {
    const translate = useTranslate();
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
    const usernamePattern = /^[a-z0-9]+$/;
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange} >
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <CropImageField
                            label={translate.formatMessage(commonMessage.logo)}
                            name="logo"
                            imageUrl={logoUrl && `${AppConstants.contentRootUrl}${logoUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadLogoFile}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.companyName)}
                            rules={[
                                {
                                    required: true,
                                    message: translate.formatMessage(commonMessage.required),
                                },
                            ]}
                            name="companyName" />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.username)}
                            rules={[
                                {
                                    required: true,
                                    pattern: usernamePattern,
                                    message: 'Username chỉ được chứa kí tự thường a-z và số 0-9',
                                },
                            ]}
                            disabled={isEditing}
                            name="username"
                        />
                    </Col>

                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.email)} type='email' name="email" />
                    </Col>
                    <Col span={12}>
                        <NumericField
                            label={translate.formatMessage(commonMessage.holine)}
                            type="number"
                            min={0}
                            rules={[
                                {
                                    required: true,
                                    message: translate.formatMessage(commonMessage.required),
                                },
                            ]}
                            name="hotline"
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.password)}
                            required={isEditing ? false : true}
                            type="password"
                            name="password"
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            name="status"
                            options={statusValues}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <TextField
                            label={translate.formatMessage(commonMessage.address)}
                            rules={[
                                {
                                    required: true,
                                    message: translate.formatMessage(commonMessage.required),
                                },
                            ]}
                            name="address" />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default CompanyForm;
