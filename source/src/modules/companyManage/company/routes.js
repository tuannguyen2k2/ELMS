import apiConfig from '@constants/apiConfig';
import CompanyListPage from '.';
import CompanySavePage from './CompanySavePage';
import ServiceCompanySubListPage from '../serviceCompanySubscription';
import ServiceCompanySubscriptionSavePage from '../serviceCompanySubscription/ServiceCompanySubscriptionSavePage';
import CompanySubscriptionIdListPage from '../company/CompanySubscriptionID/index';
import CompanySubscriptionIdSavePage from './CompanySubscriptionID/CompanySubscriptionIDSavePage';
import CompanySeekListPage from './companySeek';
import CompanySeekDevListPage from './companySeek/companySeekDev';
import CompanySeekSavePage from "./companySeek/CompanySeekSavePage";
import CompanySeekDevPreviewPage from './companySeek/companySeekDev/CompanySeekDevPreviewPage';
export default {
    companyListPage: {
        path: '/company',
        title: 'Company',
        auth: true,
        component: CompanyListPage,
        permissions: [apiConfig.company.getList.baseURL],
    },
    companySavePage: {
        path: '/company/:id',
        title: 'Company Save Page',
        auth: true,
        component: CompanySavePage,
        permissions: [apiConfig.company.create.baseURL, apiConfig.company.update.baseURL],
    },
    serviceCompanySubListPage: {
        path: '/service-company-subscription',
        title: 'Service Company Subscription',
        auth: true,
        component: ServiceCompanySubListPage,
        permissions: [apiConfig.serviceCompanySubscription.getList.baseURL],
    },
    serviceCompanySubSavePage: {
        path: '/service-company-subscription/:id',
        title: 'Service Company Subscription Save page',
        auth: true,
        component: ServiceCompanySubscriptionSavePage,
        permissions: [
            apiConfig.serviceCompanySubscription.create.baseURL,
            apiConfig.serviceCompanySubscription.update.baseURL,
        ],
    },
    companySubscriptionIdListPage: {
        path: '/company/company-subscription',
        title: 'Company Subscription By Id ',
        auth: true,
        component: CompanySubscriptionIdListPage,
        permissions: [apiConfig.companySubscription.getList.baseURL],
    },
    companySubscriptionIdSavePage: {
        path: '/company/company-subscription/:id',
        title: 'Company Subscription Save page By Id ',
        auth: true,
        component: CompanySubscriptionIdSavePage,
        permissions: [apiConfig.companySubscription.create.baseURL, apiConfig.companySubscription.update.baseURL],
    },
    companySeekListPage: {
        path: '/company-seek',
        title: 'Company seek',
        auth: true,
        component: CompanySeekListPage,
        permissions: [apiConfig.companySeek.getList.baseURL],
    },
    companySeekDevListPage: {
        path: '/company-seek-dev',
        title: 'Company seek dev',
        auth: true,
        component: CompanySeekDevListPage,
        permissions: [apiConfig.companySeek.getListDev.baseURL],
    },
    companySeekSavePage: {
        path: '/company-seek/:id',
        title: 'Company Seek Save Page',
        auth: true,
        component: CompanySeekSavePage,
        permissions: [apiConfig.companySeek.create.baseURL, apiConfig.companySeek.update.baseURL],
    },
    companySeekDevPreviewPage: {
        path: '/company-seek-dev/preview',
        title: 'Company seek dev',
        auth: true,
        component: CompanySeekDevPreviewPage,
        permissions: [apiConfig.companySeek.getListDev.baseURL],
    },
};
