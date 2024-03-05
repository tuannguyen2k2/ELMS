import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useLocation, useParams } from 'react-router-dom';
import routes from '@routes';
import TaskLogForm from './TaskLogForm';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';

const messages = defineMessages({
    objectName: 'Nhật ký',
});

function TaskLogSavePage({ getListUrl,breadcrumbName }) {
    const translate = useTranslate();
    const location = useLocation();
    const state = location.state.prevPath;
    const search = location.search;
    const paramHead = routes.courseListPage.path;
    const taskParam = routes.taskListPage.path;
    const taskLogId = useParams();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.taskLog.getById,
            create: apiConfig.taskLog.create,
            update: apiConfig.taskLog.update,
        },
        options: {
            getListUrl: getListUrl ? getListUrl :generatePath(routes.taskLogListPage.path, { taskLogId }),
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
            routes={
                breadcrumbName?breadcrumbName:
                    routes.taskLogSavePage.breadcrumbs(commonMessage,paramHead,taskParam,state,search,title)
            }
        >
            <TaskLogForm
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

export default TaskLogSavePage;
