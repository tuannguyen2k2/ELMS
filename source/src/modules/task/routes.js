import apiConfig from '@constants/apiConfig';
import TaskListPage from '.';
import TaskSavePage from './TaskSavePage';
import TaskLogListPage from './taskLog';
import TaskLogSavePage from './taskLog/TaskLogSavePage';
export default {
    taskListPage: {
        path: '/course/task',
        title: 'Task',
        auth: true,
        component: TaskListPage,
        permissions: [apiConfig.task.getList.baseURL],
    },
    taskSavePage: {
        path: '/course/task/:id',
        title: 'Task Save Page',
        auth: true,
        component: TaskSavePage,
        permissions: [apiConfig.task.create.baseURL, apiConfig.task.update.baseURL],
        breadcrumbs: (message, paramHead, taskParam, location, title) => {
            return [
                { breadcrumbName: message.course.defaultMessage, path: paramHead },
                { breadcrumbName: message.task.defaultMessage, path: taskParam + location },
                { breadcrumbName: title ? title : message.objectName.defaultMessage },
            ];
        },
    },
    taskLogListPage: {
        path: '/course/task/task-log',
        title: 'Task Log Save Page',
        auth: true,
        component: TaskLogListPage,
        permissions: [apiConfig.taskLog.getList.baseURL],
        breadcrumbs: (message, paramHead, state, location, isProject) => {
            return [
                {
                    breadcrumbName: isProject ? message.project.defaultMessage : message.course.defaultMessage,
                    path: paramHead,
                },
                { breadcrumbName: message.task.defaultMessage, path: state + location },
                { breadcrumbName: message.taskLog.defaultMessage },
            ];
        },
    },
    taskLogSavePage: {
        path: '/course/task/task-log/:id',
        title: 'Task Log Save Page',
        auth: true,
        component: TaskLogSavePage,
        permissions: [apiConfig.taskLog.create.baseURL, apiConfig.taskLog.update.baseURL],
        breadcrumbs: (message, paramHead, taskParam, state, search, title, isProject) => {
            return [
                {
                    breadcrumbName: isProject ? message.project.defaultMessage : message.course.defaultMessage,
                    path: paramHead,
                },
                { breadcrumbName: message.task.defaultMessage, path: taskParam + search },
                { breadcrumbName: message.taskLog.defaultMessage, path: state + search },
                { breadcrumbName: title },
            ];
        },
    },
};
