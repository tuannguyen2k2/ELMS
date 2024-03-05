import apiConfig from "@constants/apiConfig";
import CompanySubscriptionListPage from ".";
import CompanySubscriptionSavePage from "./CompanySubscriptionSavePage";
import BuyServiceListPage from "./BuyServiceListPage";


export default {
    myCompanySubscriptionListPage: {
        path: '/my-company-subscription',
        title: 'Company Subscription',
        auth: true,
        component: CompanySubscriptionListPage,
        // permissions: [apiConfig.serviceCompanySubscription.getList.baseURL],
    },
    buyServiceListPage: {
        path: '/my-company-subscription/buy-service',
        title: 'Company Subscription',
        auth: true,
        component: BuyServiceListPage,
        // permissions: [apiConfig.serviceCompanySubscription.getList.baseURL],
    },
    myCompanySubscriptionSavePage: {
        path: '/my-company-subscription/:id',
        title: 'Company Subscription Save Page',
        auth: true,
        component: CompanySubscriptionSavePage,
        // permissions: [apiConfig.serviceCompanySubscription.create.baseURL, apiConfig.serviceCompanySubscription.update.baseURL],
    },
};