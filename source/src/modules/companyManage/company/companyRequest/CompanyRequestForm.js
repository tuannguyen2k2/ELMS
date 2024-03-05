import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import NumericField from '@components/common/form/NumericField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { AppConstants, DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants';
import { statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useDisclosure from '@hooks/useDisclosure';
import useTranslate from '@hooks/useTranslate';
import { formatDateString } from '@utils';
import { Button, Card, Col, Row, Flex, Modal, Form } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import ListDetailsForm from './ListDetailsForm';
import { setData } from '@utils/localStorage';
import ListDetailsTable from './ListDetailsTable';
import { PlusOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { defineMessages } from 'react-intl';
import RichTextField, { insertBaseURL, removeBaseURL } from '@components/common/form/RichTextField';

const messages = defineMessages({
    objectName: 'Yêu cầu',
    title: 'Bạn có xác nhận xoá yêu cầu này?',
    ok: 'Đồng ý',
    cancel: 'Huỷ',
});
const CompanyRequestForm = ({
    isEditing,
    formId,
    actions,
    dataDetail,
    onSubmit,
    setIsChangedFormValues,
    handleFocus,
}) => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const [listData, setListData] = useState([]);
    const [item, setItem] = useState(null);
    const [openedDetailsModal, handlerDetailsModal] = useDisclosure(false);
    const [form] = Form.useForm();
    const {
        form: formRequest,
        mixinFuncs,
        onValuesChange,
    } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        values.startDate = formatDateString(values.startDate, DEFAULT_FORMAT);
        values.dueDate = formatDateString(values.dueDate, DEFAULT_FORMAT);
        return mixinFuncs.handleSubmit({
            ...values,
            listDetails: listData.map((item) => ({ ...item, projectRoleId: item.projectRoleId.value, description: removeBaseURL(values?.description) })),
        });
    };

    useEffect(() => {
        dataDetail.startDate = dataDetail.startDate && dayjs(dataDetail.startDate, DEFAULT_FORMAT);
        dataDetail.dueDate = dataDetail.dueDate && dayjs(dataDetail.dueDate, DEFAULT_FORMAT);
        if (dataDetail?.listDetails)
            setListData(
                dataDetail?.listDetails.map((item, index) => ({
                    ...item,
                    index,
                    projectRoleId: item.projectRoleId
                        ? item.projectRoleId
                        : {
                            ...item.projectRoleInfo,
                            label: item.projectRoleInfo.projectRoleName,
                        },
                })),
            );
        formRequest.setFieldsValue({
            ...dataDetail,
            serviceCompanySubscriptionId: dataDetail?.subscription?.name,
            startDate: dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DEFAULT_FORMAT),
            description: insertBaseURL(dataDetail?.description),
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

    const handleAddList = useCallback((item) => {
        setListData((pre) => {
            return [...pre, { ...item, index: pre.length + 1 }];
        });
        setIsChangedFormValues(true);
    }, []);

    const handleEditItemList = useCallback((item) => {
        setListData((pre) => {
            return pre.map((_item) => {
                if (_item.index === item.index) return item;
                return _item;
            });
        });
        setIsChangedFormValues(true);
    }, []);

    const handleEditList = useCallback((item) => {
        setItem(item);
        handlerDetailsModal.open();
        setIsChangedFormValues(true);
    }, []);

    const handleDeleteList = useCallback((index) => {
        Modal.confirm({
            title: translate.formatMessage(messages.title),
            content: '',
            okText: translate.formatMessage(messages.ok),
            cancelText: translate.formatMessage(messages.cancel),
            onOk: () => {
                setListData((pre) => pre.filter((_) => _.index !== index));
                setIsChangedFormValues(true);
            },
        });
    }, []);

    return (
        <div>
            <BaseForm formId={formId} onFinish={handleSubmit} form={formRequest} onValuesChange={onValuesChange}>
                <Card>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <ListDetailsForm
                            open={openedDetailsModal}
                            onCancel={() => handlerDetailsModal.close()}
                            data={item}
                            isEditing={!!item}
                            handleAddList={handleAddList}
                            form={form}
                            handleEditItemList={handleEditItemList}
                        />
                    </Col>
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField
                                label={<FormattedMessage defaultMessage="Tiêu đề" />}
                                name="title"
                                required
                            />
                        </Col>
                        <Col span={12}>
                            <NumericField
                                label={<FormattedMessage defaultMessage="Số lượng CV" />}
                                name="numberCv"
                                min={0}
                                max={100}
                                required
                            />
                        </Col>
                        <Col span={12}>
                            <DatePickerField
                                name="startDate"
                                label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                                placeholder="Ngày bắt đầu"
                                format={DATE_FORMAT_DISPLAY}
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
                                label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                                name="dueDate"
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
                    <TextField
                        width={'100%'}
                        label={<FormattedMessage defaultMessage="Mô tả ngắn" />}
                        name="shortDescription"
                        type="textarea"
                    />
                    <RichTextField
                        style={{ height: 200, marginBottom: 70 }}
                        label={<FormattedMessage defaultMessage="Mô tả" />}
                        name="description"
                        baseURL={AppConstants.contentRootUrl}
                        setIsChangedFormValues={setIsChangedFormValues}
                        form={form}
                    />

                    <Card bordered style={{ marginBottom: '1rem' }}>
                        <Flex align="center" justify="space-between" style={{ marginBottom: '1rem' }}>
                            <Title level={4}>
                                <FormattedMessage defaultMessage="Danh sách yêu cầu" />
                            </Title>
                            <Button
                                type="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlerDetailsModal.open();
                                    setItem(null);
                                    form.resetFields();
                                }}
                                style={{ width: '150px' }}
                            >
                                <PlusOutlined /> <FormattedMessage defaultMessage="Thêm yêu cầu" />
                            </Button>
                        </Flex>

                        <ListDetailsTable
                            data={listData}
                            handleEditList={handleEditList}
                            handleDeleteList={handleDeleteList}
                        />
                    </Card>
                    <div className="footer-card-form">{actions}</div>
                </Card>
            </BaseForm>
        </div>
    );
};

export default CompanyRequestForm;
