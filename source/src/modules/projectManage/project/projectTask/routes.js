import apiConfig from '@constants/apiConfig';
import ProjectTaskListPage from '.';
import ProjectTaskSavePage from './ProjectTaskSavePage';
import ProjectTaskLogListPage from './projectTaskLog';
import ProjectTaskLogSavePage from './projectTaskLog/projectTaskLogSavePage';
import MemberActivityProjectListPage from '../member/memberActivity';
export default {
    ProjectTaskListPage: {
        path: '/project/task',
        title: 'Task',
        auth: true,
        component: ProjectTaskListPage,
        permissions: [apiConfig.projectTask.getList.baseURL],
    },
    ProjectTaskSavePage: {
        path: '/project/task/:id',
        title: 'Task Save Page',
        auth: true,
        component: ProjectTaskSavePage,
        permissions: [apiConfig.projectTask.create.baseURL, apiConfig.projectTask.update.baseURL],
    },
    ProjectTaskLogListPage: {
        path: '/project/task/task-log',
        title: 'Task Log List Page',
        auth: true,
        component: ProjectTaskLogListPage,
        permissions: [apiConfig.projectTaskLog.getList.baseURL],
        breadcrumbs: (message, paramHead, taskParam, search, isTaskTab) => {
            return [
                { breadcrumbName: message.project.defaultMessage, path: paramHead },
                {
                    breadcrumbName: isTaskTab ? message.generalManage.defaultMessage : message.task.defaultMessage,
                    path: taskParam + search,
                },
                { breadcrumbName: message.taskLog.defaultMessage },
            ];
        },
    },
    ProjectTaskLogSavePage: {
        path: '/project/task/task-log/:id',
        title: 'Task Log Save Page',
        auth: true,
        component: ProjectTaskLogSavePage,
        permissions: [apiConfig.projectTaskLog.create.baseURL, apiConfig.projectTaskLog.update.baseURL],
        breadcrumbs: (message, paramHead, taskParam, taskLogParam, search, title, isTaskTab) => {
            return [
                { breadcrumbName: message.project.defaultMessage, path: paramHead },
                { breadcrumbName: isTaskTab ? message.generalManage.defaultMessage : message.task.defaultMessage, path: taskParam + search },
                { breadcrumbName: message.taskLog.defaultMessage, path: taskLogParam + search },
                { breadcrumbName: title },
            ];
        },
    },
    memberActivityProjectListPage: {
        path: '/project/member/member-activity-project',
        title: 'Member Activity Project List Page',
        auth: true,
        component: MemberActivityProjectListPage,
        permissions: [apiConfig.projectTaskLog.getList.baseURL],
    },
    memberActivityProjectLeaderListPage: {
        path: '/project-leader/member/member-activity-project',
        title: 'Member Activity Project Leader List Page',
        auth: true,
        component: MemberActivityProjectListPage,
        permissions: [apiConfig.projectTaskLog.getList.baseURL],
    },
};
