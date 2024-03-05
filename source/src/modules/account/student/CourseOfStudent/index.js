import ListPage from '@components/common/layout/ListPage';
import React from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DATE_DISPLAY_FORMAT, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages, FormattedMessage } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { TeamOutlined, BookOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import { useNavigate, generatePath, useParams, useLocation } from 'react-router-dom';
import route from '@modules/task/routes';
import { convertDateTimeToString } from '@utils/dayHelper';
import { formSize, lectureState, statusOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import routes from '@routes';
import { DATE_FORMAT_DISPLAY } from '@constants';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { commonMessage } from '@locales/intl';
import styles from '../student.module.scss';
const message = defineMessages({
    objectName: 'course',
});

const CourseListPage = () => {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const paramid = useParams();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const stuId = queryParameters.get('studentId');
    const studentName = queryParameters.get('studentName');
    const leaderName = queryParameters.get('leaderName');
    const stateValues = translate.formatKeys(lectureState, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: {
            // getList : apiConfig.student.getAllCourse,
            getList: apiConfig.registration.getList,
            delete: apiConfig.registration.delete,
            update: apiConfig.course.update,
            getById: apiConfig.course.getById,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            // funcs.prepareGetListPathParams = () => {
            //     return {
            //         // id: stuId,
            //         id : paramid.id,
            //     };
            // };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?studentId=${stuId}`;
            };
            funcs.additionalActionColumnButtons = () => ({
                registration: ({ id, name, state }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.registration)}>
                        <Button
                            type="link"
                            disabled={state === 1}
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                state !== 1 &&
                                    navigate(
                                        routes.registrationListPage.path +
                                            `?courseId=${id}&courseName=${name}&courseState=${state}`,
                                    );
                            }}
                        >
                            <TeamOutlined />
                        </Button>
                    </BaseTooltip>
                ),

                task: ({ id, name, subject, state }) => (
                    <BaseTooltip placement="bottom" title={translate.formatMessage(commonMessage.task)}>
                        <Button
                            type="link"
                            disabled={state === 1 || state === 5}
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                const path =
                                    (leaderName ? routes.leaderCourseTaskListPage.path : routes.taskListPage.path) +
                                    `?courseId=${id}&courseName=${name}&subjectId=${subject.id}&state=${state}` +
                                    (leaderName ? `&leaderName=${leaderName}` : '');
                                state !== 1 && state !== 5 && navigate(path, { state: { pathPrev: location.search } });
                            }}
                        >
                            <BookOutlined />
                        </Button>
                    </BaseTooltip>
                ),
            });
        },
    });

    const setBreadRoutes = () => {
        const breadRoutes = [];
        if (leaderName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.leader),
                path: routes.leaderListPage.path,
            });
        } else if (studentName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.student),
                path: routes.studentListPage.path,
            });
        }
        breadRoutes.push({ breadcrumbName: translate.formatMessage(commonMessage.course) });

        return breadRoutes;
    };
    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.name),
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
        },
        // {
        //     key: 'status',
        //     placeholder: translate.formatMessage(commonMessage.status),
        //     type: FieldTypes.SELECT,
        //     options: statusValues,
        // },
    ];
    const columns = [
        {
            title: translate.formatMessage(commonMessage.name),
            dataIndex: ['courseInfo', 'name'],
        },
        {
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: 'createdDate',
            width: 150,
            render: (createdDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(createdDate, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
                    </div>
                );
            },
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.state),
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        mixinFuncs.renderActionColumn({ delete: true }, { width: '120px' }),
    ];

    return (
        <PageWrapper routes={setBreadRoutes()}>
            <div>
                <ListPage
                    title={<span style={{ fontWeight: 'normal', fontSize: '18px' }}>{studentName}</span>}
                    searchForm={mixinFuncs.renderSearchForm({
                        fields: searchFields,
                        initialValues: queryFilter,
                        className: styles.search,
                    })}
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
            </div>
        </PageWrapper>
    );
};

export default CourseListPage;
