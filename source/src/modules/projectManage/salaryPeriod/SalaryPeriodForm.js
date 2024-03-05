import { Card, Col, Row, DatePicker, notification } from 'antd';
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
import {
    AppConstants,
    DATE_DISPLAY_FORMAT,
    DATE_FORMAT_DISPLAY,
    DATE_FORMAT_END_OF_DAY_TIME,
    DATE_FORMAT_VALUE,
    DATE_FORMAT_ZERO_TIME,
    DEFAULT_FORMAT,
} from '@constants';
import { statusOptions, projectTaskState, salaryPeriodState } from '@constants/masterData';
import SelectField from '@components/common/form/SelectField';
import DatePickerField from '@components/common/form/DatePickerField';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import dayjs from 'dayjs';
import { formatDateString } from '@utils';

const SalaryPeriodForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues }) => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(salaryPeriodState, ['label']);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        if (!values?.state) {
            values.state = 1;
        }
        values.start = formatDateToZeroTime(values.start);
        values.end = formatDateToEndOfDayTime(values.end);
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        dataDetail.start = dataDetail.start && dayjs(dataDetail.start, DEFAULT_FORMAT);
        dataDetail.end = dataDetail.end && dayjs(dataDetail.end, DEFAULT_FORMAT);
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);

    const validateDueDate = (_, value) => {
        const { start } = form.getFieldValue();
        if (start && value && value.isBefore(start.add(1, 'day'))) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={<FormattedMessage defaultMessage="Tên kỳ lương" />} name="name" required />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            defaultValue={stateValues[0]}
                            name="state"
                            label={<FormattedMessage defaultMessage="Tình trạng" />}
                            allowClear={false}
                            options={stateValues}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                            name="start"
                            placeholder="Ngày bắt đầu"
                            format={DATE_FORMAT_DISPLAY}
                            style={{ width: '100%' }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày bắt đầu',
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                            name="end"
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
                            format={DATE_FORMAT_DISPLAY}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};
const formatDateToZeroTime = (date) => {
    const dateString = formatDateString(date, DEFAULT_FORMAT);
    return dayjs(dateString, DEFAULT_FORMAT).format(DATE_FORMAT_ZERO_TIME);
};
const formatDateToEndOfDayTime = (date) => {
    const dateString = formatDateString(date, DEFAULT_FORMAT);
    return dayjs(dateString, DEFAULT_FORMAT).format(DATE_FORMAT_END_OF_DAY_TIME);
};

export default SalaryPeriodForm;
