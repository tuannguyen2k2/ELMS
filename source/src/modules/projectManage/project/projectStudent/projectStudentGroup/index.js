import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
import { Avatar, Button, Tag } from 'antd';
import { UserOutlined, ContainerOutlined, ProjectOutlined } from '@ant-design/icons';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import { useNavigate, generatePath, useLocation } from 'react-router-dom';
import routes from '@routes';
import AvatarField from '@components/common/form/AvatarField';

const message = defineMessages({
    objectName: 'Nhóm',
    name: 'Họ và tên',
    home: 'Trang chủ',
    team: 'Nhóm',
    status: 'Trạng thái',
    course: 'Khoá học',
    project: 'Dự án',
    description: 'Mô tả',
    leaderId: 'Leader',
    projectId: 'Dự án',
    teamName: 'Tên nhóm',
});

const ProjectStudentTeamListPage = () => {
    const navigate = useNavigate();
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const active = queryParameters.get('active');
    const leaderId = queryParameters.get('leaderId');
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
        apiConfig: apiConfig.team,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.getCreateLink = () => {
                return `${pagePath}/create?projectId=${projectId}&projectName=${projectName}&leaderId=${leaderId}&active=${active}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                const pathDefault = `?projectId=${projectId}&projectName=${projectName}&leaderId=${leaderId}`;
                if (active) return `${pagePath}/${dataRow.id}` + pathDefault + `&active=${active}`;
                else return `${pagePath}/${dataRow.id}` + pathDefault;
            };
        },
    });

    const columns = [
        {
            title: '#',
            dataIndex: 'avatar',
            align: 'center',
            width: 80,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: <FormattedMessage defaultMessage="Tên nhóm" />,
            dataIndex: 'teamName',
            width: '150px',
        },
        {
            title: <FormattedMessage defaultMessage="Dự án" />,
            dataIndex: ['projectInfo', 'name'],
            width: '500px',
        },

        {
            title: <FormattedMessage defaultMessage="Leader" />,
            dataIndex: ['leaderInfo', 'leaderName'],
            width: '150px',
        },
        mixinFuncs.renderActionColumn(
            { edit:true, delete:true },
            { width: '100px' },
        ),

    ].filter(Boolean);

    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(message.project),
                    path: generatePath(routes.projectStudentListPage.path),
                },
                { breadcrumbName: translate.formatMessage(message.team) },
            ]}
        >
            <ListPage
                title={<span style={{ fontWeight: 'normal', fontSize: '18px' }}>{projectName}</span>}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                }
            ></ListPage>
        </PageWrapper>
    );
};
export default ProjectStudentTeamListPage;
