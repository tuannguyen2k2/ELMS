import React from 'react';
import apiConfig from '@constants/apiConfig';
import routes from './routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { generatePath, useParams, useLocation } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import LeaderForm from './leaderForm';
import { commonMessage } from '@locales/intl';

const message = defineMessages({
    objectName: 'Leader',
});

const LeaderSavePage = () => {
    const leaderId = useParams();
    const translate = useTranslate();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.leader.getById,
            create: apiConfig.leader.create,
            update: apiConfig.leader.update,
        },
        options: {
            getListUrl: routes.leaderListPage.path,
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
    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.leader),
                    path: generatePath(routes.leaderListPage.path, { leaderId }),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <LeaderForm
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
export default LeaderSavePage;
