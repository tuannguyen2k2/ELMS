import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants';
import apiConfig from '@constants/apiConfig';
import { taskState } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { formatDateString } from '@utils';
import { Card, Col, Form, Row } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

const TaskForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues } = props;
    const translate = useTranslate();
    const statusValues = translate.formatKeys(taskState, ['label']);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        values.startDate = formatDateString(values.startDate, DEFAULT_FORMAT);
        values.dueDate = formatDateString(values.dueDate, DEFAULT_FORMAT);
        return mixinFuncs.handleSubmit({ ...values });
    };
    const validateDueDate = (_, value) => {
        const { startDate } = form.getFieldValue();
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };
    const {
        data: students,
        loading: getstudentsLoading,
        execute: executestudents,
    } = useFetch(apiConfig.student.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.fullName })),
    });
    // useEffect(() => {
    //     executestudents({
    //         params: {},
    //     });
    // }, []);
    useEffect(() => {
        dataDetail.startDate = dataDetail.startDate && dayjs(dataDetail.startDate, DEFAULT_FORMAT);
        dataDetail.dueDate = dataDetail.dueDate && dayjs(dataDetail.dueDate, DEFAULT_FORMAT);

        form.setFieldsValue({
            ...dataDetail,
            studentId: dataDetail?.student?.fullName,
        });
    }, [dataDetail]);
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <AutoCompleteField
                            disabled
                            label={<FormattedMessage defaultMessage="Tên sinh viên" />}
                            name="studentId"
                            apiConfig={apiConfig.student.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.fullName })}
                            initialSearchParams={{}}
                            searchParams={(text) => ({ fullName: text })}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            disabled={dataDetail?.state === 2}
                            required
                            name="state"
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            allowClear={false}
                            options={statusValues}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            showTime={true}
                            name="startDate"
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                            placeholder="Ngày bắt đầu"
                            disabled={dataDetail?.state === 2}
                            format={DEFAULT_FORMAT}
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
                            showTime={true}
                            name={'dueDate'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày kết thúc',
                                },
                                {
                                    validator: validateDueDate,
                                },
                            ]}
                            label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                            placeholder="Ngày kết thúc"
                            format={DEFAULT_FORMAT}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>
                <TextField
                    width={'100%'}
                    label={<FormattedMessage defaultMessage="Note" />}
                    name="note"
                    type="textarea"
                />

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default TaskForm;
