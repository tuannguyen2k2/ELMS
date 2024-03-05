import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { DEFAULT_TABLE_ITEM_SIZE, AppConstants } from '@constants/index';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Tag } from 'antd';
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { companySeekOptions, stateCourseRequestOptions } from '@constants/masterData';
import { statusOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { EditOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import useFetch from '@hooks/useFetch';

const message = defineMessages({
    objectName: 'ứng viên đã lưu',
});

const CompanySeekListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const stateValues = translate.formatKeys(companySeekOptions, ['label']);
    const { data, mixinFuncs, loading, pagination, queryFiter, serializeParams } = useListBase({
        apiConfig: apiConfig.companySeek,
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
                mixinFuncs.setQueryParams(serializeParams(filter));
            };
            funcs.additionalActionColumnButtons = () => ({
                edit: (item) => (
                    <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(mixinFuncs.getItemDetailLink(item), {
                                state: { action: 'edit', prevPath: location.pathname, data: companySeeks },
                            });
                        }}
                    >
                        <EditOutlined />
                    </Button>
                ),
            });
        },
    });

    const {
        data: companySeeks,
        // loading: getcompanyRequestLoading,
        execute: executescompanySeeks,
    } = useFetch(apiConfig.companySeek.autocomplete, {
        immediate: true,
    });

    const {
        data: projectRoles,
        // loading: getcompanyLoading,
        execute: executesProjectRoles,
    } = useFetch(apiConfig.projectRole.autocomplete, {
        immediate: true,
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item.id,
                label: item.projectRoleName,
            })),
    });

    const columns = [
        {
            title: <FormattedMessage defaultMessage="Tên lập trình viên" />,
            dataIndex: ['developer', 'studentInfo', 'fullName'],
        },
        {
            title: <FormattedMessage defaultMessage="Vai trò" />,
            dataIndex: ['role', 'projectRoleName'],
            align: 'center',
            width: 200,
            render(role) {
                return (
                    <Tag>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{role}</div>
                    </Tag>
                );
            },
        },
        {
            title: <FormattedMessage defaultMessage="Tình trạng" />,
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                return <div>{dataRow === 1 ? <EyeOutlined style={{ color: 'orange' }}/> : <CheckCircleOutlined style={{ color: 'green' }} />}</div>;
            },
        },
        // mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '150px' }),
    ];

    const searchFields = [
        {
            key: 'nameDeveloper',
            placeholder: translate.formatMessage(commonMessage.name),
        },
        {
            key: 'roleId',
            placeholder: translate.formatMessage(commonMessage.role),
            type: FieldTypes.SELECT,
            options: projectRoles,
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
        },
    ];
    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.companySeek) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFiter })}
                //actionBar={mixinFuncs.renderActionBar()}
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
export default CompanySeekListPage;
