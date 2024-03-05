import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useLocation, useParams } from 'react-router-dom';
import routes from '@routes';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';
import ProjectTaskLogSavePage from '@modules/projectManage/project/projectTask/projectTaskLog/projectTaskLogSavePage';

const messages = defineMessages({
    objectName: 'Nhật ký',
});

function MyProjectStudentTaskLogSavePage() {
    const translate = useTranslate();
    const location = useLocation();
    const state = location.state.prevPath;
    const search = location.search;
    const paramHead = routes.projectStudentMyTaskListPage.path;
    const taskParam = routes.myProjectStudentTaskLogPage.path;
    const taskLogParam = routes.myProjectStudentTaskLogPage.path;
    const taskLogId = useParams();
    const getListUrl = generatePath(routes.myProjectStudentTaskLogPage.path, { taskLogId });
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.projectTaskLog.getById,
            create: apiConfig.projectTaskLog.create,
            update: apiConfig.projectTaskLog.update,
        },
        options: {
            getListUrl: generatePath(routes.myProjectStudentTaskLogPage.path, { taskLogId }),
            objectName: translate.formatMessage(messages.objectName),
        },
    });
    const breadcrumbName = routes.myProjectStudentTaskLogSavePage.breadcrumbs(
        commonMessage,
        paramHead,
        taskParam,
        taskLogParam,
        search,
        title,
    );

    return <ProjectTaskLogSavePage getListUrl={getListUrl} breadcrumbName={breadcrumbName} />;
}

export default MyProjectStudentTaskLogSavePage;
