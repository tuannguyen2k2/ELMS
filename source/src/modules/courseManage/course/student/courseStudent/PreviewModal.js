import TextField from '@components/common/form/TextField';
import { Col, Form, Modal, Row, Button, Image, Avatar } from 'antd';
import React, { useEffect, useState } from 'react';
import { BaseForm } from '@components/common/form/BaseForm';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { AppConstants } from '@constants';
import { Card } from 'antd';
import CropImageField from '@components/common/form/CropImageField';
import { FormattedMessage } from 'react-intl';
import NumericField from '@components/common/form/NumericField';
import { lectureState } from '@constants/masterData';
import ImageField from '@components/common/form/ImageField';
import SelectField from '@components/common/form/SelectField';
const messages = defineMessages({
    objectName: 'Chi tiết khoá học',
});
const PreviewModal = ({ open, onCancel, detail }) => {
    const translate = useTranslate();
    const [form] = Form.useForm();
    const lectureStateOptions = translate.formatKeys(lectureState, ['label']);
    const [lectureStateFilter, setLectureStateFilter] = useState([lectureStateOptions[0]]);
    const handleOnCancel = () => {
        onCancel();
    };
    useEffect(() => {
        // form.setFields(data);
        form.setFieldsValue({
            ...detail,
        });
    }, [detail]);
    return (
        <Modal
            centered
            open={open}
            onCancel={handleOnCancel}
            onOk={handleOnCancel}
            width={800}
            footer={[]}
            title={translate.formatMessage(messages.objectName)}
        >
            <BaseForm form={form} style={{ width: '100%' }}>
                <Card className="card-form" bordered={false}>
                    <Row>
                        <Col span={12}>
                            <Form.Item label={<FormattedMessage defaultMessage="Avatar" />}>
                                <Image
                                    width={100}
                                    height={100}
                                    name="avatar"
                                    src={detail && `${AppConstants.contentRootUrl}${detail.avatar}`}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={<FormattedMessage defaultMessage="Banner" />}>
                                <Image
                                    name="banner"
                                    src={detail && `${AppConstants.contentRootUrl}${detail?.banner}`}
                                    height={100}
                                    width={130}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={12}>
                            <TextField
                                readOnly
                                label={<FormattedMessage defaultMessage="Tên khoá học" />}
                                name="name"
                                initialValue={detail.name}
                            />
                        </Col>

                        <Col span={12}>
                            <TextField
                                readOnly
                                label={<FormattedMessage defaultMessage="Môn học" />}
                                name={['subject', 'subjectName']}
                                initialValue={detail?.subject?.subjectName}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                readOnly
                                label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                                name="dateRegister"
                                initialValue={detail.dateRegister}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                readOnly
                                label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                                name="dateEnd"
                                initialValue={detail.dateEnd}
                            />
                        </Col>
                    </Row>

                    <Row gutter={10}>
                        <Col span={12}>
                            <TextField
                                readOnly
                                label={<FormattedMessage defaultMessage="Leader" />}
                                name={['leader', 'leaderName']}
                                initialValue={detail?.leader?.leaderName}
                            />
                        </Col>
                        <Col span={12}>
                            <SelectField
                                required
                                name="state"
                                label={<FormattedMessage defaultMessage="Tình trạng" />}
                                allowClear={false}
                                options={lectureStateOptions}
                                disabled
                            />
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col span={12}>
                            <NumericField
                                label={<FormattedMessage defaultMessage="Học phí" />}
                                name="fee"
                                readOnly
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                isCurrency
                                defaultValue={detail?.fee}
                            />
                        </Col>
                        <Col span={12}>
                            <NumericField
                                label={<FormattedMessage defaultMessage="Phí hoàn trả" />}
                                name="returnFee"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                isCurrency
                                readOnly
                                defaultValue={detail?.returnFee}
                            />
                        </Col>
                    </Row>
                </Card>
            </BaseForm>
        </Modal>
    );
};

export default PreviewModal;
