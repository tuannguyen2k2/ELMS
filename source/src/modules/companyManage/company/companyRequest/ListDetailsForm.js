import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import NumericField from '@components/common/form/NumericField';
import TextField from '@components/common/form/TextField';
import apiConfig from '@constants/apiConfig';
import { Button, Card, Col, Modal, Row } from 'antd';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

const ListDetailsForm = ({ handleAddList, open, onCancel, data, isEditing, id, form, handleEditItemList }) => {
    useEffect(() => {
        if (data) form.setFieldsValue({ ...data });
    }, [data]);
    const handleFinish = (values) => {
        if (isEditing) handleEditItemList({ ...values, index: data?.index });
        else handleAddList(values);
        form.resetFields();
        onCancel();
    };
    const onChange = (id, item) => {
        form.setFieldValue('projectRoleId', item);
    };
    return (
        <Modal
            title={<FormattedMessage defaultMessage="Danh sách yêu cầu" />}
            open={open}
            onCancel={onCancel}
            onOk={() => form.submit()}
        >
            <BaseForm form={form} onFinish={handleFinish} size="100%">
                <Card>
                    <Row gutter={16}>
                        <Col span={12}>
                            <AutoCompleteField
                                name="projectRoleId"
                                label={<FormattedMessage defaultMessage="Vai trò" />}
                                apiConfig={apiConfig.projectRole.autocomplete}
                                mappingOptions={(item) => ({ value: item.id, label: item.projectRoleName })}
                                initialSearchParams={{}}
                                searchParams={(text) => ({ name: text })}
                                required
                                onChange={onChange}
                            />
                        </Col>
                        <Col span={12}>
                            <NumericField
                                label={<FormattedMessage defaultMessage="Số lượng" />}
                                name="amount"
                                required
                                min={1}
                                max={100}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <TextField
                                label={<FormattedMessage defaultMessage="Yêu cầu" />}
                                name="requirement"
                                required
                                type="textarea"
                            />
                        </Col>
                    </Row>
                </Card>
            </BaseForm>
        </Modal>
    );
};

export default ListDetailsForm;
