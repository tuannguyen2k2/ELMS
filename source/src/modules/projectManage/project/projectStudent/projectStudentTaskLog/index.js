import routes from '@routes';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { commonMessage } from '@locales/intl';
import ProjectTaskLogListPage from '@modules/projectManage/project/projectTask/projectTaskLog';
import { deleteSearchFilterInLocationSearch } from '@utils';

function ProjectStudentTaskLogListPage() {
    const location = useLocation();
    const taskParam = routes.projectStudentTaskListPage.path;
    const search = location.search;
    const paramHead = routes.projectStudentListPage.path;
    const isProject = true;
    const setBreadCrumbName = (searchFilter) => {
        return routes.ProjectTaskLogListPage.breadcrumbs(
            commonMessage,
            paramHead,
            taskParam,
            deleteSearchFilterInLocationSearch(search, searchFilter),
        );
    };
    const renderAction = true;
    const createPermission = true;
    return (
        <ProjectTaskLogListPage
            setBreadCrumbName={setBreadCrumbName}
            renderAction={renderAction}
            createPermission={createPermission}
        />
    );
}

export default ProjectStudentTaskLogListPage;
