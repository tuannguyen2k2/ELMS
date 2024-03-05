import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useLocation, useParams } from 'react-router-dom';
import routes from '@routes';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';
import ActivityCourseStudentForm from './ActivityCourseStudentForm';

const messages = defineMessages({
    objectName: 'Nhật ký',
});

function ActivityCourseStudentSavePage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.taskLog.getById,
            create: apiConfig.taskLog.create,
            update: apiConfig.taskLog.update,
        },
        options: {
            getListUrl: generatePath(routes.myActivityCourseStudentListPage.path, { courseId }),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    status: 1,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.myActivity),
                    path: routes.myActivityCourseStudentListPage.path,
                },
                { breadcrumbName: title },
            ]}
        >
            <ActivityCourseStudentForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
}

export default ActivityCourseStudentSavePage;
