import TextField from '@components/common/form/TextField';
import { Card, Col, Form, Modal, Row, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import useNotification from '@hooks/useNotification';
import { defineMessages } from 'react-intl';
import { useIntl } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import useFetch from '@hooks/useFetch';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import apiConfig from '@constants/apiConfig';
import { useNavigate } from 'react-router-dom';
import NumericField from '@components/common/form/NumericField';
import { showErrorMessage } from '@services/notifyService';
import { validateUsernameForm } from '@utils';
import { values } from 'lodash';

const messages = defineMessages({
    objectName: 'gói dịch vụ',
    update: 'Mua',
    updateSuccess: 'Mua {objectName} thành công',
});
const BuyServiceModal = ({
    open,
    onCancel,
    onOk,
    title,
    data,
    executeUpdate,
    executeLoading,
    isEditing,
    ...props
}) => {
    const [form] = Form.useForm();
    const [isChanged, setChange] = useState(false);
    const notification = useNotification();
    const intl = useIntl();
    const translate = useTranslate();
    const navigate = useNavigate();
    const updateSetting = (values) => {
        executeUpdate({
            data: {
                serviceCompanySubscriptionId: values?.serviceCompanySubscriptionId,
                valueable: values?.valueable,
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
                    navigate('/my-company-subscription');
                }
            },
            onError: (err) => {
                if (err.code === 'ERROR-COMPANY-SUBSCRIPTION-ERROR-0001') {
                    showErrorMessage('Gói dịch vụ đã tồn tại');
                    onCancel();
                }
            },
        });
    };

    const handleInputChange = () => {
        setChange(true);
    };

    const {
        data: serviceCompanySubscription,
        loading: getserviceCompanySubscriptionLoading,
        execute: executesserviceCompanySubscription,
    } = useFetch(apiConfig.serviceCompanySubscription.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.name })),
    });

    useEffect(() => {
        // form.setFields(data);
        form.setFieldsValue({
            ...data,
            serviceCompanySubscriptionId: data?.name,
            valueable: data?.valueable,
        });
    }, [data]);

    return (
        <Modal centered open={open} onCancel={onCancel} footer={null} title={<FormattedMessage defaultMessage="Mua dịch vụ" />} {...props}>
            <Card className="card-form" bordered={false}>
                <BaseForm form={form} onFinish={updateSetting} size="100%">
                    <Row gutter={16}>
                        <Col span={24}>
                            <AutoCompleteField
                                label={<FormattedMessage defaultMessage="Gói dịch vụ" />}
                                name="serviceCompanySubscriptionId"
                                apiConfig={apiConfig.serviceCompanySubscription.autocomplete}
                                mappingOptions={(item) => ({ value: item.id, label: item.name })}
                                initialSearchParams={{}}
                                searchParams={(text) => ({ name: text })}
                                disabled={isEditing}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <NumericField
                                label={<FormattedMessage defaultMessage="Số ngày sử dụng" />}
                                name="valueable"
                                disabled={isEditing}
                            // onChange={handleInputChange}
                            />
                        </Col>
                    </Row>
                    <div style={{ float: 'right' }}>
                        <Button key="submit" type="primary" htmlType="submit">
                            {<FormattedMessage defaultMessage="Mua dịch vụ" />}
                        </Button>
                    </div>
                </BaseForm>
            </Card>
        </Modal>
    );
};

export default BuyServiceModal;
