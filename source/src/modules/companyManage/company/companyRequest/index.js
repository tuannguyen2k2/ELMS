import { EditOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants/index';
import { statusOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import routes from '@routes';

const message = defineMessages({
    objectName: 'Yêu cầu công ty',
});

const CompanyRequestListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const [companyOptions, setCompanyOptions] = useState([]);
    const navigate = useNavigate();
    const { profile } = useAuth();
    const companyId = profile.id;


    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
        apiConfig: apiConfig.companyRequest,
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
            funcs.prepareGetListParams = () => {
                return navigate(routes.companyRequestListPage.path + `?companyId=${profile.id}`);
            };
            funcs.getCreateLink = () => {
                if (profile?.id !== null) {
                    return `${pagePath}/create?companyId=${profile.id}`;
                }
                return `${pagePath}/create`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?companyId=${profile.id}`;
            };
            funcs.additionalActionColumnButtons = () => ({
                edit: (item) => (
                    <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(mixinFuncs.getItemDetailLink(item), {
                                state: { action: 'edit', prevPath: location.pathname },
                            });
                        }}
                    >
                        <EditOutlined />
                    </Button>
                ),
            });
        },
    });

    const columns = [
        {
            title: <FormattedMessage defaultMessage="Tiêu đề" />,
            dataIndex: ['title'],
        },
        {
            title: <FormattedMessage defaultMessage="Số lượng" />,
            dataIndex: ['numberCv'],
            align: 'center',
            width: 140,
        },
        // mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];

    const searchFields = [
        {
            key: 'title',
            placeholder: translate.formatMessage(commonMessage.companyRequest),
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];
    const {
        data: companys,
        // loading: getcompanyLoading,
        execute: executescompanys,
    } = useFetch(apiConfig.company.autocomplete, {
        immediate: true,
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item.id,
                label: item.companyName,
            })),
    });

    useEffect(() => {
        // Kiểm tra xem có dữ liệu trong companys không và không phải là trạng thái loading
        if (companys) {
            setCompanyOptions(companys);
        }
    }, [companys]);

    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.companyRequest) }]}>
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
export default CompanyRequestListPage;
