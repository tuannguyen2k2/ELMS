import TextField from '@components/common/form/TextField';
import { Card, Col, Form, Modal, Row, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import useNotification from '@hooks/useNotification';
import { defineMessages } from 'react-intl';
import { useIntl } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import SelectField from '@components/common/form/SelectField';
import { statusOptions, projectTaskState } from '@constants/masterData';
import RichTextField, { insertBaseURL } from '@components/common/form/RichTextField';
import { Image } from 'antd';
import { AppConstants } from '@constants';
const messages = defineMessages({
    objectName: 'Trang thái',
    update: 'Cập nhật',
    updateSuccess: 'Cập nhật {objectName} thành công',
});
const DetailProjectModal = ({
    open,
    onCancel,
    onOk,
    title,
    data,
    DetailData,
    executeUpdate,
    executeLoading,
    setLoading,
    ...props
}) => {
    const [form] = Form.useForm();
    const [isChanged, setChange] = useState(false);
    const notification = useNotification();
    const intl = useIntl();
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const projectTaskStateValues = translate.formatKeys(projectTaskState, ['label']);
    const updateSetting = (values) => {
        executeUpdate({
            data: {
                ...values,
                id: data.id,
                // state: data.state,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onCancel();
                    notification({
                        message: intl.formatMessage(messages.updateSuccess, {
                            objectName: translate.formatMessage(messages.objectName),
                        }),
                    });
                    executeLoading();
                    setChange(false);
                }
            },
            onError: (err) => {},
        });
    };

    const handleInputChange = () => {
        setChange(true);
    };

    useEffect(() => {
        // form.setFields(data);
        form.setFieldsValue({
            ...DetailData,
            description: insertBaseURL(DetailData?.description),
        });
    }, [DetailData]);
    return (
        <Modal centered open={open} onCancel={onCancel} footer={null} title={'Chi tiết dự án'} {...props}>
            <Card className="card-form" bordered={false}>
                <BaseForm form={form} size="100%">
                    <Row gutter={12}>
                        <Col span={12}>
                            <TextField
                                readOnly
                                label={<FormattedMessage defaultMessage="Tên Dự án" />}
                                name={['name']}
                                // initialValue={detail.name}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                readOnly
                                label={<FormattedMessage defaultMessage="Leader" />}
                                name={['leaderInfo', 'leaderName']}
                                // initialValue={detail.name}
                            />
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={12}>
                            <TextField
                                readOnly
                                label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                                name={['startDate']}
                                // initialValue={detail.name}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                readOnly
                                label={<FormattedMessage defaultMessage="Ngày Kết thúc" />}
                                name={['endDate']}
                                // initialValue={detail.name}
                            />
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={12}>
                            <SelectField
                                readOnly
                                label={<FormattedMessage defaultMessage="Trạng thái" />}
                                name={['state']}
                                options={projectTaskStateValues}
                                disabled
                                // initialValue={detail.name}
                            />
                        </Col>
                    </Row>
                    <TextField
                        readOnly
                        label={<FormattedMessage defaultMessage="Mô tả" />}
                        name={['description']}
                        type="textarea"
                    />
                </BaseForm>
            </Card>
        </Modal>
    );
};

export default DetailProjectModal;
