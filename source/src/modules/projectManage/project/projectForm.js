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
import { AppConstants, DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants';
import { statusOptions, projectTaskState } from '@constants/masterData';
import SelectField from '@components/common/form/SelectField';
import DatePickerField from '@components/common/form/DatePickerField';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import dayjs from 'dayjs';
import { formatDateString } from '@utils';

const message = defineMessages({
    avatar: "Avater",
    description: "Mô tả",
    leader: "Leader",
    name: "Tên dự án",
    endDate: "Ngày kết thúc",
    startDate: "Ngày bắt đầu",
});

const ProjectForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues, executeUpdateLeader }) => {
    const translate = useTranslate();
    const [imageUrl, setImageUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
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
        if (isEditing) {
            executeUpdateLeader({
                data: {
                    id: dataDetail?.id,
                    leaderId: values?.leaderId,
                },
                onCompleted: (response) => {
                    notification({
                        message: <FormattedMessage defaultMessage="Cập nhật leader được" />,
                    });
                },
                onError: (err) => { },
            });
        }
        values.startDate = formatDateString(values.startDate, DEFAULT_FORMAT);
        values.endDate = formatDateString(values.endDate, DEFAULT_FORMAT);
        return mixinFuncs.handleSubmit({ ...values, avatar: imageUrl });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
        setImageUrl(dataDetail.avatar);
    }, [dataDetail]);

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
                state: stateValues[0].value,
            });
        }
    }, [isEditing]);

    const {
        data: leaders,
        loading: getLeadersLoading,
        execute: executeGetLeaders,
    } = useFetch(apiConfig.leader.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.leaderName })),
    });

    const {
        data: teams,
        loading: getTeamsLoading,
        execute: executeGetTeams,
    } = useFetch(apiConfig.team.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.teamName })),
    });
    useEffect(() => {
        dataDetail.startDate = dataDetail.startDate && dayjs(dataDetail.startDate, DEFAULT_FORMAT);
        dataDetail.endDate = dataDetail.endDate && dayjs(dataDetail.endDate, DEFAULT_FORMAT);

        form.setFieldsValue({
            ...dataDetail,
            leaderId: dataDetail?.leaderInfo?.id,
            startDate: dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DEFAULT_FORMAT),
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
                        <TextField label={translate.formatMessage(message.name)} name="name" required />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label={translate.formatMessage(message.leader)}
                            name="leaderId"
                            apiConfig={apiConfig.leader.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.leaderName })}
                            initialSearchParams={{}}
                            searchParams={(text) => ({ name: text })}
                            required />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <DatePickerField
                            showTime={true}
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                            name="startDate"
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
                    <Col span={12}>
                        <SelectField
                            required
                            name="status"
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            allowClear={false}
                            options={statusValues}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            name="state"
                            label={<FormattedMessage defaultMessage="Tình trạng" />}
                            allowClear={false}
                            options={stateValues}
                        />
                    </Col>
                </Row>
                <TextField
                    width={'100%'}
                    required
                    label={<FormattedMessage defaultMessage="Mô tả" />}
                    name="description"
                    type="textarea" />
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default ProjectForm;
