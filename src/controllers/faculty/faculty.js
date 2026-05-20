import { getFacultyBySlug, getSortedFaculty } from '../../models/faculty/faculty.js';

const facultyListPage = async (req, res) => {
    const sortBy = req.query.sort || 'name';

    const faculty = await getSortedFaculty(sortBy);

    res.render('faculty/list', {
        title: 'Faculty Directory',
        faculty,
        currentSort: sortBy
    });
};

const facultyDetailPage = async (req, res, next) => {
    const facultySlug = req.params.slugId;

    const facultyMember = await getFacultyBySlug(facultySlug);

    if (Object.keys(facultyMember).length === 0) {
        const err = new Error(`Faculty ${facultySlug} not found`);
        err.status = 404;
        return next(err);
    }

    res.render('faculty/detail', {
        title: facultyMember.name,
        faculty: facultyMember
    });
};

export { facultyListPage, facultyDetailPage };