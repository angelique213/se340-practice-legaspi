import { getAllCourses, getCourseBySlug } from '../../models/catalog/courses.js';
import { getSectionsByCourseSlug } from '../../models/catalog/catalog.js';

/**
 * Render the catalog list page
 */
const catalogPage = async (req, res) => {

    // Get all available courses
    const courses = await getAllCourses();

    // Render catalog list view
    res.render('catalog/list', {
        title: 'Course Catalog',
        courses
    });
};

/**
 * Render individual course detail page
 */
const courseDetailPage = async (req, res, next) => {

    // Get course slug from URL
    const courseSlug = req.params.slugId;

    // Find matching course
    const course = await getCourseBySlug(courseSlug);

    // Handle missing course
    if (Object.keys(course).length === 0) {
        const err = new Error(`Course ${courseSlug} not found`);
        err.status = 404;
        return next(err);
    }

    // Get sorting option from query string
    const sortBy = req.query.sort || 'time';

    // Get all sections for the course
    const sections = await getSectionsByCourseSlug(courseSlug, sortBy);

    // Render catalog detail view
    res.render('catalog/detail', {
        title: `${course.courseCode} - ${course.name}`,
        course,
        sections,
        currentSort: sortBy
    });
};

export { catalogPage, courseDetailPage };