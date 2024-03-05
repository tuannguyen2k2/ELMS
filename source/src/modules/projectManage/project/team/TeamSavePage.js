import React from 'react';
import apiConfig from '@constants/apiConfig';
import routes from '@routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import TeamForm from './TeamForm';
import { commonMessage } from '@locales/intl';
const message = defineMessages({
    objectName: 'Nhóm',
});

function TeamSavePage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const active = queryParameters.get('active');
    // const projectName = queryParameters.get('projectName');
    const teamId = useParams();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.team.getById,
            create: apiConfig.team.create,
            update: apiConfig.team.update,
        },
        options: {
            getListUrl: generatePath(routes.projectTabPage.path),
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    leaderId: data.leaderInfo?.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    projectId: projectId,
                    leaderId: data.leaderInfo?.id,
                };
            };
        },
    });
    const setBreadRoutes = () => {
        const pathDefault = `?projectId=${projectId}&projectName=${projectName}`;

        const breadRoutes = [
            {
                breadcrumbName: translate.formatMessage(commonMessage.project),
                path: routes.projectListPage.path,
            },
        ];

        if (active) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.generalManage),
                path: routes.projectTabPage.path + pathDefault + `&active=${active}`,
            });
        } else {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.team),
                path: routes.teamListPage.path + pathDefault,
            });
        }
        breadRoutes.push({ breadcrumbName: title });

        return breadRoutes;
    };
    return (
        <PageWrapper loading={loading} routes={setBreadRoutes()} title={title}>
            <TeamForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
}

export default TeamSavePage;
