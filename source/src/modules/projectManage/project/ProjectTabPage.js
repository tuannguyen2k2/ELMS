import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React, { useEffect, useState } from 'react';
import BaseTable from '@components/common/table/BaseTable';

import { DEFAULT_TABLE_ITEM_SIZE, isSystemSettingOptions } from '@constants';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import useAuth from '@hooks/useAuth';
import SelectField from '@components/common/form/SelectField';
import { Tabs } from 'antd';
import ProjectTaskListPage from './projectTask';
import TeamListPage from './team';
import useQueryParams from '@hooks/useQueryParams';
import ProjectMemberListPage from './member';
import ProjectCategoryListPage from './projectCategory';
import routes from '@routes';

const message = defineMessages({
    objectName: 'setting',
});
const ProjectTabPage = () => {
    const translate = useTranslate();
    const { params: queryParams, setQueryParams, serializeParams, deserializeParams } = useQueryParams();
    const projectName = queryParams.get('projectName');
    const [searchFilter, setSearchFilter] = useState([]);
    const [activeTab, setActiveTab] = useState(
        localStorage.getItem(routes.projectTabPage.keyActiveTab)
            ? localStorage.getItem(routes.projectTabPage.keyActiveTab)
            : translate.formatMessage(commonMessage.task),
    );
    const dataTab = [
        {
            label: translate.formatMessage(commonMessage.task),
            key: translate.formatMessage(commonMessage.task),
            children: <ProjectTaskListPage setSearchFilter={setSearchFilter} />,
        },
        {
            label: translate.formatMessage(commonMessage.team),
            key: translate.formatMessage(commonMessage.team),
            children: <TeamListPage setSearchFilter={setSearchFilter} />,
        },
        {
            label: translate.formatMessage(commonMessage.member),
            key: translate.formatMessage(commonMessage.member),
            children: <ProjectMemberListPage setSearchFilter={setSearchFilter} />,
        },
        {
            label: translate.formatMessage(commonMessage.projectCategory),
            key: translate.formatMessage(commonMessage.projectCategory),
            children: <ProjectCategoryListPage setSearchFilter={setSearchFilter} />,
        },
    ];

    const breadcrumbs = [
        {
            breadcrumbName: translate.formatMessage(commonMessage.project),
            path: routes.projectListPage.path,
        },
        {
            breadcrumbName: translate.formatMessage(commonMessage.generalManage),
        },
    ];

    return (
        <PageWrapper routes={breadcrumbs}>
            <ListPage
                title={<div style={{ fontWeight: 'normal' }}>{projectName}</div>}
                baseTable={
                    <Tabs
                        style={{ marginTop: 20 }}
                        type="card"
                        onTabClick={(key) => {
                            setActiveTab(key);
                            localStorage.setItem(routes.projectTabPage.keyActiveTab, key);
                        }}
                        activeKey={activeTab}
                        items={dataTab.map((item) => {
                            return {
                                label: item.label,
                                key: item.key,
                                children: item.children,
                            };
                        })}
                    />
                }
            />
        </PageWrapper>
    );
};

export default ProjectTabPage;
