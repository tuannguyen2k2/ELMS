import React from 'react';
import apiConfig from '@constants/apiConfig';
import routes from '@routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import CompanyRequestForm from './CompanyRequestForm';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';
import { useState } from 'react';
import { Button } from 'antd';
import ListPage from '@components/common/layout/ListPage';
import useAuth from '@hooks/useAuth';

const message = defineMessages({
    objectName: 'Yêu cầu công ty',
});

const CompanyRequestSavePage = () => {
    const CompanyRequestId = useParams();
    const translate = useTranslate();
    const { profile } = useAuth();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.companyRequest.getById,
            create: apiConfig.companyRequest.create,
            update: apiConfig.companyRequest.update,
        },
        options: {
            getListUrl: routes.companyRequestListPage.path,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    companyId: profile?.id,
                    status: 1,
                };
            };
            funcs.prepareCreateData = (data) => {
                return { ...data, status: 1, companyId: profile?.id };
            };
        },
    });
    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.companyRequest),
                    path: generatePath(routes.companyRequestListPage.path + `?companyId=${profile.id}`),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CompanyRequestForm
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
export default CompanyRequestSavePage;
