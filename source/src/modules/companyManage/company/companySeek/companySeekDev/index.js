import { EyeOutlined, UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { Button } from 'antd';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import { expYearOptions } from '@constants/masterData';

const message = defineMessages({
    objectName: 'Tìm kiếm ứng viên',
    preview: 'Xem chi tiết ứng viên',
    reminderMessage: 'Vui lòng chọn vai trò cần tìm !',
    expYear: 'Năm kinh nghiệm',
});

const CompanySeekDevListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const roleId = queryParameters.get('roleId');
    const expYearValues = translate.formatKeys(expYearOptions, ['label']);
    const [isHasValueSearch, setIsHasValueSearch] = useState(roleId && true);
    const { data, mixinFuncs, loading, pagination, queryFilter, serializeParams } = useListBase({
        apiConfig: {
            getList: apiConfig.companySeek.getListDev,
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
                mixinFuncs.setQueryParams(serializeParams(filter));
            };
            funcs.additionalActionColumnButtons = () => ({
                preview: ({ id }) => (
                    <BaseTooltip title={translate.formatMessage(message.preview)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                navigate(routes.companySeekDevPreviewPage.path + `?id=${id}&roleId=${roleId}`);
                            }}
                        >
                            <EyeOutlined />
                        </Button>
                    </BaseTooltip>
                ),
            });
        },
    });
    const { data: projectRoles } = useFetch(apiConfig.projectRole.autocomplete, {
        immediate: true,
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item.id,
                label: item.projectRoleName,
            })),
    });
    const searchFields = [
        {
            key: 'roleId',
            placeholder: translate.formatMessage(commonMessage.role),
            type: FieldTypes.SELECT,
            onChange: (value) => {
                value ? setIsHasValueSearch(true) : setIsHasValueSearch(false);
            },
            options: projectRoles,
        },
        {
            key: 'expYear',
            type: FieldTypes.SELECT,
            placeholder: translate.formatMessage(message.expYear),
            options: expYearValues,
        },
    ];
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
            title: 'Họ và tên',
            dataIndex: 'name',
        },
        {
            title: 'Vai trò',
            dataIndex: 'projectRoles',
            width: 170,
            render: (item) => {
                let roleName = '';
                item.map((role) => {
                    if (roleName !== '') {
                        roleName += ', ';
                    }
                    roleName += role.projectRoleName;
                });
                return <div>{roleName}</div>;
            },
        },
        mixinFuncs.renderActionColumn({ preview: true }, { width: 160 }),
    ];

    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(message.objectName) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: queryFilter,
                    className: !isHasValueSearch && styles.disableSearch,
                    onReset: () => setIsHasValueSearch(false),
                })}
                baseTable={
                    <div>
                        {!roleId && !isHasValueSearch && (
                            <div style={{ color: 'red', position: 'relative', padding: '12px 0' }}>
                                <span style={{ position: 'absolute', top: '-9px', left: '3px' }}>
                                    {translate.formatMessage(message.reminderMessage)}
                                </span>
                            </div>
                        )}
                        <BaseTable
                            onChange={mixinFuncs.changePagination}
                            columns={columns}
                            dataSource={roleId && !loading ? data : null}
                            loading={loading}
                            pagination={pagination}
                        />
                    </div>
                }
            ></ListPage>
        </PageWrapper>
    );
};

export default CompanySeekDevListPage;
