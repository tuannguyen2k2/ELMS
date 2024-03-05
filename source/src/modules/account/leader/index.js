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
import { SalaryOptions, settingKeyName, statusOptions } from '@constants/masterData';
import { useNavigate } from 'react-router-dom';
import routes from '@routes';
import { IconClipboardText, IconSchool } from '@tabler/icons-react';
import FolderIcon, { CourseIcon } from '@assets/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import styles from './leader.module.scss';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import { formatMoney } from '@utils';
import { settingSystemSelector } from '@selectors/app';
import { useSelector } from 'react-redux';
import useMoneyUnit from '@hooks/useMoneyUnit';

const message = defineMessages({
    objectName: 'Leader',
});

const LeaderListPage = () => {
    const navigate = useNavigate();
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const salaryValues = translate.formatKeys(SalaryOptions, ['label']);
    const moneyUnit = useMoneyUnit();
    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
        apiConfig: apiConfig.leader,
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
                course: ({ id, leaderName }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.course)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            className={styles.verticalCenter}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(routes.leaderCourseListPage.path + `?leaderId=${id}&leaderName=${leaderName}`);
                            }}
                        >
                            <CourseIcon />
                        </Button>
                    </BaseTooltip>
                ),

                project: ({ id, leaderName }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.project)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            className={styles.verticalCenter}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                    routes.leaderProjectListPage.path + `?leaderId=${id}&leaderName=${leaderName}`,
                                );
                            }}
                        >
                            <FolderIcon />
                        </Button>
                    </BaseTooltip>
                ),
            });
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
            title: <FormattedMessage defaultMessage="Họ và tên" />,
            dataIndex: 'leaderName',
        },

        {
            title: <FormattedMessage defaultMessage="Email" />,
            dataIndex: 'email',
            width: '200px',
        },
        {
            title: <FormattedMessage defaultMessage="Tiền lương" />,
            dataIndex: 'salary',
            width: 150,
            align: 'center',
            render: (price) => {
                const formattedValue = formatMoney(price, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: moneyUnit,
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: 'Loại lương',
            dataIndex: 'salaryKind',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = salaryValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        {
            title: <FormattedMessage defaultMessage="Số điện thoại" />,
            dataIndex: 'phone',
            width: '120px',
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ course: true, project: true, edit: true, delete: true }, { width: '170px' }),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.name),
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
                { breadcrumbName: translate.formatMessage(commonMessage.leader) },
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
export default LeaderListPage;
