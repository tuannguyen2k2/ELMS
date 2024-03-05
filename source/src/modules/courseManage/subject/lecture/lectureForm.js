import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { FormattedMessage, defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import SelectField from '@components/common/form/SelectField';
import { lectureKindOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectedRowKeySelector } from '@selectors/app';
import { commonMessage } from '@locales/intl';
import RichTextField from '@components/common/form/RichTextField';

const message = defineMessages({
    description: 'Mô tả chi tiết',
    lectureKind: 'Loại bài giảng',
    shortDescription: 'Mô tả Ngắn',
    urlDocument: 'Đường dẫn tài liệu',
    subjectId: 'Mã Môn học',
});

const LectureForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues, subjectId }) => {
    const translate = useTranslate();
    const lectureKindValues = translate.formatKeys(lectureKindOptions, ['label']);
    const selectedRowKey = useSelector(selectedRowKeySelector);
    const { execute: executeOrdering } = useFetch(apiConfig.lecture.updateSort);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const { data } = useFetch(apiConfig.lecture.getBySubject, {
        immediate: true,
        pathParams: { subjectId: subjectId },
    });

    const dataLectureBySubject = data?.data?.content;
    const dataSort = dataLectureBySubject && dataLectureBySubject.sort((a, b) => a.ordering - b.ordering);

    const handleSubmit = (values) => {
        if (dataLectureBySubject) {
            let isSelectedRowKey = false;
            dataLectureBySubject.map((item) => {
                if (item.id == selectedRowKey) {
                    isSelectedRowKey = true;
                } else if (isSelectedRowKey == true) {
                    if (item.lectureKind == 1) {
                        values.ordering = item.ordering;
                        isSelectedRowKey = false;
                    }
                }
            });
            let dataUpdate = [];
            if (values.ordering) {
                const indexLecture = dataSort.findIndex((item) => item.ordering == values.ordering);
                for (let i = indexLecture; i < dataSort.length; i++) {
                    dataUpdate.push({ id: dataSort[i].id, ordering: dataSort[i].ordering + 1 });
                }
                executeOrdering({
                    data: dataUpdate,
                });
            }
            if (values.ordering === undefined) {
                values.ordering = dataDetail?.ordering || dataSort[dataSort.length - 1].ordering + 1;
            }
        }
        values.subjectId = subjectId;
        values.status = 1;
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        dataDetail.status = 1;
        dataDetail.subjectId = subjectId;
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.lectureName)}
                            required
                            name="lectureName"
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            name="lectureKind"
                            label={translate.formatMessage(message.lectureKind)}
                            allowClear={false}
                            options={lectureKindValues}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <TextField name="urlDocument" label={translate.formatMessage(message.urlDocument)} />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <RichTextField
                            label={translate.formatMessage(message.description)}
                            labelAlign="left"
                            name="description"
                            style={{
                                height: 300,
                                marginBottom: 70,
                            }}
                            required
                            baseURL={AppConstants.contentRootUrl}
                            setIsChangedFormValues={setIsChangedFormValues}
                            form={form}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <TextField
                            label={translate.formatMessage(message.shortDescription)}
                            name="shortDescription"
                            type="textarea"
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <RichTextField
                            label={translate.formatMessage(commonMessage.leaderGuide)}
                            labelAlign="left"
                            name="leaderGuide"
                            style={{
                                height: 300,
                                marginBottom: 70,
                            }}
                            required
                            baseURL={AppConstants.contentRootUrl}
                            setIsChangedFormValues={setIsChangedFormValues}
                            form={form}
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default LectureForm;
