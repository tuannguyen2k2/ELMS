import { UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import {} from '@constants';
import apiConfig from '@constants/apiConfig';
import { stateResgistrationOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { formatMoney } from '@utils';
import { Tag } from 'antd';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useLocation } from 'react-router-dom';
import routes from '../routes';
import dayjs from 'dayjs';
import { projectTaskState, statusOptions, registrationMoneyKind } from '@constants/masterData';
import { commonMessage } from '@locales/intl';
import {
    AppConstants,
    DATE_DISPLAY_FORMAT,
    DATE_FORMAT_DISPLAY,
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
} from '@constants';
import useMoneyUnit from '@hooks/useMoneyUnit';
const message = defineMessages({
    objectName: 'Lịch sử trả phí',
    registration: 'Danh sách sinh viên đăng kí khóa học',
    money: ' Số tiền',
    kind: 'Loại tiền',
    history: ' Lịch sử trả phí',
});

function RegistrationMoneyListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const stateRegistration = translate.formatKeys(stateResgistrationOptions, ['label']);
    const registrationMoneyKindValues = translate.formatKeys(registrationMoneyKind, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const courseState = queryParameters.get('courseState');
    const courseStatus = queryParameters.get('courseStatus');
    // const courseStatus = queryParameters.get('courseStatus');
    //  const courseStatus = queryParameters.get('courseStatus');
    const registrationId = queryParameters.get('registrationId');
    const moneyUnit = useMoneyUnit();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.registrationMoney,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
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
                return `${pagePath}/create?registrationId=${registrationId}&courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?registrationId=${registrationId}&courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`;
            };
        },
    });
    const columns = [
        {
            title: '#',
            dataIndex: ['registrationInfo', 'studentInfo', 'avatar'],
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
            title: translate.formatMessage(commonMessage.studentName),
            dataIndex: ['registrationInfo', 'studentInfo', 'fullName'],
        },

        {
            title: translate.formatMessage(message.money),
            dataIndex: 'money',
            align: 'right',

            render: (price) => {
                const formattedValue = formatMoney(price, {
                    currentcy: moneyUnit,
                    currentDecimal: '0',
                    groupSeparator: ',',
                });
                return <div>{formattedValue}</div>;
            },
            width: 130,
        },
        {
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: 'createdDate',
            render: (createdDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(createdDate, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
                    </div>
                );
            },
            width: 130,
            align: 'center',
        },

        {
            title: translate.formatMessage(message.kind),
            dataIndex: 'kind',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = registrationMoneyKindValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },

        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: 110 }),
    ];

    const searchFields = [
        {
            key: 'id',
            placeholder: translate.formatMessage(commonMessage.studentName),
        },
    ];

    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.course),
                    path: '/course',
                },
                {
                    breadcrumbName: translate.formatMessage(message.registration),
                    path:
                        routes.registrationListPage.path +
                        `?registrationId=${registrationId}&courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`,
                },
                { breadcrumbName: translate.formatMessage(message.money) },
            ]}
        >
            <ListPage
                title={
                    <span
                        style={
                            courseState != 5
                                ? { fontWeight: 'normal', fontSize: '16px' }
                                : { fontWeight: 'normal', fontSize: '16px', position: 'absolute' }
                        }
                    >
                        {courseName}
                    </span>
                }
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
}

export default RegistrationMoneyListPage;
