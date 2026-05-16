import { getAllCourses, getCourseById } from '../../models/catalog/catalog.js';

const catalogPage = (req, res) => {
    res.render('catalog', {
        title: 'Course Catalog',
        courses: getAllCourses(),
        page: 'catalog'
    });
};

const courseDetailPage = (req, res, next) => {
    const courseId = req.params.courseId;
    const course = getCourseById(courseId);

    if (!course) {
        const err = new Error('Course not found');
        err.status = 404;
        return next(err);
    }

    res.render('course-detail', {
        title: `${course.id} - ${course.title}`,
        course,
        currentSort: req.query.sort || 'time',
        page: 'catalog'
    });
};

export { catalogPage, courseDetailPage };