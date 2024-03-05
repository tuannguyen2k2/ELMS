import { Card, Col, Row, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import CropImageField from '@components/common/form/CropImageField';
import { FormattedMessage } from 'react-intl';
import { AppConstants } from '@constants';
import { SalaryOptions, statusOptions } from '@constants/masterData';
import SelectField from '@components/common/form/SelectField';
import { commonMessage } from '@locales/intl';
import NumericField from '@components/common/form/NumericField';
import AutoCompleteField from '@components/common/form/AutoCompleteField';

const LeaderForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues }) => {
    const translate = useTranslate();
    const [imageUrl, setImageUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const salaryValues = translate.formatKeys(SalaryOptions, ['label']);
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

    const handleSubmit = (values) => {
        // if (isEditing) {
        //     delete values.referId;
        // }
        return mixinFuncs.handleSubmit({ ...values, avatar: imageUrl });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            referId: dataDetail?.refer?.leaderName,
        });
        setImageUrl(dataDetail.avatar);
    }, [dataDetail]);

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
                salaryKind: salaryValues[1].value,
            });
        }
    }, [isEditing]);

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <CropImageField
                            label={<FormattedMessage defaultMessage="Avatar" />}
                            name="avatar"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.fullName)} name="leaderName" required />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.phone)}
                            type="number"
                            name="phone"
                            required
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.password)}
                            name="password"
                            type="password"
                            rules={[
                                {
                                    min: 6,
                                    message: 'Mật khẩu phải có ít nhất 6 kí tự!',
                                },
                            ]}
                            required={isEditing ? false : true}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.email)}
                            type="email"
                            name="email"
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            // defaultValue={salaryValues[0]}
                            label={<FormattedMessage defaultMessage="Loại lương" />}
                            name="salaryKind"
                            options={salaryValues}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <NumericField
                            label={<FormattedMessage defaultMessage="Tiền lương" />}
                            name="salary"
                            min={0}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            isCurrency
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Leader refer" />}
                            name='referId'
                            apiConfig={apiConfig.leader.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.leaderName })}
                            initialSearchParams={{ pageNumber: 0 }}
                            searchParams={(text) => ({ leaderName: text })}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Status" />}
                            name="status"
                            options={statusValues}
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default LeaderForm;
