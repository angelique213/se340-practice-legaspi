const courses = {
    CSE310: {
        id: 'CSE310',
        title: 'Applied Programming',
        description: 'A course focused on building software projects and demonstrating programming skills.',
        credits: 2,
        sections: [
            { time: 'Online', room: 'Online', professor: 'Brother Jeremiah Pineda' }
        ]
    },
    ITM350: {
        id: 'ITM350',
        title: 'DevOps',
        description: 'A course about development operations, cloud tools, automation, and deployment practices.',
        credits: 3,
        sections: [
            { time: 'Online', room: 'Online', professor: 'Brother Blaine Hamilton' }
        ]
    },
    CSE212: {
        id: 'CSE212',
        title: 'Programming with Data Structures',
        description: 'A course about data structures, problem solving, and efficient programming.',
        credits: 2,
        sections: [
            { time: 'Online', room: 'Online', professor: 'Brother Zachariah J. Alvey' }
        ]
    },
    CSE340: {
        id: 'CSE340',
        title: 'Web Backend Development',
        description: 'A course focused on backend web development using Express, routes, EJS, and server-side concepts.',
        credits: 3,
        sections: [
            { time: 'Online', room: 'Online', professor: 'Brother Ammon Shepherd' }
        ]
    }
};

const getAllCourses = () => {
    return courses;
};

const getCourseById = (courseId) => {
    return courses[courseId] || null;
};

export { getAllCourses, getCourseById };