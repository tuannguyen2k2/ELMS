import React from 'react';
import { generatePath, useLocation, useParams } from 'react-router-dom';
import routes from '@routes';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import TaskSavePage from '@modules/task/TaskSavePage';
import { commonMessage } from '@locales/intl';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';

const messages = defineMessages({
    objectName: 'Task',
});

function TaskStudentSavePage() {
    const translate = useTranslate();
    const location =useLocation();
    const state = location?.state?.prevPath;
    const search = location.search;
    const paramHead = routes.courseStudentListPage.path;
    const paramid = useParams();
    const courseId = paramid.courseId;
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.task.getById,
            create: apiConfig.task.create,
            update: apiConfig.task.update,
        },
        options: {
            getListUrl: generatePath(routes.taskStudentListPage.path, { courseId }),
            objectName: translate.formatMessage(messages.objectName),
        },
    },
    );

    const breadcrumbName= routes.taskSavePage.breadcrumbs(commonMessage,paramHead,state,search,title);
    const getListUrl = generatePath(routes.taskStudentListPage.path, { courseId });

    return (
        <TaskSavePage getListUrl={getListUrl} breadcrumbName={breadcrumbName}/>
    );
}

export default TaskStudentSavePage;
