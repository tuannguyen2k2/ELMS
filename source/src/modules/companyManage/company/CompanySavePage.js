import React from 'react';
import apiConfig from '@constants/apiConfig';
import routes from './routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import CompanyForm from './CompanyForm';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';

const message = defineMessages({
    objectName:'Công ty',
});

const CompanySavePage = () => {
    const companyId = useParams();
    const translate = useTranslate();
    
    const { detail, onSave, mixinFuncs,setIsChangedFormValues,isEditing,errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.company.getById,
            create: apiConfig.company.create,
            update: apiConfig.company.update,
        },
        options:{
            getListUrl: routes.companyListPage.path,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };
        },

    });
    return(
        <PageWrapper
            loading = {loading}
            routes={[
                { breadcrumbName: translate.formatMessage(commonMessage.company),
                    path: generatePath(routes.companyListPage.path, { companyId } ) },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CompanyForm
                formId={mixinFuncs.getFormId()}
                actions = {mixinFuncs.renderActions()}
                dataDetail = {detail ? detail : {}}
                onSubmit = {onSave}
                setIsChangedFormValues = {setIsChangedFormValues}
                isError = {errors}
                isEditing = {isEditing}
            />
        </PageWrapper>
    );
};
export default CompanySavePage;