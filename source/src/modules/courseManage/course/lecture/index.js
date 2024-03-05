import ListPage from '@components/common/layout/ListPage';
import React, { useState, useEffect } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { defineMessages } from 'react-intl';
import routes from '../routes';
import { Button, Modal, Radio } from 'antd';
import AsignAllForm from './asignAllForm';
import useFetch from '@hooks/useFetch';
import BaseTable from '@components/common/table/BaseTable';
import useDragDrop from '@hooks/useDragDrop';
import styles from './AsignAll.module.scss';
import { commonMessage } from '@locales/intl';
import { useLocation } from 'react-router';
const message = defineMessages({
    objectName: 'Bài giảng',
    asignAllModal: 'Tạo task',
});
const LectureListPage = ({ breadcrumbName }) => {
    const translate = useTranslate();
    const location = useLocation();
    const state = location.state.prevPath;
    const paramHead = routes.courseListPage.path;
    const queryParameters = new URLSearchParams(window.location.search);
    const search = location.search;
    const courseId = queryParameters.get("courseId");
    const courseName = queryParameters.get("courseName");
    const subjectId = queryParameters.get("subjectId");


    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [lectureid, setLectureId] = useState(null);
    const [checkAsign, SetCheckAsign] = useState([]);
    const [asignAll, SetAsignAll] = useState([]);
    const [visible, setVisible] = useState(true);

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: {
            getList: apiConfig.lecture.getBySubject,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareGetListPathParams = () => {
                return {
                    subjectId: subjectId,
                };
            };
            funcs.mappingData = (response) => {
                try {
                    if (response.result === true) {
                        SetAsignAll(response.data.content);
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

    const mapArray2ById = new Map(asignAll?.map((item) => [item.id, item]));
    const mergedArray = checkAsign.map((item1) => {
        const item2 = mapArray2ById.get(item1.id);
        if (item2) {
            return {
                ...item2,
                status: item1.status,
            };
        }
        return item1;
    });

    for (var i = 0; i < mergedArray.length; i++) {
        if (mergedArray[i].lectureKind == 1) {
            for (var j = i + 1; j < mergedArray.length; j++) {
                if (mergedArray[j].lectureKind != 1) {
                    mergedArray[i].status = true;
                    if (mergedArray[j].status !== false) {
                        continue;
                    }
                    else {
                        mergedArray[i].status = false;
                        break;
                    }
                }
                else break;
            }
        }
    }

    const onSelectChange = (record) => {
        setLectureId(record.id);
    };

    const { sortedData } = useDragDrop({
        data,
        apiConfig: apiConfig.lecture.updateSort,
        setTableLoading: () => { },
        indexField: 'ordering',
    });

    const columns = [
        {
            title: '',
            dataIndex: 'id',
            key: 'id',
            width: '30px',
            render: (text, record, index) => {
                const checkAsignItem = mergedArray.find(item => item.id === record.id);
                const isDisabled = checkAsignItem ? checkAsignItem.status : false;
                if (record.lectureKind === 1 || isDisabled) {
                    return null;
                }
                else {
                    return (
                        <Radio
                            checked={lectureid && lectureid === record.id}
                            onChange={() => onSelectChange(record)}
                        />
                    );
                }

            },
        },
        {
            title: translate.formatMessage(commonMessage.lectureName),
            dataIndex: 'lectureName',
            render: (lectureName, record) => {
                let styles;
                if (record?.lectureKind === 2) {
                    styles = {
                        paddingLeft: '30px',
                    };
                }
                else {
                    styles = {
                        textTransform: 'uppercase',
                        fontWeight: 700,
                    };
                }
                return <div style={styles}>{lectureName}</div>;
            },
        },
        {
            title: '',
            dataIndex: 'id',
            key: 'id',
            width: '30px',
            render: (text, record, index) => {
                const checkAsignItem = mergedArray.find(item => item.id === record.id);
                const isDisabled = checkAsignItem ? checkAsignItem.status : false;
                if (record.lectureKind === 1 && isDisabled) {
                    return (
                        <CheckCircleOutlined className={styles.greenCheckIcon} />
                    );
                }
                else if (isDisabled) {
                    return (
                        <CheckCircleOutlined className={styles.greenCheckIcon} />
                    );
                }

            },
        },
    ];




    const disabledSubmit = lectureid === null;

    const { execute: executeCheckAsign } = useFetch(apiConfig.task.checkAsign, { immediate: false });
    useEffect(() => {
        if (data?.length > 0) {
            const ids = data?.map(item => item.id);
            if (ids.length > 0) {
                executeCheckAsign({
                    data: {
                        courseId: courseId,
                        lectureIds: ids,
                    },
                    onCompleted: (response) => {
                        if (response.result === true) {
                            SetCheckAsign(response.data);
                        }
                    },
                    onError: (err) => {
                    },
                });
            }
        }
    }, [data, executeCheckAsign]);

    const rowClassName = (record) => {
        const checkAsignItem = checkAsign.find(item => item.id === record.id);
        const isDisabled = checkAsignItem ? checkAsignItem.status : false;
        if (isDisabled) {
            return styles.customRow;
        }
        return '';
    };

    useEffect(() => {
        if (hasError) {
            setShowPreviewModal(false); // Đóng modal
            // setHasError(false); // Đặt lại hasError sau một khoảng thời gian (ví dụ: sau 1 giây)
            setTimeout(() => {
                setHasError(false); // Đặt lại hasError sau một khoảng thời gian (ví dụ: sau 1 giây)
            }, 2500); // Đặt thời gian dựa trên nhu cầu của bạn
        }
    }, [hasError]);
    return (

        <PageWrapper
            routes={breadcrumbName ? breadcrumbName :
                [
                    {
                        breadcrumbName: translate.formatMessage(commonMessage.course),
                        path: routes.courseListPage.path,
                    },
                    {
                        breadcrumbName: translate.formatMessage(commonMessage.task),
                        path: routes.courseListPage.path + `/task${search}`,
                    },
                    { breadcrumbName: translate.formatMessage(message.objectName) },
                ]}
        >
            <ListPage

                style={{ width: '50vw' }}
                actionBar={
                    <div style={{ float: 'right', margin: '0 0 32px 0' }}>
                        <Button
                            type="primary"
                            disabled={disabledSubmit}
                            onClick={() => setShowPreviewModal(true)} >
                            {translate.formatMessage(commonMessage.asignAll)}
                        </Button>
                    </div>
                }
                baseTable={
                    <>
                        <BaseTable
                            rowClassName={rowClassName}
                            onChange={changePagination}
                            loading={loading}
                            dataSource={sortedData}
                            columns={columns}
                            onRow={(record) => ({
                                onClick: () => {
                                    if (record.lectureKind === 2) {
                                        onSelectChange(record);
                                    }
                                },
                            })}
                        />
                    </>
                }
            />
            <Modal
                title={translate.formatMessage(message.asignAllModal)}
                width={600}
                open={showPreviewModal && !hasError}
                footer={null}
                centered
                lectureId={lectureid}
                onCancel={() => setShowPreviewModal(false)}
                maskClosable={false}
            >
                <AsignAllForm
                    onCancel={() => setShowPreviewModal(false)}
                    courseId={courseId}
                    lectureId={lectureid}
                    setHasError={setHasError}
                />
            </Modal>

            {hasError &&
                <Modal
                    title={
                        <span>
                            <ExclamationCircleOutlined style={{ color: 'red' }} /> Lỗi
                        </span>
                    }
                    open={visible}
                    onOk={() => setVisible(false)}
                    onCancel={() => setVisible(false)}>
                    <p>Chưa có sinh viên hoặc có sinh viên chưa hoàn tất thủ tục, vui lòng kiểm tra lại</p>
                </Modal>
            }
        </PageWrapper>
    );
};

export default LectureListPage;
