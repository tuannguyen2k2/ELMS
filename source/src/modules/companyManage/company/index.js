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
import { Avatar, Button } from 'antd';
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
// import routes from '@modules/companySubscription/routes';
import { statusOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import routes from './routes';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';

const message = defineMessages({
    objectName: 'công ty',
});

const CompanyListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
        apiConfig: apiConfig.company,
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
            funcs.additionalActionColumnButtons = () => ({
                registration: ({ id, companyName }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.registration)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                    routes.companyListPage.path +
                                        `/company-subscription?companyId=${id}&companyName=${companyName}`,
                                );
                            }}
                        >
                            <ShoppingCartOutlined />
                        </Button>
                    </BaseTooltip>
                ),
            });
        },
    });

    const columns = [
        {
            title: '#',
            dataIndex: 'logo',
            align: 'center',
            width: 80,
            render: (logo) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={logo ? `${AppConstants.contentRootUrl}${logo}` : null}
                />
            ),
        },
        {
            title: <FormattedMessage defaultMessage="Tên công ty" />,
            dataIndex: 'companyName',
        },
        {
            title: <FormattedMessage defaultMessage="Địa chỉ" />,
            dataIndex: 'address',
        },
        {
            title: <FormattedMessage defaultMessage="Hotline" />,
            dataIndex: 'hotline',
        },
        {
            title: <FormattedMessage defaultMessage="Email" />,
            dataIndex: 'email',
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ registration: true, edit: true, delete: true }, { width: '150px' }),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.companyName),
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];
    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(commonMessage.company) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFiter })}
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
export default CompanyListPage;
