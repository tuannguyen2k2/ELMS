import React from 'react';
import apiConfig from '@constants/apiConfig';
import routes from '../routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import CompanySeekForm from './CompanySeekForm';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';

const message = defineMessages({
    objectName: 'Ứng viên đã lưu',
});

const CompanySeekSavePage = () => {
    const companyId = useParams();
    const translate = useTranslate();

    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.companySeek.getById,
            create: apiConfig.companySeek.create,
            update: apiConfig.companySeek.update,
        },
        options: {
            getListUrl: routes.companySeekListPage.path,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    status: detail.status,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };
        },

    });
    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(message.objectName),
                    path: generatePath(routes.companySeekListPage.path),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CompanySeekForm
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
export default CompanySeekSavePage;