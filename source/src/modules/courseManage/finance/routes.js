import apiConfig from '@constants/apiConfig';
import FinanceListPage from '.';
export default {
    financeListPage: {
        path: '/finance',
        title: 'Finance List Page',
        auth: true,
        component: FinanceListPage,
        permissions: apiConfig.registrationMoney.listSum.baseURL,
    },
};
