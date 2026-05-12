import { getFacultyById, getSortedFaculty } from '../../models/faculty/faculty.js';

const facultyListPage = (req, res) => {
    const sortBy = req.query.sort || 'name';

    res.render('faculty/list', {
        title: 'Faculty Directory',
        faculty: getSortedFaculty(sortBy),
        currentSort: sortBy
    });
};

const facultyDetailPage = (req, res) => {
    const facultyId = req.params.facultyId;
    const facultyMember = getFacultyById(facultyId);

    if (!facultyMember) {
        return res.status(404).render('errors/404', {
            title: 'Faculty Not Found'
        });
    }

    res.render('faculty/detail', {
        title: facultyMember.name,
        faculty: facultyMember
    });
};

export { facultyListPage, facultyDetailPage };