import { UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import React, { useEffect } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../project.module.scss';

const message = defineMessages({
    objectName: 'Nhóm',
});

const TeamListPage = ({ setSearchFilter }) => {
    const navigate = useNavigate();
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const active = queryParameters.get('active');
    const activeProjectTab = localStorage.getItem('activeProjectTab');
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, loading, pagination, queryFilter, queryParams, serializeParams } = useListBase({
        apiConfig: apiConfig.team,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        tabOptions:{
            queryPage: {
                projectId,
            },
            isTab: true,
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
                return `${routes.teamListPage.path}/create?projectId=${projectId}&projectName=${projectName}&active=${active}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                const pathDefault = `?projectId=${projectId}&projectName=${projectName}`;
                if (active) return `${routes.teamListPage.path}/${dataRow.id}` + pathDefault + `&active=${active}`;
                else return `${routes.teamListPage.path}/${dataRow.id}` + pathDefault;
            };
        },
    });

    useEffect(() => {
        setSearchFilter(queryFilter);
    }, [queryFilter]);
    const setColumns = () => {
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
                width: 150,
            },
            {
                title: <FormattedMessage defaultMessage="Dự án" />,
                dataIndex: ['projectInfo', 'name'],
                width: 170,
            },
            {
                title: <FormattedMessage defaultMessage="Người hướng dẫn" />,
                dataIndex: ['leaderInfo', 'leaderName'],
                width: 170,
            },
            mixinFuncs.renderStatusColumn({ width: '120px' }),
        ];
        active &&
            columns.push(
                mixinFuncs.renderActionColumn(
                    {
                        edit: true,
                        delete: true,
                    },
                    { width: '150px' },
                ),
            );
        return columns;
    };

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.teamName),
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];


    const clearSearchFunc = (functionClear) => {
        functionClear();
    };

    return (
        <ListPage
            searchForm={mixinFuncs.renderSearchForm({
                fields: searchFields,
                className: styles.search,
                activeTab: activeProjectTab,
            })}
            actionBar={active && mixinFuncs.renderActionBar()}
            baseTable={
                <BaseTable
                    onChange={mixinFuncs.changePagination}
                    columns={setColumns()}
                    dataSource={data}
                    loading={loading}
                    pagination={pagination}
                />
            }
        ></ListPage>
    );
};
export default TeamListPage;
