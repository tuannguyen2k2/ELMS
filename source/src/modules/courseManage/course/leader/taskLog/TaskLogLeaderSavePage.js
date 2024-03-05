import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useLocation, useParams } from 'react-router-dom';
import routes from '@routes';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';
import TaskLogSavePage from '@modules/task/taskLog/TaskLogSavePage';
const messages = defineMessages({
    objectName: 'Nhật ký',
});

function TaskLogLeaderSavePage() {
    const translate = useTranslate();
    const location = useLocation();
    const state = location.state.prevPath;
    const search = location.search;
    const paramHead = routes.courseLeaderListPage.path;
    const params = useParams();
    const courseId = params.courseId;
    const taskParam = generatePath(routes.taskLeaderListPage.path, { courseId });

    const getListUrl = generatePath(routes.taskLogLeaderListPage.path, { courseId });
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.taskLog.getById,
            create: apiConfig.taskLog.create,
            update: apiConfig.taskLog.update,
        },
        options: {
            getListUrl: generatePath(routes.taskLogLeaderListPage.path, { courseId }),
            objectName: translate.formatMessage(messages.objectName),
        },
    },
    );
    const breadcrumbName= routes.taskLogSavePage.breadcrumbs(commonMessage,paramHead,taskParam,state,search,title);
    return (
        <TaskLogSavePage getListUrl={getListUrl} breadcrumbName={breadcrumbName} />
    );
}

export default TaskLogLeaderSavePage;
