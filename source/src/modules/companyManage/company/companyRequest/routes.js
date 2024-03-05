import apiConfig from "@constants/apiConfig";
import CompanyRequestListPage from ".";
import CompanyRequestSavePage from "./CompanyRequestSavePage";
// import CompanySubscriptionSavePage from "@modules/companyManage/company/companySubscription/CompanySubscriptionSavePage";
// import CompanyForm from "@modules/company/CompanyForm";

export default {
    companyRequestListPage: {
        path: '/company-request',
        title: 'Company Request',
        auth: true,
        component: CompanyRequestListPage,
        permissions: [apiConfig.companyRequest.getList.baseURL],
    },
    companyRequestSavePage: {
        path: '/company-request/:id',
        title: 'Company Request Save Page',
        auth: true,
        component: CompanyRequestSavePage,
        permissions: [apiConfig.companyRequest.create.baseURL, apiConfig.companyRequest.update.baseURL],
    },
};