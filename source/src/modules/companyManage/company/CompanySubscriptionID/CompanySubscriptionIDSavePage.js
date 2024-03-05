import React from 'react';
import apiConfig from '@constants/apiConfig';
import routes from '../routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import CompanySubscriptionIdForm from './CompanySubscriptionIDForm';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';

const message = defineMessages({
    objectName: 'Gói dịch vụ',
});

const CompanySubscriptionIdSavePage = () => {
    const translate = useTranslate();

    const queryParameters = new URLSearchParams(window.location.search);
    const companyId = queryParameters.get('companyId');
    const companyName = queryParameters.get('companyName');
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.companySubscription.getById,
            create: apiConfig.companySubscription.create,
            update: apiConfig.companySubscription.update,
        },
        options: {
            getListUrl: routes.companySubscriptionIdListPage.path,
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
                return { ...data };
            };
        },

    });
    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(commonMessage.company),
                    path: routes.companyListPage.path,
                },
                {
                    breadcrumbName: translate.formatMessage(commonMessage.companySubscription),
                    path: routes.companySubscriptionIdListPage.path +`?companyId=${companyId? companyId : detail.company?.id}&companyName=${companyName ? companyName : detail?.company?.companyName }`,
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CompanySubscriptionIdForm
                formId={mixinFuncs.getFormId()}
                actions={mixinFuncs.renderActions()}
                dataDetail={detail ? detail : {}}
                onSubmit={onSave}
                setIsChangedFormValues={setIsChangedFormValues}
                isError={errors}
                isEditing={isEditing}
            />
        </PageWrapper>
    );
};
export default CompanySubscriptionIdSavePage;