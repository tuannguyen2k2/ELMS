import apiConfig from '@constants/apiConfig';
import DeveloperSavePage from './DeveloperSavePage';
import DeveloperListPage from '.';
import ProjectListPage from '@modules/projectManage/project';
import ProjectTaskListPage from '@modules/projectManage/project/projectTask';
import TeamListPage from '@modules/projectManage/project/team';

export default {
    developerListPage: {
        path: '/developer',
        title: 'Developer',
        auth: true,
        component: DeveloperListPage,
        permissions: [apiConfig.developer.getList.baseURL],
    },
    developerSavePage: {
        path: '/developer/:id',
        title: 'Developer Save Page',
        auth: true,
        component: DeveloperSavePage,
        permissions: [apiConfig.developer.create.baseURL, apiConfig.developer.update.baseURL],
    },
    developerProjectListPage: {
        path: '/developer/project',
        title: 'Developer',
        auth: true,
        component: ProjectListPage,
        permissions: [apiConfig.project.getList.baseURL],
    },
    developerProjectTeamListPage: {
        path: '/developer/project/team',
        title: 'Developer Team',
        auth: true,
        component: TeamListPage,
        permissions: [apiConfig.team.getList.baseURL],
    },
    developerProjectTaskListPage: {
        path: '/developer/project/task',
        title: 'Developer',
        auth: true,
        component: ProjectTaskListPage,
        permissions: [apiConfig.projectTask.getList.baseURL],
    },
};
