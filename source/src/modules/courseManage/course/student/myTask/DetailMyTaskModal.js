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
import { taskState } from '@constants/masterData';
import RichTextField from '@components/common/form/RichTextField';
import { commonMessage } from '@locales/intl';
import { AppConstants } from '@constants';
const messages = defineMessages({
    objectName: 'Chi tiết task',
    // update: 'Cập nhật',
    // updateSuccess: 'Cập nhật {objectName} thành công',
});
const DetailMyTaskModal = ({ open, onCancel, DetailData, ...props }) => {
    const [form] = Form.useForm();

    const translate = useTranslate();

    const stateValues = translate.formatKeys(taskState, ['label']);

    useEffect(() => {
        if (JSON.stringify(DetailData) !== '{}') {
            if (!DetailData?.note) {
                DetailData.note = null;
            }
            if (!DetailData?.lecture?.description) {
                DetailData.lecture.description = null;
            }
        }

        form.setFieldsValue({
            ...DetailData,
        });
    }, [DetailData]);
    const handleOnCancel = () => {
        onCancel();
    };
    return (
        <Modal
            centered
            open={open}
            onCancel={handleOnCancel}
            width={800}
            footer={[]}
            title={translate.formatMessage(messages.objectName)}
        >
            <BaseForm form={form} style={{ width: '100%' }}>
                <Card className="card-form" bordered={false}>
                    <Row gutter={12}>
                        <Col span={12}>
                            <TextField
                                readOnly
                                label={<FormattedMessage defaultMessage="Tên task" />}
                                name={['lecture', 'lectureName']}
                                // initialValue={detail.name}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                readOnly
                                label={<FormattedMessage defaultMessage="Lập trình viên" />}
                                name={['student', 'fullName']}
                                // initialValue={detail.name}
                            />
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={12}>
                            <TextField
                                readOnly
                                label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                                name="startDate"
                                // initialValue={detail.name}
                            />
                        </Col>

                        <Col span={12}>
                            <TextField
                                readOnly
                                label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                                name="dueDate"
                                // initialValue={detail?.subject?.subjectName}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <RichTextField
                                disabled
                                label={translate.formatMessage(commonMessage.description)}
                                labelAlign="left"
                                name={['lecture', 'description']}
                                style={{
                                    height: 300,
                                    marginBottom: 70,
                                }}
                                required
                                baseURL={AppConstants.contentRootUrl}
                                form={form}
                            />
                        </Col>
                    </Row>

                    <Row gutter={12}>
                        <Col span={12}>
                            <SelectField
                                readOnly
                                label={<FormattedMessage defaultMessage="Tình Trạng" />}
                                name="state"
                                options={stateValues}
                                disabled
                                // initialValue={detail?.subject?.subjectName}
                            />
                        </Col>
                    </Row>
                    <TextField
                        readOnly
                        label={<FormattedMessage defaultMessage="Note" />}
                        name="note"
                        type="textarea"
                        // initialValue={detail?.subject?.subjectName}
                    />
                </Card>
            </BaseForm>
        </Modal>
    );
};

export default DetailMyTaskModal;
