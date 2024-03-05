import PageWrapper from '@components/common/layout/PageWrapper';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { generatePath, useParams } from 'react-router-dom';
import routes from './routes';
import apiConfig from '@constants/apiConfig';
import ProjectRoleForm from './projectRoleForm';
import { commonMessage } from '@locales/intl';

const messages = defineMessages({
    objectName: 'Vai trò dự án',
});

const ProjectRoleSavePage = () => {
    const projectRoleId = useParams();
    const translate = useTranslate();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.projectRole.getById,
            create: apiConfig.projectRole.create,
            update: apiConfig.projectRole.update,
        },
        options: {
            getListUrl: generatePath(routes.projectRoleListPage.path, { projectRoleId }),
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
                };
            };
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.projectRole),
                    path: generatePath(routes.projectRoleListPage.path, { projectRoleId }),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <ProjectRoleForm
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
export default ProjectRoleSavePage;
