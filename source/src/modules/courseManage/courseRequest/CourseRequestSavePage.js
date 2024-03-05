import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import routes from './routes';
import { generatePath, useParams } from 'react-router-dom';
import CourseRequestForm from './CourseRequestForm';

const messages = defineMessages({
    objectName: 'Yêu cầu khoá học',
});

const CourseRequestSavePage = () => {
    const courseId = useParams();
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.courseRequest.getById,
            update: apiConfig.courseRequest.update,
        },
        options: {
            getListUrl: generatePath(routes.courseRequestListPage.path, { courseId }),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                };
            };
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(messages.objectName),
                    path: generatePath(routes.courseRequestListPage.path, { courseId }),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CourseRequestForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
};

export default CourseRequestSavePage;
