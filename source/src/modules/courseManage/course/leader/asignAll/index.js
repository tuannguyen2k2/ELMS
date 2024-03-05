import React from 'react';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import routes from '@routes';
import LectureListPage from '@modules/courseManage/course/lecture';
import { useParams,useLocation } from 'react-router-dom';

const message = defineMessages({
    objectName: 'Bài giảng',
    home: 'Trang chủ',
    student: 'Học viên',
    course: 'Khoá học',
    lectureName: 'Tên bài giảng',
    asignAll: 'Tạo task',
    task:'Task',
    asignAllModal: 'Tạo task',
});
const AsignAllListPage = () => {
    const location =useLocation();
    const search = location.search;
    const state = location.state.prevPath;
    const paramHead = routes.courseLeaderListPage.path;
    return (
        <LectureListPage breadcrumbName={routes.lectureTaskListPage.breadcrumbs(message,paramHead,state,search)}/>
    );
};

export default AsignAllListPage;
