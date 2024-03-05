import ListPage from '@components/common/layout/ListPage';
import React, { useEffect, useState } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import {
    DATE_DISPLAY_FORMAT,
    DATE_FORMAT_DISPLAY,
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
    AppConstants,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Avatar, Tag } from 'antd';
import { generatePath, useNavigate } from 'react-router-dom';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { convertUtcToLocalTime } from '@utils';
import { useLocation } from 'react-router-dom';
import useFetch from '@hooks/useFetch';
import route from '@modules/projectManage/project/routes';
import routes from '@routes';
import { EditOutlined } from '@ant-design/icons';
import ScheduleFile from '@components/common/elements/ScheduleFile';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { commonMessage } from '@locales/intl';
import useAuth from '@hooks/useAuth';
import { FieldTypes } from '@constants/formConfig';

const message = defineMessages({
    home: 'Trang chủ',
    project: 'Dự án',
    objectName: 'Thành viên dự án',
    role: 'Vai trò',
    name: 'Họ và tên ',
    developer: 'Lập trình viên',
    member: 'Thành viên',
});

const ProjectStudentMemberListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { profile } = useAuth();

    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const active = queryParameters.get('active');
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination,queryParams,serializeParams } = useListBase({
        apiConfig: apiConfig.memberProject,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({ ...params, projectName: null });
            };
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.getCreateLink = () => {
                return `${pagePath}/create?projectId=${projectId}&projectName=${projectName}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?projectId=${projectId}&projectName=${projectName}`;
            };
            funcs.additionalActionColumnButtons = () => ({
                editmember: ({ id,developer }) => {
                    return (
                        <BaseTooltip type="edit" objectName={translate.formatMessage(commonMessage.member)}>
                            <Button
                                disabled={developer?.id !== profile.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        `${pagePath}/${id}?projectId=${projectId}&projectName=${projectName}`,
                                    );
                                }}
                                type="link"
                                style={{ padding: 0 }}
                            >
                                <EditOutlined color="red" />
                            </Button>
                        </BaseTooltip>
                    );
                },
            });
            funcs.changeFilter = (filter) => {
                const projectId = queryParams.get('projectId');
                const projectName = queryParams.get('projectName');
                mixinFuncs.setQueryParams(
                    serializeParams({ projectId: projectId, projectName: projectName, ...filter }),
                );
            };
        },
    });

    const columns = [
        {
            title: '#',
            dataIndex: ['developer', 'studentInfo', 'avatar'],
            align: 'center',
            width: 80,
            render: (avatar) => (
                <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: translate.formatMessage(message.name),
            dataIndex: ['developer', 'studentInfo', 'fullName'],
        },
        {
            title: translate.formatMessage(commonMessage.team),
            dataIndex: ['team', 'teamName'],
            width: 150,
        },
        {
            title: translate.formatMessage(message.role),
            dataIndex: ['projectRole', 'projectRoleName'],
            width: 150,
        },

        {
            title: 'Lịch trình',
            dataIndex: 'schedule',
            align: 'center',
            render: (schedule) => {
                return <ScheduleFile schedule={schedule} />;
            },
            width: 180,
        },
        mixinFuncs.renderActionColumn({ editmember:true,edit: true, delete: true }, { width: '100px' }),
    ].filter(Boolean);
    const { data: teamData } = useFetch(apiConfig.team.autocomplete, {
        immediate: true,
        params: { projectId },
        mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.teamName })),
    });
    const searchFields = [
        {
            key: 'teamId',
            placeholder: translate.formatMessage(commonMessage.team),
            type: FieldTypes.SELECT,
            options: teamData,
        },
    ];

    // !leaderName && !developerName && columns.push(mixinFuncs.renderStatusColumn({ width: '120px' }));

    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(message.project),
                    path: generatePath(routes.projectStudentListPage.path),
                },
                { breadcrumbName: translate.formatMessage(message.member) },
            ]}
        >
            <ListPage
                title={<span style={{ fontWeight: 'normal' }}>{projectName}</span>}
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: queryFilter,
                })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                    />
                }
            />
        </PageWrapper>
    );
};

export default ProjectStudentMemberListPage;
