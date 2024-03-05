import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import CourseStudentForm from './CourseStudentForm';
import routes from '@routes';
import { generatePath, useParams } from 'react-router-dom';
import { showErrorMessage } from '@services/notifyService';
import { commonMessage } from '@locales/intl';
import useFetch from '@hooks/useFetch';

const messages = defineMessages({
    objectName: 'khoá học',
});

const CourseStudentSavePage = () => {
    const courseId = useParams();
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.course.getById,
            create: apiConfig.course.create,
            update: apiConfig.course.update,
        },
        options: {
            getListUrl: generatePath(routes.courseStudentListPage.path, { courseId }),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };
            funcs.onSaveError = (err) => {
                if (err.code === 'ERROR-COURSE-ERROR-0001') {
                    showErrorMessage('Khoá học đã tồn tại');
                } else {
                    mixinFuncs.handleShowErrorMessage(err, showErrorMessage);
                }
                mixinFuncs.setSubmit(false);
            };
        },
    });

    // const { execute: executeUpdateLeader } = useFetch(apiConfig.course.updateLeaderCourse, { immediate: false });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.course),
                    path: generatePath(routes.courseStudentListPage.path, { courseId }),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CourseStudentForm
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

export default CourseStudentSavePage;
