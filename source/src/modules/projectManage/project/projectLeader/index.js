import ListPage from '@components/common/layout/ListPage';
import React, { useEffect, useState } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_FORMAT, DATE_FORMAT_DISPLAY, DEFAULT_TABLE_ITEM_SIZE, AppConstants } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { UserOutlined } from '@ant-design/icons';
import { Button, Avatar, Tag } from 'antd';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import routes from '@routes';
import route from '@modules/projectManage/project/projectTask/routes';
import { BookOutlined, TeamOutlined, EditOutlined } from '@ant-design/icons';
import { statusOptions, projectTaskState } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import AvatarField from '@components/common/form/AvatarField';
import { IconBrandTeams } from '@tabler/icons-react';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { commonMessage } from '@locales/intl';
import { IconCategory } from '@tabler/icons-react';

const message = defineMessages({
    objectName: 'Dự án',
    code: 'Mã dự án',
    id: 'Id',
    group: 'Nhóm',
    startDate: ' Ngày bắt đầu',
});

const ProjectLeaderListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const leaderName = queryParameters.get('leaderName');
    const developerName = queryParameters.get('developerName');

    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: {
                getList: apiConfig.project.getListLeader,
                getById: apiConfig.project.getById,
                delete: apiConfig.project.delete,
            },
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

                funcs.changeFilter = (filter) => {
                    const leaderId = queryParams.get('leaderId');
                    const leaderName = queryParams.get('leaderName');
                    const developerId = queryParams.get('developerId');
                    const developerName = queryParams.get('developerName');
                    if (leaderId) {
                        mixinFuncs.setQueryParams(
                            serializeParams({ leaderId: leaderId, leaderName: leaderName, ...filter }),
                        );
                    } else if (developerId) {
                        mixinFuncs.setQueryParams(
                            serializeParams({ developerId: developerId, developerName: developerName, ...filter }),
                        );
                    } else {
                        mixinFuncs.setQueryParams(serializeParams(filter));
                    }
                };
                funcs.getItemDetailLink = (dataRow) => {
                    return `${pagePath}/${dataRow.id}?projectId=${dataRow.id}`;
                };
                funcs.additionalActionColumnButtons = () => ({
                    task: ({ id, name, state, status }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.task)}>
                            <Button
                                type="link"
                                disabled={state === 1}
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (status == 1) {
                                        navigate(
                                            routes.projectLeaderTaskListPage.path +
                                                `?projectId=${id}&projectName=${name}&active=${true}`,
                                        );
                                    } else {
                                        navigate(
                                            routes.projectLeaderTaskListPage.path +
                                                `?projectId=${id}&projectName=${name}`,
                                        );
                                    }
                                }}
                            >
                                <BookOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                    member: ({ id, name, status }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.member)}>
                            <Button
                                type="link"
                                style={{ padding: '0' }}
                                onClick={(e) => {
                                    e.stopPropagation();

                                    if (status == 1) {
                                        navigate(
                                            routes.projectLeaderMemberListPage.path +
                                                `?projectId=${id}&projectName=${name}&active=${true}`,
                                        );
                                    } else {
                                        navigate(
                                            routes.projectLeaderMemberListPage.path +
                                                `?projectId=${id}&projectName=${name}`,
                                        );
                                    }
                                }}
                            >
                                <UserOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                    team: ({ id, name, status }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.team)}>
                            <Button
                                type="link"
                                style={{ padding: '0' }}
                                onClick={(e) => {
                                    e.stopPropagation();

                                    if (status == 1) {
                                        navigate(
                                            routes.projectLeaderTeamListPage.path +
                                                `?projectId=${id}&projectName=${name}&active=${true}`,
                                        );
                                    } else {
                                        navigate(
                                            routes.projectLeaderTeamListPage.path +
                                                `?projectId=${id}&projectName=${name}`,
                                        );
                                    }
                                }}
                            >
                                <IconBrandTeams color="#2e85ff" size={17} style={{ marginBottom: '-2px' }} />
                            </Button>
                        </BaseTooltip>
                    ),
                    projectCategory: ({ id, name }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.projectCategory)}>
                            <Button
                                type="link"
                                style={{ padding: '0' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const pathDefault = `?projectId=${id}&projectName=${name}`;

                                    navigate(routes.projectCategoryLeaderListPage.path + pathDefault);
                                }}
                            >
                                <IconCategory size={16} />
                            </Button>
                        </BaseTooltip>
                    ),
                });
            },
        });

    const convertDate = (date) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY);
        return convertDateTimeToString(dateConvert, DATE_FORMAT_DISPLAY);
    };

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
            title: translate.formatMessage(commonMessage.projectName),
            dataIndex: 'name',
        },
        {
            title: translate.formatMessage(message.startDate),
            dataIndex: 'startDate',
            render: (startDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(startDate)}</div>;
            },
            width: 140,
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.endDate),
            dataIndex: 'endDate',
            render: (endDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(endDate)}</div>;
            },
            width: 140,
            align: 'center',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        mixinFuncs.renderActionColumn(
            {
                projectCategory: mixinFuncs.hasPermission(apiConfig.projectCategory?.getList?.baseURL),
                edit: true,
                team: true,
                member: true,
                task: true,
            },
            { width: '160px' },
        ),
    ];
    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.project) }]}>
            <ListPage
                // actionBar={mixinFuncs.renderActionBar()}
                title={<span style={{ fontWeight: 'normal' }}>{leaderName || developerName}</span>}
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

export default ProjectLeaderListPage;
