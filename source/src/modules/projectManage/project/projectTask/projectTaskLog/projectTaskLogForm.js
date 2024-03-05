import { BaseForm } from '@components/common/form/BaseForm';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { TaskLogKindOptions,statusOptions } from '@constants/masterData';
import NumericField from '@components/common/form/NumericField';

const ProjectTaskLogForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues,isEditing } = props;
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectTaskId = queryParameters.get('projectTaskId');
    const taskName = queryParameters.get('task');
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const KindTaskLog = translate.formatKeys(TaskLogKindOptions, ['label']);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        values.status =  statusValues[1].value;
        values.projectTaskId = projectTaskId;
        return mixinFuncs.handleSubmit({ ...values });
    };
    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            task: taskName,
        });
    }, [dataDetail]);

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                kind: KindTaskLog[0].value,
                projectTaskId: projectTaskId,
                task: taskName,
            });
        }
    }, [isEditing]);
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={24}>
                        <TextField
                            label={<FormattedMessage defaultMessage="Task" />}
                            name="task"
                            disabled
                            required
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <SelectField
                            required
                            name="kind"
                            label={<FormattedMessage defaultMessage="Tình trạng" />}
                            allowClear={false}
                            options={KindTaskLog}
                        />
                    </Col>
                    <Col span={12}>
                        <NumericField
                            label={<FormattedMessage defaultMessage="Tổng thời gian" />}
                            name="totalTime"
                            type="number"
                            min={0}
                            addonAfter={<FormattedMessage defaultMessage="Phút" />}
                            required
                        />
                    </Col>
                    <Col span={24}>
                        <TextField
                            label={<FormattedMessage defaultMessage="Đường dẫn commit git" />}
                            name="gitCommitUrl"
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span ={24}>
                        <TextField
                            label={<FormattedMessage defaultMessage="Lời nhắn" />}
                            name="message"
                            required
                            type="textarea"
                        />
                    </Col>       
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default ProjectTaskLogForm;
