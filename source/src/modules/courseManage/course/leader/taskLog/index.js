import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { TaskLogKindOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Tag } from 'antd';
import React from 'react';
import { useLocation, generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { commonMessage } from '@locales/intl';
import TaskLogListPage from '@modules/task/taskLog';
import { deleteSearchFilterInLocationSearch } from '@utils';
const message = defineMessages({
    objectName: 'Task',
});

function TaskLogLeaderListPage() {
    const location = useLocation();
    const paramid = useParams();
    const courseId = paramid.courseId;
    const taskParam = generatePath(routes.taskLeaderListPage.path, { courseId });
    const search = location.search;
    const paramHead = routes.courseLeaderListPage.path;
    const setBreadCrumbName = (searchFilter) => {
        return routes.taskLogListPage.breadcrumbs(
            commonMessage,
            paramHead,
            taskParam,
            deleteSearchFilterInLocationSearch(search, searchFilter),
        );
    };

    return <TaskLogListPage setBreadCrumbName={setBreadCrumbName} />;
}

export default TaskLogLeaderListPage;
