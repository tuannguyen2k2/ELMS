import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import React from 'react';
import { defineMessages } from 'react-intl';
import { generatePath } from 'react-router-dom';
import SalaryPeriodDetailForm from './SalaryPeriodDetailForm';
import routes from '@routes';
import { commonMessage } from '@locales/intl';

const messages = defineMessages({
    objectName: 'Chi tiết kỳ lương',
});

const SalaryPeriodDetailSavePage = () => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const salaryPeriodId = queryParameters.get('salaryPeriodId');
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: apiConfig.salaryPeriodDetail,
        options: {
            getListUrl: generatePath(routes.salaryPeriodDetailListPage.path),
            objectName: translate.formatMessage(messages.objectName),
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
                    salaryPeriodId,
                };
            };
        },
    });
    const breadcrumbs = [
        {
            breadcrumbName: translate.formatMessage(commonMessage.salaryPeriod),
            path: generatePath(routes.salaryPeriodListPage.path),
        },
        {
            breadcrumbName: translate.formatMessage(messages.objectName),
            path: generatePath(routes.salaryPeriodDetailListPage.path),
        },
        { breadcrumbName: title },
    ];
    return (
        <PageWrapper loading={loading} routes={breadcrumbs} title={title}>
            <SalaryPeriodDetailForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
};

export default SalaryPeriodDetailSavePage;
