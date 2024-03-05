import React from 'react';
import apiConfig from '@constants/apiConfig';
import routes from '@routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import ProjectCategoryForm from './ProjectCategoryForm';
import { commonMessage } from '@locales/intl';
const message = defineMessages({
    objectName: 'Danh mục',
});

function ProjectCategorySavePage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    // const projectName = queryParameters.get('projectName');
    const projectCategoryId = useParams();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.projectCategory.getById,
            create: apiConfig.projectCategory.create,
            update: apiConfig.projectCategory.update,
        },
        options: {
            getListUrl: generatePath(routes.projectCategoryLeaderListPage.path, { projectCategoryId }),
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
                };
            };
        },
    });
    const setBreadRoutes = () => {
        const pathDefault = `?projectId=${projectId}&projectName=${projectName}`;

        const breadRoutes = [
            {
                breadcrumbName: translate.formatMessage(commonMessage.project),
                path: routes.projectLeaderListPage.path,
            },
        ];

        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.projectCategory),
            path: routes.projectCategoryLeaderListPage.path + pathDefault,
        });
        breadRoutes.push({ breadcrumbName: title });

        return breadRoutes;
    };
    return (
        <PageWrapper loading={loading} routes={setBreadRoutes()} title={title}>
            <ProjectCategoryForm
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

export default ProjectCategorySavePage;
