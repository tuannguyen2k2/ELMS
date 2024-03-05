import apiConfig from '@constants/apiConfig';
import ProjectRoleListPage from '.';
import ProjectRoleSavePage from './projectRoleSavePage';

export default {
    projectRoleListPage: {
        path: '/projectRole',
        title: 'Project Role',
        auth: true,
        component: ProjectRoleListPage,
        permissions: [apiConfig.projectRole.getList.baseURL],
    },
    projectRoleSavePage: {
        path: '/projectRole/:id',
        title: 'Project Role Save Page',
        auth: true,
        component: ProjectRoleSavePage,
        permissions: [apiConfig.projectRole.create.baseURL, apiConfig.projectRole.update.baseURL],
    },
};
