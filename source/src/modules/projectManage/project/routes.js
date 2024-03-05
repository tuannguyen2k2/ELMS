import apiConfig from '@constants/apiConfig';
import ProjectListPage from '.';
import ProjectSavePage from './projectSavePage';
import ProjectMemberListPage from './member';
import ProjectMemberSavePage from './member/ProjectMemberSavePage';
import ProjectLeaderListPage from './projectLeader';
import TeamListPage from './team';
import TeamSavePage from './team/TeamSavePage';
import ProjectLeaderMemberListPage from './projectLeader/projectLeaderMember';
import ProjectLeaderTaskListPage from './projectLeader/projectLeaderTask';
import ProjectLeaderTeamListPage from './projectLeader/projectLeaderGroup';
import ProjectStudentListPage from './projectStudent';
import ProjectStudentTaskListPage from './projectStudent/projectStudentTask';
import ProjectStudentMemberListPage from './projectStudent/projectStudentMember';
import projectLeaderTaskLogListPage from './projectLeader/projectLeaderTaskLog';
import ProjectLeaderSavePage from './projectLeader/projectLeaderSavePage';
import ProjectLeaderTaskSavePage from './projectLeader/projectLeaderTask/ProjectLeaderTaskSavePage';
import ProjectLeaderMemberForm from './projectLeader/projectLeaderMember/ProjectLeaderMemberForm';
import ProjectLeaderMemberSavePage from './projectLeader/projectLeaderMember/ProjectLeaderMemberSavePage';
import ProjectLeaderTeamSavePage from './projectLeader/projectLeaderGroup/ProjectLeaderTeamSavePage';
import ProjectStudentMyTaskListPage from './projectStudent/myTask';
import ProjectLeaderTaskLogSavePage from './projectLeader/projectLeaderTaskLog/ProjectLeaderTaskLogSavePage';
import ProjectStudentTeamListPage from './projectStudent/projectStudentGroup';
import projectStudentTaskLogListPage from './projectStudent/projectStudentTaskLog';
import ProjectStudentTaskLogSavePage from './projectStudent/projectStudentTaskLog/ProjectStudentTaskLogSavePage';
import ProjectStudentSavePage from './projectStudent/projectStudentSavePage';
import ProjectStudentTaskSavePage from './projectStudent/projectStudentTask/ProjectStudentTaskSavePage';
import ProjectStudentMemberSavePage from './projectStudent/projectStudentMember/ProjectStudentMemberSavePage';
import ProjectStudentTeamSavePage from './projectStudent/projectStudentGroup/ProjectStudentTeamSavePage';
import MyTaskLogSavePage from './projectStudent/myTask/tasklog/ProjectStudentTaskLogSavePage';
import MyProjectStudentTaskLogListPage from './projectStudent/myTask/tasklog';
import ProjectCategoryListPage from './projectCategory';
import ProjectCategorySavePage from './projectCategory/ProjectCategorySavePage';
import ProjectCategoryLeaderListPage from './projectLeader/projectCategory';
import ProjectCategoryLeaderSavePage from './projectLeader/projectCategory/ProjectCategorySavePage';
import ProjectCategoryStudentListPage from './projectStudent/projectCategory';
import ProjectCategoryStudentSavePage from './projectStudent/projectCategory/ProjectCategorySavePage';
import ProjectTabPage from './ProjectTabPage';
export default {
    projectListPage: {
        path: '/project',
        title: 'Project',
        auth: true,
        component: ProjectListPage,
        permissions: [apiConfig.project.getList.baseURL],
    },
    projectTabPage: {
        path: '/project/project-tab',
        title: 'Project Tab',
        auth: true,
        component: ProjectTabPage,
        keyActiveTab: 'activeProjectTab',
        permissions: [apiConfig.project.getList.baseURL],
    },
    projectSavePage: {
        path: '/project/:id',
        title: 'Project Save Page',
        auth: true,
        component: ProjectSavePage,
        permissions: [apiConfig.project.create.baseURL, apiConfig.project.update.baseURL],
    },
    projectMemberListPage: {
        path: '/project/member',
        title: 'Project Member',
        auth: true,
        component: ProjectMemberListPage,
        permissions: [apiConfig.memberProject.getList.baseURL],
    },
    projectMemberSavePage: {
        path: '/project/member/:id',
        title: 'Project Save Page',
        auth: true,
        component: ProjectMemberSavePage,
        permissions: [apiConfig.memberProject.create.baseURL, apiConfig.memberProject.update.baseURL],
    },
    projectLeaderListPage: {
        path: '/project-leader',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderListPage,
        permissions: [apiConfig.project.getListLeader.baseURL],
    },
    projectLeaderSavePage: {
        path: '/project-leader/:id',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderSavePage,
        permissions: [apiConfig.project.create.baseURL, apiConfig.project.update.baseURL],
    },
    projectLeaderMemberListPage: {
        path: '/project-leader/member',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderMemberListPage,
        permissions: [apiConfig.project.getListLeader.baseURL],
    },
    projectLeaderMemberSavePage: {
        path: '/project-leader/member/:id',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderMemberSavePage,
        permissions: [apiConfig.project.create.baseURL, apiConfig.project.update.baseURL],
    },
    projectLeaderTaskListPage: {
        path: '/project-leader/task',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderTaskListPage,
        permissions: [apiConfig.project.getListLeader.baseURL],
    },
    projectLeaderTaskSavePage: {
        path: '/project-leader/task/:id',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderTaskSavePage,
        permissions: [apiConfig.project.create.baseURL, apiConfig.project.update.baseURL],
    },
    projectLeaderTeamListPage: {
        path: '/project-leader/team',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderTeamListPage,
        permissions: [apiConfig.project.getListLeader.baseURL],
    },
    projectLeaderTeamSavePage: {
        path: '/project-leader/team/:id',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderTeamSavePage,
        permissions: [apiConfig.project.create.baseURL, apiConfig.project.update.baseURL],
    },
    teamListPage: {
        path: '/project/team',
        title: 'Team List Page',
        auth: true,
        component: TeamListPage,
        permissions: [apiConfig.team.getList.baseURL],
    },
    teamSavePage: {
        path: '/project/team/:id',
        title: 'Team Save Page',
        auth: true,
        component: TeamSavePage,
        permissions: [apiConfig.team.create.baseURL, apiConfig.team.update.baseURL],
    },
    projectStudentListPage: {
        path: '/project-student',
        title: 'Project Student Page',
        auth: true,
        component: ProjectStudentListPage,
        permissions: [apiConfig.project.getListStudent.baseURL],
    },
    projectStudentSavePage: {
        path: '/project-student/:id',
        title: 'Project Student Page',
        auth: true,
        component: ProjectStudentSavePage,
        permissions: [apiConfig.project.create.baseURL, apiConfig.project.update.baseURL],
    },
    projectStudentTaskListPage: {
        path: '/project-student/task',
        title: 'Project Student Task Page',
        auth: true,
        component: ProjectStudentTaskListPage,
        permissions: [apiConfig.projectTask.getList.baseURL],
    },
    projectStudentTaskSaveListPage: {
        path: '/project-student/task/:id',
        title: 'Project Student Task Save Page',
        auth: true,
        component: ProjectStudentTaskSavePage,
        permissions: [apiConfig.projectTask.create.baseURL, apiConfig.projectTask.update.baseURL],
    },
    projectStudentMemberListPage: {
        path: '/project-student/member',
        title: 'Project Student Task Page',
        auth: true,
        component: ProjectStudentMemberListPage,
        permissions: [apiConfig.memberProject.getList.baseURL],
    },
    projectStudentMemberSavePage: {
        path: '/project-student/member/:id',
        title: 'Project Member Student Save Page',
        auth: true,
        component: ProjectStudentMemberSavePage,
        // permissions: [apiConfig.memberProject.create.baseURL, apiConfig.memberProject.update.baseURL],
    },
    projectLeaderTaskLogListPage: {
        path: '/project-leader/task/task-log',
        title: 'Project Leader Page',
        auth: true,
        component: projectLeaderTaskLogListPage,
        permissions: [apiConfig.projectTaskLog.getList.baseURL],
    },
    projectLeaderTaskLogSavePage: {
        path: '/project-leader/task/task-log/:id',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectLeaderTaskLogSavePage,
        permissions: [apiConfig.projectTaskLog.create.baseURL, apiConfig.projectTaskLog.update.baseURL],
    },
    projectStudentMyTaskListPage: {
        path: '/my-project-task',
        title: 'Project Student Task Page',
        auth: true,
        component: ProjectStudentMyTaskListPage,
        permissions: [apiConfig.projectTask.getList.baseURL],
    },
    myProjectStudentTaskLogPage: {
        path: '/my-project-task/taskLog',
        title: 'Task log',
        auth: true,
        component: MyProjectStudentTaskLogListPage,
        permissions: [apiConfig.projectTaskLog.getList.baseURL],
        breadcrumbs: (message, paramHead, taskParam, taskLogParam, search, title) => {
            return [
                { breadcrumbName: message.myproject.defaultMessage, path: paramHead },
                { breadcrumbName: message.taskLog.defaultMessage },
            ];
        },
    },
    myProjectStudentTaskLogSavePage: {
        path: '/my-project-task/taskLog/:id',
        title: 'Task Log Save Page',
        auth: true,
        component: MyTaskLogSavePage,
        permissions: [apiConfig.projectTaskLog.create.baseURL, apiConfig.projectTaskLog.update.baseURL],
        breadcrumbs: (message, paramHead, taskParam, taskLogParam, search, title) => {
            return [
                { breadcrumbName: message.myproject.defaultMessage, path: paramHead },
                // { breadcrumbName: message.task.defaultMessage, path: taskParam + search },
                { breadcrumbName: message.taskLog.defaultMessage, path: taskLogParam + search },
                { breadcrumbName: title },
            ];
        },
    },
    projectStudentTeamListPage: {
        path: '/project-student/team',
        title: 'Project Leader Page',
        auth: true,
        component: ProjectStudentTeamListPage,
        permissions: [apiConfig.team.getList.baseURL],
    },
    projectStudentTeamSavePage: {
        path: '/project-student/team/:id',
        title: 'Project Student Save Page',
        auth: true,
        component: ProjectStudentTeamSavePage,
        permissions: [apiConfig.team.create.baseURL, apiConfig.team.update.baseURL],
    },
    projectStudentTaskLogListPage: {
        path: '/project-student/task/task-log',
        title: 'Project Student Page',
        auth: true,
        component: projectStudentTaskLogListPage,
        permissions: [apiConfig.projectTaskLog.getList.baseURL],
    },
    projectStudentTaskLogSavePage: {
        path: '/project-student/task/task-log/:id',
        title: 'Project Student Page',
        auth: true,
        component: ProjectStudentTaskLogSavePage,
        permissions: [apiConfig.projectTaskLog.create.baseURL, apiConfig.projectTaskLog.update.baseURL],
    },
    projectCategoryListPage: {
        path: '/project/project-category',
        title: 'Project category Page',
        auth: true,
        component: ProjectCategoryListPage,
        permissions: [apiConfig.projectCategory.getList.baseURL],
    },
    projectCategorySavePage: {
        path: '/project/project-category/:id',
        title: 'Project category Page',
        auth: true,
        component: ProjectCategorySavePage,
        permissions: [apiConfig.projectCategory.create.baseURL, apiConfig.projectCategory.update.baseURL],
    },
    projectCategoryLeaderListPage: {
        path: '/project-leader/project-category',
        title: 'project category leader Page',
        auth: true,
        component: ProjectCategoryLeaderListPage,
        permissions: [apiConfig.projectCategory.getList.baseURL],
    },
    projectCategoryLeaderSavePage: {
        path: '/project-leader/project-category/:id',
        title: 'Project category leader Page',
        auth: true,
        component: ProjectCategoryLeaderSavePage,
        permissions: [apiConfig.projectCategory.create.baseURL, apiConfig.projectCategory.update.baseURL],
    },
    projectCategoryStudentListPage: {
        path: '/project-student/project-category',
        title: 'project category student Page',
        auth: true,
        component: ProjectCategoryStudentListPage,
        permissions: [apiConfig.projectCategory.getList.baseURL],
    },
    projectCategoryStudentSavePage: {
        path: '/project-student/project-category/:id',
        title: 'Project category student Page',
        auth: true,
        component: ProjectCategoryStudentSavePage,
        permissions: [apiConfig.projectCategory.create.baseURL, apiConfig.projectCategory.update.baseURL],
    },
};
