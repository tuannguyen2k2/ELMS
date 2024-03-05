import apiConfig from '@constants/apiConfig';
import RegistrationListPage from '.';
import RegistrationSavePage from './RegistrationSavePage';
import RegistrationMoneyListPage from './registrationMoney';
import RegistrationMoneySavePage from './registrationMoney/RegistrationMoneySavePage';
import StudentActivityCourseListPage from './activity';
import StudentActivityCourseLeaderListPage from '../leader/registrationLeader/studentActivity';
export default {
    registrationListPage: {
        path: '/course/registration',
        title: 'Registration',
        auth: true,
        component: RegistrationListPage,
        permissions: [apiConfig.registration.getList.baseURL],
    },
    registrationSavePage: {
        path: '/course/registration/:id',
        title: 'Registration Save Page',
        auth: true,
        component: RegistrationSavePage,
        permissions: [apiConfig.registration.create.baseURL, apiConfig.registration.update.baseURL],
    },
    registrationMoneyListPage: {
        path: '/course/registration/money-history',
        title: 'Registration',
        auth: true,
        component: RegistrationMoneyListPage,
        permissions: [apiConfig.registration.getList.baseURL],
    },
    registrationMoneySavePage: {
        path: '/course/registration/money-history/:id',
        title: 'Registration Save Page',
        auth: true,
        component: RegistrationMoneySavePage,
        permissions: [apiConfig.registration.create.baseURL, apiConfig.registration.update.baseURL],
    },
    studentActivityCourseListPage: {
        path: '/course/registration/student-activity-course',
        title: 'Student Activity Course List Page',
        auth: true,
        component: StudentActivityCourseListPage,
        permissions: [apiConfig.taskLog.getList.baseURL],
    },
    studentActivityCourseLeaderListPage: {
        path: '/course-leader/registration/student-activity-course',
        title: 'Student Activity Course Leader List Page',
        auth: true,
        component: StudentActivityCourseLeaderListPage,
        permissions: [apiConfig.taskLog.getList.baseURL],
    },
};
