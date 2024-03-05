import PageNotFound from '@components/common/page/PageNotFound';
import categoryRoutesEdu from '@modules/category/categoryEdu/routes';
import categoryRoutesGen from '@modules/category/categoryGen/routes';
import categoryRoutesMajor from '@modules/category/categoryMajor/routes';
import studentRoutes from '@modules/account/student/routes';
import Dashboard from '@modules/entry';
import LoginPage from '@modules/login/index';
import ProfilePage from '@modules/profile/index';
import PageNotAllowed from '@components/common/page/PageNotAllowed';
import subjectRoutes from '@modules/courseManage/subject/routes';
import courseRoutes from '@modules/courseManage/course/routes';
import registrationRoutes from '@modules/courseManage/course/registration/routes';
import leaderRoutes from '@modules/account/leader/routes';
import taskRoutes from '@modules/task/routes';
import projectRoutes from '@modules/projectManage/project/routes';
import projectRoleRoutes from '@modules/projectManage/projectRole/routes';
import developerRoutes from '@modules/account/developer/routes';
import projectTaskRoutes from '@modules/projectManage/project/projectTask/routes';
import companyRoutes from '@modules/companyManage/company/routes';
import companySubscriptionRoutes from '@modules/companyManage/companySubscription/routes';
import settingsRoutes from '@modules/settings/routes';
import courseRequestRoutes from '@modules/courseManage/courseRequest/routes';
import CompanyRequestRoutes from '@modules/companyManage/company/companyRequest/routes';
import MyCompanySubscriptionRoutes from '@modules/companyManage/myCompanySubscription/routes';
import FinanceRoutes from '@modules/courseManage/finance/routes';
import SalaryPeriodRoutes from '@modules/projectManage/salaryPeriod/routes';
/*
    auth
        + null: access login and not login
        + true: access login only
        + false: access not login only
*/
const routes = {
    pageNotAllowed: {
        path: '/not-allowed',
        component: PageNotAllowed,
        auth: null,
        title: 'Page not allowed',
    },
    homePage: {
        path: '/',
        component: Dashboard,
        auth: true,
        title: 'Home',
    },
    loginPage: {
        path: '/login',
        component: LoginPage,
        auth: false,
        title: 'Login page',
    },
    profilePage: {
        path: '/profile',
        component: ProfilePage,
        auth: true,
        title: 'Profile page',
    },

    ...subjectRoutes,
    ...courseRoutes,
    ...categoryRoutesEdu,
    ...categoryRoutesGen,
    ...categoryRoutesMajor,
    ...registrationRoutes,
    ...studentRoutes,
    ...leaderRoutes,
    ...taskRoutes,
    ...projectRoutes,
    ...projectRoleRoutes,
    ...developerRoutes,
    ...projectTaskRoutes,
    ...companyRoutes,
    ...companySubscriptionRoutes,
    ...settingsRoutes,
    ...courseRequestRoutes,
    ...CompanyRequestRoutes,
    ...MyCompanySubscriptionRoutes,
    ...FinanceRoutes,
    ...SalaryPeriodRoutes,
    // keep this at last
    //
    notFound: {
        component: PageNotFound,
        auth: null,
        title: 'Page not found',
        path: '*',
    },
};

export default routes;
