import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import React from 'react';
import { defineMessages } from 'react-intl';
import ProjectLeaderMemberForm from './ProjectLeaderMemberForm';
import { generatePath } from 'react-router-dom';
// import routes from '@modules/course/routes';
import { showErrorMessage } from '@services/notifyService';

const messages = defineMessages({
    objectName: 'Thành viên',
});

function ProjectLeaderMemberSavePage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);

    const projectName = queryParameters.get('projectName');
    const projectId = queryParameters.get('projectId');
    const leaderId = queryParameters.get('leaderId');
    const active = queryParameters.get('active');
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.memberProject.getById,
            create: apiConfig.memberProject.create,
            update: apiConfig.memberProject.update,
        },
        options: {
            getListUrl: generatePath(routes.projectLeaderMemberListPage.path),
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
            funcs.onSaveError = (err) => {
                if (err.code === 'ERROR-MEMBER-PROJECT-ERROR-0001') {
                    showErrorMessage('Thành viên trong dự án đã tồn tại');
                    mixinFuncs.setSubmit(false);
                } else {
                    mixinFuncs.handleShowErrorMessage(err, showErrorMessage);
                    mixinFuncs.setSubmit(false);
                }
            };
        },
    });

    const setBreadRoutes = () => {
        const pathDefault = `?projectId=${projectId}&projectName=${projectName}&leaderId=${leaderId}`;
        const breadRoutes = [];

        if (active) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.project),
                path: routes.projectLeaderListPage.path + pathDefault + `&active=${active}`,
            });
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.member),
                path: routes.projectLeaderMemberListPage.path + pathDefault + `&active=${active}`,
            });
        } else {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.project),
                path: routes.projectLeaderListPage.path + pathDefault,
            });
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.member),
                path: routes.projectLeaderMemberListPage.path + pathDefault,
            });
        }

        breadRoutes.push({ breadcrumbName: title });

        return breadRoutes;
    };

    return (
        <PageWrapper loading={loading} routes={setBreadRoutes()} title={title}>
            <ProjectLeaderMemberForm
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

export default ProjectLeaderMemberSavePage;
