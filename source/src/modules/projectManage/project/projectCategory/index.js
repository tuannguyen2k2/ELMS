import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { convertUtcToLocalTime } from '@utils';
import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
// import styles from './member.module.scss';
import { statusOptions } from '@constants/masterData';

const message = defineMessages({
    objectName: 'Danh mục',
    nameCategory: 'Tên danh mục ',
});

const ProjectCategoryListPage = ({ setSearchFilter }) => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const { pathname: pagePath } = useLocation();
    const location = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const active = queryParameters.get('active');
    const activeProjectTab = localStorage.getItem('activeProjectTab');
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.projectCategory,
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            tabOptions: {
                queryPage: {
                    projectId,
                },
                isTab: true,
            },
            override: (funcs) => {
                funcs.mappingData = (response) => {
                    try {
                        if (response.result === true) {
                            return {
                                data: response.data.content,
                                total: response.data.totalElements,
                            };
                        }
                    } catch (error) {
                        return [];
                    }
                };
                funcs.getCreateLink = () => {
                    return `${routes.projectCategoryListPage.path}/create?projectId=${projectId}&projectName=${projectName}&active=${active}`;
                };
                funcs.getItemDetailLink = (dataRow) => {
                    const pathDefault = `?projectId=${projectId}&projectName=${projectName}&active=${active}`;
                    return `${routes.projectCategoryListPage.path}/${dataRow.id}` + pathDefault;
                };
            },
        });
    useEffect(() => {
        setSearchFilter(queryFilter);
    }, [queryFilter]);

    const columns = [
        {
            title: translate.formatMessage(message.nameCategory),
            dataIndex: 'projectCategoryName',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            width: 170,
            render: (createdDate) => {
                const createdDateLocal = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: '150px' },
        ),
    ].filter(Boolean);

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.nameCategory),
        },
    ];

    return (
        <ListPage
            searchForm={mixinFuncs.renderSearchForm({
                fields: searchFields,
                activeTab: activeProjectTab,
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
    );
};

export default ProjectCategoryListPage;
