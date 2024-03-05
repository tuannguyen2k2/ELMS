import { BaseForm } from '@components/common/form/BaseForm';
import NumericField from '@components/common/form/NumericField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { stateCourseRequestOptions, statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
const CourseRequestForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues, isEditing } = props;
    const translate = useTranslate();
    const stateValues = translate.formatKeys(stateCourseRequestOptions, ['label']);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };
    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);
    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField disabled label={<FormattedMessage defaultMessage="Họ và tên" />} name="fullName" />
                    </Col>
                    <Col span={12}>
                        <TextField
                            disabled
                            label={<FormattedMessage defaultMessage="Khoá học" />}
                            name={['course', 'name']}
                        />
                    </Col>
                    <Col span={12}>
                        <NumericField min={0} disabled label={<FormattedMessage defaultMessage="Số điện thoại" />} name="phone" />
                    </Col>
                    <Col span={12}>
                        <TextField disabled label={<FormattedMessage defaultMessage="Email" />} name="email" />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            name="state"
                            defaultValue={stateValues[0]}
                            label={<FormattedMessage defaultMessage="Tình trạng" />}
                            allowClear={false}
                            options={stateValues}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            name="status"
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            allowClear={false}
                            options={statusValues}
                        />
                    </Col>
                </Row>
                <TextField
                    disabled
                    width={'100%'}
                    label={<FormattedMessage defaultMessage="Lời nhắn" />}
                    name="message"
                    type="textarea"
                />
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default CourseRequestForm;
