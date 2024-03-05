import apiConfig from '@constants/apiConfig';
import CourseListPage from '.';
import CourseSavePage from './CourseSavePage';
import LectureListPage from './lecture';
import CourseLeaderListPage from './leader/courseLeader';
import TaskListPage from './leader/taskLeader';
import TaskLeaderSavePage from './leader/taskLeader/TaskSavePage';
import AsignAllListPage from './leader/asignAll';
import CourseStudentListPage from './student/courseStudent';
import TaskStudentListPage from './student/taskStudent';
import RegistrationLeaderListPage from './leader/registrationLeader';
import TaskLogLeaderSavePage from './leader/taskLog/TaskLogLeaderSavePage';
import MyTaskStudentListPage from './student/myTask';
import routes from '@routes';
import TaskLogLeaderListPage from './leader/taskLog';
import RegistrationStudentListPage from './student/registrationStudent';
import MyActivityCourseListPage from './student/activityCourseStudent';
import MyActivityProjectListPage from './student/activityProjectStudent';
import TaskLogStudentListPage from './student/taskLog';
import TaskLogStudentSavePage from './student/taskLog/TaskLogStudentSavePage';
import TaskStudentSavePage from './student/taskStudent/TaskSavePage';
import RegistrationStudentSavePage from './student/registrationStudent/RegistrationSavePage';
import AsignAllStudentListPage from './student/asignAll';
import CourseStudentSavePage from './student/courseStudent/CourseStudentSavePage';
import ActivityProjectStudentSavePage from './student/activityProjectStudent/ActivityProjectStudentSavePage';
import ActivityCourseStudentSavePage from './student/activityCourseStudent/ActivityCourseStudentSavePage';
import MyTaskLogStudentListPage from './student/myTask/taskLog';
import TaskLogMyStudentSavePage from './student/myTask/taskLog/TaskLogStudentSavePage';
export default {
    courseListPage: {
        path: '/course',
        title: 'Course List Page',
        auth: true,
        component: CourseListPage,
        permissions: [apiConfig.course.getList.baseURL],
    },
    courseLeaderListPage: {
        path: '/course-leader',
        title: 'Course List Page',
        auth: true,
        component: CourseLeaderListPage,
        permissions: [apiConfig.course.getListLeaderCourse.baseURL],
    },
    courseSavePage: {
        path: '/course/:id',
        title: 'Course Save Page',
        auth: true,
        component: CourseSavePage,
        permissions: [apiConfig.course.create.baseURL, apiConfig.course.update.baseURL],
    },
    lectureTaskListPage: {
        path: '/course/task/lecture',
        title: 'Lecture List Page',
        auth: true,
        component: LectureListPage,
        permissions: [apiConfig.lecture.getBySubject.baseURL],
        breadcrumbs: (message, paramHead, state, location) => {
            return [
                { breadcrumbName: message.course.defaultMessage, path: paramHead },
                { breadcrumbName: message.task.defaultMessage, path: state + location },
                { breadcrumbName: message.objectName.defaultMessage },
            ];
        },
    },

    taskLeaderListPage: {
        path: '/course-leader/task/:courseId',
        title: 'Task List Page',
        auth: true,
        component: TaskListPage,
        permissions: [apiConfig.task.courseTask.baseURL],
    },
    taskLeaderSavePage: {
        path: '/course-leader/task/:courseId/:id',
        title: 'Task Save Page',
        auth: true,
        component: TaskLeaderSavePage,
        permissions: [apiConfig.task.create.baseURL, apiConfig.task.update.baseURL],
    },
    lectureTaskLeaderListPage: {
        path: '/course-leader/task/:courseId/lecture',
        title: 'Lecture Leader List Page',
        auth: true,
        component: AsignAllListPage,
        permissions: [apiConfig.lecture.getBySubject.baseURL],
    },
    registrationLeaderListPage: {
        path: '/course-leader/registration',
        title: 'Registration',
        auth: true,
        component: RegistrationLeaderListPage,
        permissions: [apiConfig.registration.getList.baseURL],
    },

    taskLogLeaderListPage: {
        path: '/course-leader/task/:courseId/task-log',
        title: 'Task Log Leader List Page',
        auth: true,
        component: TaskLogLeaderListPage,
        permissions: [apiConfig.taskLog.getList.baseURL],
    },
    taskLogLeaderSavePage: {
        path: '/course-leader/task/:courseId/task-log/:id',
        title: 'Task Log Leader Save Page',
        auth: true,
        component: TaskLogLeaderSavePage,
        permissions: [apiConfig.taskLog.create.baseURL, apiConfig.taskLog.update.baseURL],
    },
    // STUDENT
    courseStudentListPage: {
        path: '/course-student',
        title: 'Course Student List Page',
        auth: true,
        component: CourseStudentListPage,
        permissions: [apiConfig.course.getListStudentCourse.baseURL],
    },
    courseStudentSavePage: {
        path: '/course-student/:id',
        title: 'Course Student Save Page',
        auth: true,
        component: CourseStudentSavePage,
        permissions: [apiConfig.course.create.baseURL, apiConfig.course.update.baseURL],
    },
    taskStudentListPage: {
        path: '/course-student/task/:courseId',
        title: 'Task List Page',
        auth: true,
        component: TaskStudentListPage,
        permissions: [apiConfig.task.studentTask.baseURL],
    },
    taskStudentSavePage: {
        path: '/course-student/task/:courseId/:id',
        title: 'Task Student Save Page',
        auth: true,
        component: TaskStudentSavePage,
        permissions: [apiConfig.task.create.baseURL, apiConfig.task.update.baseURL],
    },
    lectureTaskStudentListPage: {
        path: '/course-student/task/:courseId/lecture',
        title: 'Lecture Leader List Page',
        auth: true,
        component: AsignAllStudentListPage,
        permissions: [apiConfig.lecture.getBySubject.baseURL],
    },
    myTaskStudentListPage: {
        path: '/my-task',
        title: 'My Task List Page',
        auth: true,
        component: MyTaskStudentListPage,
        permissions: [apiConfig.task.getList.baseURL],
    },
    MyTaskLogStudentListPage: {
        path: '/my-task/task-log',
        title: 'Task Log Save Page',
        auth: true,
        component: MyTaskLogStudentListPage,
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
    MyTaskLogStudentSavePage: {
        path: '/my-task/task-log/:id',
        title: 'Task Log Save Page',
        auth: true,
        component: TaskLogMyStudentSavePage,
        permissions: [apiConfig.taskLog.getList.baseURL],
    },
    registrationStudentListPage: {
        path: '/course-student/registration',
        title: 'Registration',
        auth: true,
        component: RegistrationStudentListPage,
        permissions: [apiConfig.registration.getList.baseURL],
    },
    registrationStudentSavePage: {
        path: '/course-student/registration/:id',
        title: 'Registration Student Save Page',
        auth: true,
        component: RegistrationStudentSavePage,
        permissions: [apiConfig.registration.create.baseURL, apiConfig.registration.update.baseURL],
    },
    taskLogStudentListPage: {
        path: '/course-student/task/:courseId/task-log',
        title: 'Task Log Student List Page',
        auth: true,
        component: TaskLogStudentListPage,
        permissions: [apiConfig.taskLog.getList.baseURL],
    },
    taskLogStudentSavePage: {
        path: '/course-student/task/:courseId/task-log/:id',
        title: 'Task Log Student List Page',
        auth: true,
        component: TaskLogStudentSavePage,
        permissions: [apiConfig.taskLog.create.baseURL, apiConfig.taskLog.update.baseURL],
    },
    myActivityCourseStudentListPage: {
        path: '/my-activity-course',
        title: 'My Activity Course List Page',
        auth: true,
        component: MyActivityCourseListPage,
        permissions: [apiConfig.taskLog.getList.baseURL],
    },
    myActivityCourseStudentSavePage: {
        path: '/my-activity-course/:id',
        title: 'My Activity Course Save Page',
        auth: true,
        component: ActivityCourseStudentSavePage,
        permissions: [apiConfig.taskLog.create.baseURL, apiConfig.taskLog.update.baseURL],
    },
    myActivityProjectStudentListPage: {
        path: '/my-activity-project',
        title: 'My Activity Project List Page',
        auth: true,
        component: MyActivityProjectListPage,
        permissions: [apiConfig.projectTaskLog.getList.baseURL],
    },
    myActivityProjectStudentSavePage: {
        path: '/my-activity-project/:id',
        title: 'My Activity Project Save Page',
        auth: true,
        component: ActivityProjectStudentSavePage,
        permissions: [apiConfig.projectTaskLog.create.baseURL, apiConfig.projectTaskLog.update.baseURL],
    },
};
