import apiConfig from '@constants/apiConfig';
import LeaderListPage from '.';
import LeaderSavePage from './leaderSavePage';
import ProjectListPage from '@modules/projectManage/project';
import CourseListPage from '@modules/courseManage/course';
import TaskListPage from '@modules/task';
import ProjectTaskListPage from '@modules/projectManage/project/projectTask';
import TeamListPage from '@modules/projectManage/project/team';

export default {
    leaderListPage: {
        path: '/leader',
        title: 'Leader',
        auth: true,
        component: LeaderListPage,
        permissions: [apiConfig.leader.getList.baseURL],
    },
    leaderSavePage: {
        path: '/leader/:id',
        title: 'Leader Save Page',
        auth: true,
        component: LeaderSavePage,
        permissions: [apiConfig.leader.create.baseURL, apiConfig.leader.update.baseURL],
    },
    leaderCourseListPage: {
        path: '/leader/course',
        title: 'Leader',
        auth: true,
        component: CourseListPage,
        permissions: [apiConfig.course.getList.baseURL],
    },
    leaderProjectListPage: {
        path: '/leader/project',
        title: 'Leader Project Page',
        auth: true,
        component: ProjectListPage,
        permissions: [apiConfig.project.getList.baseURL],
    },
    leaderProjectTaskListPage: {
        path: '/leader/project/task',
        title: 'Leader Project Task Page',
        auth: true,
        component: ProjectTaskListPage,
        permissions: [apiConfig.projectTask.getList.baseURL],
    },
    learderProjectTeamListPage: {
        path: '/leader/project/team',
        title: 'Leader Project Team Page',
        auth: true,
        component: TeamListPage,
        permissions: [apiConfig.team.getList.baseURL],
    },
    leaderCourseTaskListPage: {
        path: '/leader/course/task',
        title: 'Leader Project Task Page',
        auth: true,
        component: TaskListPage,
        permissions: [apiConfig.task.getList.baseURL],
    },
};
