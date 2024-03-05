import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { Card, Col, Row, DatePicker } from 'antd';
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
import { AppConstants } from '@constants';
import { statusOptions } from '@constants/masterData';
import SelectField from '@components/common/form/SelectField';

const ProjectCategoryForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues, isEditing, projectId } = props;
    const translate = useTranslate();
    const [imageUrl, setImageUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const {
        data: leaders,
        loading: getleadersLoading,
        execute: executesleaders,
    } = useFetch(apiConfig.leader.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.leaderName })),
    });

    const {
        data: projects,
        loading: getsprojectLoading,
        execute: executesprojects,
    } = useFetch(apiConfig.project.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.name })),
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
        return mixinFuncs.handleSubmit({ ...values, avatar: imageUrl });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            leaderId: dataDetail?.leaderInfo?.leaderName,
        });
        setImageUrl(dataDetail.avatar);
    }, [dataDetail]);

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
                projectId: projectId,
            });
        }
    }, [isEditing]);

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                {/* <Row gutter={16}>
                    <Col span={12}>
                        <CropImageField
                            label={<FormattedMessage defaultMessage="Logo nhóm" />}
                            name="avatar"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row> */}
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={<FormattedMessage defaultMessage="Tên danh mục" />}
                            required
                            name="projectCategoryName"
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Status" />}
                            name="status"
                            options={statusValues}
                        />
                    </Col>
                </Row>

                <TextField
                    disabled={dataDetail.state >= 3}
                    width={'100%'}
                    label={<FormattedMessage defaultMessage="Mô tả" />}
                    name="description"
                    type="textarea"
                />
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default ProjectCategoryForm;
