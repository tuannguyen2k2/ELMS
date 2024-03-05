import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import { categoryKind } from '@constants/masterData';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useParams } from 'react-router-dom';
import routes from '@routes';
import ProjectMemberForm from './ProjectMemberForm';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';
// import routes from '@modules/course/routes';

const messages = defineMessages({
    objectName: 'Thành viên',
});

function ProjectMemberSavePage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);

    const projectName = queryParameters.get('projectName');
    const projectId = queryParameters.get('projectId');
    const active = queryParameters.get('active');
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.memberProject.getById,
            create: apiConfig.memberProject.create,
            update: apiConfig.memberProject.update,
        },
        options: {
            getListUrl: generatePath(routes.projectTabPage.path),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    id: detail.id,
                    schedule: data.schedule,
                    roleId: data?.projectRole?.id,
                    teamId: data?.team?.id,
                    status: 1,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    projectId: projectId,
                    developerId: data.developer.studentInfo.fullName,
                    projectRoleId: data.projectRole.id,
                    schedule: data.schedule,
                    teamId: data.team.id,
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
                breadcrumbName: translate.formatMessage(commonMessage.generalManage),
                path: routes.projectTabPage.path + pathDefault,
            });
        }
        breadRoutes.push({ breadcrumbName: title });

        return breadRoutes;
    };

    return (
        <PageWrapper loading={loading} routes={setBreadRoutes()} title={title}>
            <ProjectMemberForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
                isError={errors}
            />
        </PageWrapper>
    );
}

export default ProjectMemberSavePage;
