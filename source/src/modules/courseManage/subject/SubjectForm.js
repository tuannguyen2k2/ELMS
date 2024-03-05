import { BaseForm } from '@components/common/form/BaseForm';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { statusOptions, statusSubjectOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { Card, Col, Form, Row } from 'antd';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

const SubjectForm = (props) => {
    const translate = useTranslate();
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues, isEditing } = props;
    const statusValue = translate.formatKeys(statusOptions, ['label']);
    //const statusSubject = translate.formatKeys(statusSubjectOptions, ['label']);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        if (!values.status) {
            values.status = 0;
        }
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
                status: statusValue[1].value,
            });
        }
    }, [isEditing]);

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField
                            label={<FormattedMessage defaultMessage="Tên môn học" />}
                            required
                            name="subjectName"
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            required
                            label={<FormattedMessage defaultMessage="Mã môn học" />}
                            name="subjectCode"
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            name="status"
                            options={statusValue}
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default SubjectForm;
