import apiConfig from "@constants/apiConfig";
import CompanySubscriptionListPage from ".";
import CompanySubscriptionSavePage from "./CompanySubscriptionSavePage";

export default {
    companySubscriptionListPage: {
        path: '/company-subscription',
        title: 'Company Subscription',
        auth: true,
        component: CompanySubscriptionListPage,
        permissions: [apiConfig.companySubscription.getList.baseURL],
    },
    companySubscriptionSavePage: {
        path: '/company-subscription/:id',
        title: 'Company Subscription Save Page',
        auth: true,
        component: CompanySubscriptionSavePage,
        permissions: [apiConfig.companySubscription.create.baseURL, apiConfig.companySubscription.update.baseURL],
    },
};