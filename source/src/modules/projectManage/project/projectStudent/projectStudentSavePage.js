import PageWrapper from '@components/common/layout/PageWrapper';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import ProjectStudentForm from './projectStudentForm';
import { generatePath, useParams } from 'react-router-dom';
import routes from '../routes';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
const messages = defineMessages({
    project: 'Dự án',
    objectName: 'Dự án',
});

const ProjectStudentSavePage = () => {
    const { profile } = useAuth();
    const projectId = useParams();
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.project.getById,
            create: apiConfig.project.create,
            update: apiConfig.project.update,
        },
        options: {
            getListUrl: generatePath(routes.projectStudentListPage.path, { projectId }),
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
                    breadcrumbName: translate.formatMessage(messages.project),
                    path: generatePath(routes.projectStudentListPage.path),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <ProjectStudentForm
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

export default ProjectStudentSavePage;
