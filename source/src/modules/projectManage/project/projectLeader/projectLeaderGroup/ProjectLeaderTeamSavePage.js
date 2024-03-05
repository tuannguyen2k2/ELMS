import React from 'react';
import apiConfig from '@constants/apiConfig';
import routes from '@routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import ProjectLeaderTeamForm from './ProjectLeaderTeamForm';
import { commonMessage } from '@locales/intl';
import useAuth from '@hooks/useAuth';
const message = defineMessages({
    objectName: 'Nhóm',
});

// const TeamSavePage = () => {
function ProjectLeaderTeamSavePage() {
    const { profile } = useAuth();
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const active = queryParameters.get('active');
    const leaderId = queryParameters.get('leaderId');
    // const projectName = queryParameters.get('projectName');
    const teamId = useParams();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.team.getById,
            create: apiConfig.team.create,
            update: apiConfig.team.update,
        },
        options: {
            getListUrl: generatePath(routes.projectLeaderTeamListPage.path),
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
                    projectId: projectId,
                    leaderId: profile.id,
                };
            };
        },
    });
    const setBreadRoutes = () => {
        const pathDefault = `?projectId=${projectId}&projectName=${projectName}&leaderId=${leaderId}`;

        const breadRoutes = [
            {
                breadcrumbName: translate.formatMessage(commonMessage.project),
                path: routes.projectLeaderListPage.path,
            },
        ];

        if (active) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.team),
                path: routes.projectLeaderTeamListPage.path + pathDefault + `&active=${active}`,
            });
        } else {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.team),
                path: routes.projectLeaderTeamListPage.path + pathDefault,
            });
        }
        breadRoutes.push({ breadcrumbName: title });

        return breadRoutes;
    };
    return (
        <PageWrapper loading={loading} routes={setBreadRoutes()} title={title}>
            <ProjectLeaderTeamForm
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

export default ProjectLeaderTeamSavePage;
