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
import style from '@modules/courseManage/course/registration/Registration.module.scss';
import { useNavigate } from 'react-router-dom';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { commonMessage } from '@locales/intl';
import styles from './registrationLeader.module.scss';
import ScheduleFile from '@components/common/elements/ScheduleFile';
const message = defineMessages({
    objectName: 'Đăng kí khoá học',
    createDate: 'Ngày đăng kí',
    isIntern: 'Đăng kí thực tập',
});

function RegistrationLeaderListPage() {
    const translate = useTranslate();
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
        },
    });
    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(
            routes.studentActivityCourseLeaderListPage.path +
                `?courseId=${record?.courseInfo?.id}&studentId=${record?.studentInfo?.id}&studentName=${record?.studentInfo?.fullName}`,
        );
    };
    const setColumns = () => {
        const columns = [
            {
                title: translate.formatMessage(commonMessage.studentName),
                dataIndex: ['studentInfo', 'fullName'],
                render: (fullName, record) => (
                    <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
                        {fullName}
                    </div>
                ),
            },
            {
                title: 'Lịch trình',
                dataIndex: 'schedule',
                render: (schedule) => {
                    return <ScheduleFile schedule={schedule} />;
                },
                width: 140,
            },
            {
                title: translate.formatMessage(message.isIntern),
                dataIndex: 'isIntern',
                align: 'center',
                width: 150,
                render: (item) => {
                    if (item == 0) {
                        return null;
                    } else {
                        return <CheckCircleOutlined className={style.greenCheckIcon} />;
                    }
                },
            },
            {
                title: translate.formatMessage(message.createDate),
                dataIndex: 'createdDate',
                align: 'center',
                width: 170,
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
        ];

        return columns;
    };

    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.course),
                    path: routes.courseLeaderListPage.path,
                },
                { breadcrumbName: translate.formatMessage(commonMessage.member) },
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
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={setColumns()}
                    />
                }
            />
        </PageWrapper>
    );
}

export default RegistrationLeaderListPage;
