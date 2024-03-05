import TextField from '@components/common/form/TextField';
import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import CropImageField from '@components/common/form/CropImageField';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { AppConstants } from '@constants';
import { Fragment } from 'react';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import NumericField from '@components/common/form/NumericField';

const messages = defineMessages({
    banner: 'Banner',
    avatarPath: 'Avatar',
    username: 'Username',
    career: 'Career Name',
    fullName: 'Leader',
    email: 'Email',
    hotline: 'Hot line',
    phoneNumber: 'Phone Number',
    taxNumber: 'Tax Number',
    zipCode: 'Zip Code',
    city: 'City',
    address: 'Address',
    logo: 'Logo',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    passwordLengthError: 'Password must be at least 6 characters',
    passwordMatchError: 'Password does not match',
});

const LeaderForm = (props) => {
    const { formId, dataDetail, onSubmit, setIsChangedFormValues, actions, isAdmin } = props;
    const [imageUrl, setImageUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const translate = useTranslate();

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
        setImageUrl(dataDetail?.avatar);
    }, [dataDetail]);

    const handleFinish = (values) => {
        (values.avatar = imageUrl),
        mixinFuncs.handleSubmit({
            ...values,
            avatarPath: values.avatar,
        });
    };

    return (
        <Card className="card-form" bordered={false} style={{ minHeight: 'calc(100vh - 190px)' }}>
            <Form
                style={{ width: '50%' }}
                labelCol={{ span: 8 }}
                id={formId}
                onFinish={handleFinish}
                form={form}
                layout="horizontal"
                onValuesChange={onValuesChange}
            >
                <Row style={{ marginLeft: '8rem' }} gutter={16}>
                    <Col span={8}>
                        <CropImageField
                            label={translate.formatMessage(commonMessage.avatar)}
                            name="avatarPath"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            required
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row>
                <TextField label={translate.formatMessage(commonMessage.email)} disabled name="email" />
                <TextField label={translate.formatMessage(commonMessage.fullName)} name="leaderName" />
                <TextField label={translate.formatMessage(commonMessage.phone)} disabled name="phone" />
                <TextField
                    type="password"
                    label={translate.formatMessage(commonMessage.currentPassword)}
                    required
                    name="oldPassword"
                />
                <TextField
                    type="password"
                    label={translate.formatMessage(commonMessage.newPassword)}
                    name="newPassword"
                    rules={[
                        {
                            validator: async () => {
                                const isTouched = form.isFieldTouched('newPassword');
                                if (isTouched) {
                                    const value = form.getFieldValue('newPassword');
                                    if (value.length < 6) {
                                        throw new Error(translate.formatMessage(messages.passwordLengthError));
                                    }
                                }
                            },
                        },
                    ]}
                />
                <TextField
                    type="password"
                    label={translate.formatMessage(commonMessage.confirmPassword)}
                    name="confirmPassword"
                    rules={[
                        {
                            validator: async () => {
                                const password = form.getFieldValue('newPassword');
                                const confirmPassword = form.getFieldValue('confirmPassword');
                                if (password !== confirmPassword) {
                                    throw new Error(translate.formatMessage(messages.passwordMatchError));
                                }
                            },
                        },
                    ]}
                />

                <div className="footer-card-form">{actions}</div>
            </Form>
        </Card>
    );
};

export default LeaderForm;
