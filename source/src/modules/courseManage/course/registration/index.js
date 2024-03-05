import { UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import DragDropTableV2 from '@components/common/table/DragDropTableV2';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { stateResgistrationOptions, statusOptions } from '@constants/masterData';
import useDrapDropTableItem from '@hooks/useDrapDropTableItem';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Avatar, Button, Tag } from 'antd';
import React from 'react';
import { Link, generatePath, useLocation, useParams } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { defineMessages } from 'react-intl';
import { date } from 'yup/lib/locale';
import BaseTable from '@components/common/table/BaseTable';
import { CheckCircleOutlined, DollarOutlined } from '@ant-design/icons';
import style from './Registration.module.scss';
import { useNavigate } from 'react-router-dom';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import routers from './routes';
import ScheduleFile from '@components/common/elements/ScheduleFile';
import { commonMessage } from '@locales/intl';

const message = defineMessages({
    objectName: 'Đăng kí khoá học',
    registration: 'Danh sách sinh viên đăng kí khóa học',
    money: 'Thanh Toán',
});

function RegistrationListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const location = useLocation();
    const stateRegistration = translate.formatKeys(stateResgistrationOptions, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const courseState = queryParameters.get('courseState');
    const courseStatus = queryParameters.get('courseStatus');
    localStorage.setItem('pathPrev', location.search);
    const navigate = useNavigate();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.registration,
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
                return `${pagePath}/create?courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`;
            };

            funcs.additionalActionColumnButtons = () => ({
                money: ({ id, name, status }) => (
                    <BaseTooltip title={translate.formatMessage(message.money)}>
                        <Button
                            type="link"
                            style={{ padding: '0' }}
                            disabled={status === -1}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                    routes.registrationMoneyListPage.path +
                                        `?registrationId=${id}&projectName=${name}&courseId=${courseId}&courseName=${courseName}&courseState=${courseState}&courseStatus=${courseStatus}`,
                                );
                            }}
                        >
                            <DollarOutlined />
                        </Button>
                    </BaseTooltip>
                ),
            });
        },
    });
    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(
            routes.studentActivityCourseListPage.path +
                `?courseId=${record?.courseInfo?.id}&studentId=${record?.studentInfo?.id}&studentName=${record?.studentInfo?.fullName}`,
        );
    };

    const columns = [
        {
            title: translate.formatMessage(commonMessage.studentName),
            dataIndex: ['studentInfo', 'fullName'],
            render: (fullName, record) => (
                <div onClick={(event) => handleOnClick(event, record)} className={style.customDiv}>
                    {fullName}
                </div>
            ),
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
        {
            title: translate.formatMessage(commonMessage.state),
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateRegistration.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        courseStatus == 1 && mixinFuncs.renderActionColumn({ money: true, edit: true, delete: true }, { width: 180 }),
    ].filter(Boolean);

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
                { breadcrumbName: translate.formatMessage(message.registration) },
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
                actionBar={courseState == 5 && courseStatus == 1 && mixinFuncs.renderActionBar()}
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

export default RegistrationListPage;
