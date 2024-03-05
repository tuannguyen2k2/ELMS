import { Card, Col, Row, Input } from 'antd';
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
import { AppConstants, DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants';
import { statusOptions } from '@constants/masterData';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import DatePickerField from '@components/common/form/DatePickerField';
import dayjs from 'dayjs';
import { formatDateString } from '@utils';
import NumericField from '@components/common/form/NumericField';
import { commonMessage } from '@locales/intl';

const CompanySubscriptionForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues, handleFocus }) => {
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
        values.startDate = formatDateString(values.startDate, DEFAULT_FORMAT);
        values.endDate = formatDateString(values.endDate, DEFAULT_FORMAT);
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);

    const {
        data: companys,
        loading: getcompanyLoading,
        execute: executescompanys,
    } = useFetch(apiConfig.company.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.companyName })),
    });
    const {
        data: serviceCompanySubscription,
        loading: getserviceCompanySubscriptionLoading,
        execute: executesserviceCompanySubscription,
    } = useFetch(apiConfig.serviceCompanySubscription.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.name })),
    });
    useEffect(() => {
        dataDetail.startDate = dataDetail.startDate ? dayjs(dataDetail.startDate, DEFAULT_FORMAT):dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DEFAULT_FORMAT);
        dataDetail.endDate = dataDetail.endDate && dayjs(dataDetail.endDate, DEFAULT_FORMAT);
        form.setFieldsValue({
            ...dataDetail,
            companyId: dataDetail?.company?.companyName,
            serviceCompanySubscriptionId: dataDetail?.subscription?.name,
        });
    }, [dataDetail]);
    const validateDueDate = (_, value) => {
        const { startDate } = form.getFieldValue();
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };

    const validateStartDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DATE_FORMAT_VALUE);
        if (date && value && value.isBefore(date)) {
            return Promise.reject('Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại');
        }
        return Promise.resolve();
    };
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange} >
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Gói dịch vụ" />}
                            name="serviceCompanySubscriptionId"
                            apiConfig={apiConfig.serviceCompanySubscription.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            initialSearchParams={{}}
                            searchParams={(text) => ({ name: text })}
                            required
                            disabled={isEditing}
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Công ty" />}
                            name="companyId"
                            apiConfig={apiConfig.company.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.companyName })}
                            initialSearchParams={{}}
                            searchParams={(text) => ({ companyName: text })}
                            required
                            disabled={isEditing}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            showTime={true}
                            name="startDate"
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                            placeholder="Ngày bắt đầu"
                            format={DEFAULT_FORMAT}
                            style={{ width: '100%' }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày bắt đầu',
                                },
                                {
                                    validator: validateStartDate,
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            showTime={true}
                            label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                            name="endDate"
                            placeholder="Ngày kết thúc"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày kết thúc',
                                },
                                {
                                    validator: validateDueDate,
                                },
                            ]}
                            format={DEFAULT_FORMAT}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <SelectField
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            name="status"
                            options={statusValues}
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
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default CompanySubscriptionForm;
