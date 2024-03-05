import { Card, Col, Row, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import { DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants/index';
import { formatDateString } from '@utils/index';
import dayjs from 'dayjs';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import useFetch from '@hooks/useFetch';
import { FormattedMessage, defineMessages } from 'react-intl';
import apiConfig from '@constants/apiConfig';
import { statusOptions } from '@constants/masterData';
import SelectField from '@components/common/form/SelectField';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants, categoryKinds } from '@constants';
import { commonMessage } from '@locales/intl';
import NumericField from '@components/common/form/NumericField';

const StudentForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues, handleFocus }) => {
    const translate = useTranslate();
    const [imageUrl, setImageUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const kindOfEdu = categoryKinds.CATEGORY_KIND_EDUCATION;
    const kindOfGen = categoryKinds.CATEGORY_KIND_GENERATION;
    const [currentKindOfEdu, setCurrentKindOfEdu] = useState(kindOfEdu);
    const statusValues = translate.formatKeys(statusOptions, ['label']);

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

    const {
        data: categorys,
        loading: getCategorysLoading,
        execute: executeGetCategorys,
    } = useFetch(apiConfig.category.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.categoryName })),
    });
    // useEffect(() => {
    //     executeGetCategorys({
    //         params: {},
    //     });
    // }, []);
    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);

    useEffect(() => {
        dataDetail.birthday = dataDetail?.birthday && dayjs(dataDetail?.birthday, DATE_FORMAT_VALUE);
        form.setFieldsValue({
            ...dataDetail,
            // university: dataDetail?.category?.categoryName,
            universityId: dataDetail?.university?.categoryName,
            studyClass: dataDetail?.studyClass?.categoryName,
        });
        setImageUrl(dataDetail.avatar);
    }, [dataDetail]);

    const handleSubmit = (values) => {
        values.birthday = formatDateString(values?.birthday, DATE_FORMAT_VALUE) + ' 00:00:00';
        return mixinFuncs.handleSubmit({ ...values, avatar: imageUrl });
    };

    const validateDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DATE_FORMAT_VALUE);
        if (date && value && value.isAfter(date)) {
            return Promise.reject('Ngày sinh phải nhỏ hơn ngày hiện tại');
        }
        return Promise.resolve();
    };

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
                        <TextField
                            label={translate.formatMessage(commonMessage.name)}
                            required={isEditing ? false : true}
                            disabled={isEditing}
                            name="fullName"
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            name="birthday"
                            label="Ngày sinh"
                            placeholder="Ngày sinh"
                            format={DATE_FORMAT_VALUE}
                            style={{ width: '100%' }}
                            required={isEditing ? false : true}
                            rules={[
                                {
                                    validator: validateDate,
                                },
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.mssv)}
                            disabled={isEditing}
                            // required={isEditing ? false : true}
                            name="mssv"
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.phone)}
                            type="number"
                            name="phone"
                            required={isEditing ? false : true}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.password)}
                            rules={[
                                {
                                    min: 6,
                                    message: 'Mật khẩu phải có ít nhất 6 kí tự!',
                                },
                            ]}
                            required={isEditing ? false : true}
                            name="password"
                            type="password"
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.email)}
                            type="email"
                            name="email"
                            required={isEditing ? false : true}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Trường" />}
                            name="universityId"
                            disabled={isEditing}
                            apiConfig={apiConfig.category.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.categoryName })}
                            initialSearchParams={{
                                kind: kindOfEdu,
                            }}
                            searchParams={(text) => ({ name: text })}
                            onFocus={handleFocus}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Hệ" />}
                            name="studyClass"
                            disabled={isEditing}
                            apiConfig={apiConfig.category.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.categoryName })}
                            initialSearchParams={{
                                kind: kindOfGen,
                            }}
                            searchParams={(text) => ({ name: text })}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
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

export default StudentForm;
