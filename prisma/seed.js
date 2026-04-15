import bcrypt from 'bcrypt';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
  log: ['warn', 'error'],
});

async function main() {
  console.log('🌱 Starting comprehensive ESF10 seed...');

  /* ============================
     SYSTEM SETTINGS
  ============================ */
  console.log('📝 Seeding system settings...');
  
  const systemSettings = [
    { key: 'school_name', value: 'Bagong Pag-asa National High School' },
    { key: 'school_id', value: '305432' },
    { key: 'school_address', value: 'Purok 3, Brgy. Bagong Pag-asa, Quezon City, Metro Manila' },
    { key: 'school_district', value: 'Quezon City Division' },
    { key: 'school_region', value: 'NCR - National Capital Region' },
    { key: 'school_principal', value: 'Dr. Maria Santos Cruz' },
    { key: 'grading_system', value: 'K12' },
    { key: 'passing_grade', value: '75' },
    { key: 'highest_grade', value: '100' },
    { key: 'lowest_grade', value: '60' },
  ];

  for (const setting of systemSettings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  /* ============================
     ALL PERMISSIONS
  ============================ */
  console.log('🔐 Seeding permissions...');

  const permissions = [
    'user.create', 'user.view', 'user.update', 'user.delete', 'user.assign-role',
    'role.create', 'role.view', 'role.update', 'role.delete', 'role.assign-permissions',
    'permission.view',
    'student.create', 'student.update', 'student.view', 'student.search', 'student.archive',
    'enrollment.create', 'enrollment.update', 'enrollment.view',
    'curriculum.create', 'curriculum.update', 'curriculum.view',
    'curriculum_version.create', 'curriculum_version.update', 'curriculum_version.view',
    'subject.create', 'subject.update', 'subject.view',
    'section.view', 'section.create', 'section.update', 'section.delete',
    'grade_level.view', 'grade_level.create', 'grade_level.update',
    'grades.create', 'grades.update', 'grades.view',
    'document.upload', 'document.view', 'document.delete',
    'sf10.generate', 'sf10.view', 'sf10.export', 'report.view', 'report.export',
    'system.view', 'system.update',
    'school-year.create', 'school-year.view', 'school-year.update', 'school-year.delete',
    'audit.view', 'audit.export',
  ];

  // Batch create permissions
  for (const code of permissions) {
    await prisma.permission.upsert({
      where: { code },
      update: {},
      create: {
        code,
        description: code.replace(/[.-]/g, ' ').toUpperCase(),
      },
    });
  }

  const permissionRecords = await prisma.permission.findMany();

  /* ============================
     ROLES
  ============================ */
  console.log('👥 Seeding roles...');

  const SUPER_ADMIN = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: { name: 'SUPER_ADMIN', description: 'Full system access' },
  });

  const REGISTRAR = await prisma.role.upsert({
    where: { name: 'REGISTRAR' },
    update: {},
    create: { name: 'REGISTRAR', description: 'Student, enrollment, and SF10 management' },
  });

  const TEACHER = await prisma.role.upsert({
    where: { name: 'TEACHER' },
    update: {},
    create: { name: 'TEACHER', description: 'Grade encoding and class management' },
  });

  const VIEWER = await prisma.role.upsert({
    where: { name: 'VIEWER' },
    update: {},
    create: { name: 'VIEWER', description: 'Read-only access' },
  });

  /* ============================
     ROLE PERMISSIONS (Batched)
  ============================ */
  console.log('🔗 Assigning role permissions...');

  // Clear existing role permissions first, then batch insert
  await prisma.rolePermission.deleteMany({});

  // Super Admin gets all permissions
  const superAdminPerms = permissionRecords.map(p => ({
    roleId: SUPER_ADMIN.id,
    permissionId: p.id,
  }));

  // Registrar permissions
  const registrarCodes = [
    'student.create', 'student.update', 'student.view', 'student.search', 'student.archive',
    'enrollment.create', 'enrollment.update', 'enrollment.view',
    'document.upload', 'document.view',
    'sf10.generate', 'sf10.view', 'sf10.export', 'report.view', 'report.export',
    'section.view', 'grade_level.view', 'curriculum.view', 'curriculum_version.view', 'subject.view',
    'school-year.view', 'grades.view',
  ];
  const registrarPerms = permissionRecords
    .filter(p => registrarCodes.includes(p.code))
    .map(p => ({ roleId: REGISTRAR.id, permissionId: p.id }));

  // Teacher permissions
  const teacherCodes = [
    'student.view', 'student.search', 'enrollment.view',
    'grades.create', 'grades.update', 'grades.view',
    'section.view', 'grade_level.view', 'subject.view', 'school-year.view',
  ];
  const teacherPerms = permissionRecords
    .filter(p => teacherCodes.includes(p.code))
    .map(p => ({ roleId: TEACHER.id, permissionId: p.id }));

  // Viewer permissions
  const viewerCodes = [
    'student.view', 'student.search', 'enrollment.view',
    'grades.view', 'sf10.view', 'report.view',
  ];
  const viewerPerms = permissionRecords
    .filter(p => viewerCodes.includes(p.code))
    .map(p => ({ roleId: VIEWER.id, permissionId: p.id }));

  // Batch insert all role permissions
  await prisma.rolePermission.createMany({
    data: [...superAdminPerms, ...registrarPerms, ...teacherPerms, ...viewerPerms],
    skipDuplicates: true,
  });

  /* ============================
     USERS (Teachers and Staff)
  ============================ */
  console.log('👤 Seeding users...');

  const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

  const users = [
    { email: 'admin@bpnhs.edu.ph', fullName: 'Juan Dela Cruz', password: 'admin123', role: SUPER_ADMIN },
    { email: 'registrar@bpnhs.edu.ph', fullName: 'Ana Maria Reyes', password: 'registrar123', role: REGISTRAR },
    { email: 'mrodriguez@bpnhs.edu.ph', fullName: 'Michael Rodriguez', password: 'teacher123', role: TEACHER },
    { email: 'lgonzales@bpnhs.edu.ph', fullName: 'Lorna Gonzales', password: 'teacher123', role: TEACHER },
    { email: 'rvillanueva@bpnhs.edu.ph', fullName: 'Roberto Villanueva', password: 'teacher123', role: TEACHER },
    { email: 'cmanalo@bpnhs.edu.ph', fullName: 'Carla Manalo', password: 'teacher123', role: TEACHER },
    { email: 'jbautista@bpnhs.edu.ph', fullName: 'Joel Bautista', password: 'teacher123', role: TEACHER },
    { email: 'mcastro@bpnhs.edu.ph', fullName: 'Maria Elena Castro', password: 'teacher123', role: TEACHER },
    { email: 'viewer@bpnhs.edu.ph', fullName: 'Guest Viewer', password: 'viewer123', role: VIEWER },
  ];

  const createdUsers = [];
  const userRolesData = [];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, SALT_ROUNDS);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, password: hashed, fullName: u.fullName, isActive: true },
    });
    createdUsers.push({ ...user, roleName: u.role.name });
    userRolesData.push({ userId: user.id, roleId: u.role.id });
  }

  // Batch insert user roles
  await prisma.userRole.createMany({
    data: userRolesData,
    skipDuplicates: true,
  });

  /* ============================
     SCHOOL YEARS
  ============================ */
  console.log('📅 Seeding school years...');

  // Reset active status first
  await prisma.schoolYear.updateMany({ data: { isActive: false } });

  const sy2324 = await prisma.schoolYear.upsert({
    where: { year: '2023-2024' },
    update: { isActive: false },
    create: { year: '2023-2024', isActive: false },
  });

  const sy2425 = await prisma.schoolYear.upsert({
    where: { year: '2024-2025' },
    update: { isActive: false },
    create: { year: '2024-2025', isActive: false },
  });

  const sy2526 = await prisma.schoolYear.upsert({
    where: { year: '2025-2026' },
    update: { isActive: true },
    create: { year: '2025-2026', isActive: true },
  });

  const createdSchoolYears = {
    '2023-2024': sy2324,
    '2024-2025': sy2425,
    '2025-2026': sy2526,
  };

  /* ============================
     GRADE LEVELS (K-12 Philippines)
  ============================ */
  console.log('📊 Seeding grade levels...');

  const gradeLevels = [
    { code: 'G7', name: 'Grade 7', order: 7 },
    { code: 'G8', name: 'Grade 8', order: 8 },
    { code: 'G9', name: 'Grade 9', order: 9 },
    { code: 'G10', name: 'Grade 10', order: 10 },
    { code: 'G11', name: 'Grade 11', order: 11 },
    { code: 'G12', name: 'Grade 12', order: 12 },
  ];

  const createdGradeLevels = {};
  for (const gl of gradeLevels) {
    const created = await prisma.gradeLevel.upsert({
      where: { code: gl.code },
      update: { name: gl.name, order: gl.order },
      create: { ...gl, isActive: true },
    });
    createdGradeLevels[gl.code] = created;
  }

  /* ============================
     CURRICULUM & VERSIONS
  ============================ */
  console.log('📚 Seeding curriculum...');

  const curriculum = await prisma.curriculum.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'K to 12 Basic Education Curriculum' },
  });

  const curriculumVersion = await prisma.curriculumVersion.upsert({
    where: { id: 1 },
    update: {},
    create: {
      curriculumId: curriculum.id,
      name: 'K-12 BEC 2016 (Enhanced)',
      effectiveFrom: 2016,
      effectiveTo: null,
    },
  });

  /* ============================
     SUBJECTS (Philippine K-12)
  ============================ */
  console.log('📖 Seeding subjects...');

  const juniorHighSubjects = [
    { code: 'FIL', name: 'Filipino', order: 1 },
    { code: 'ENG', name: 'English', order: 2 },
    { code: 'MATH', name: 'Mathematics', order: 3 },
    { code: 'SCI', name: 'Science', order: 4 },
    { code: 'AP', name: 'Araling Panlipunan', order: 5 },
    { code: 'ESP', name: 'Edukasyon sa Pagpapakatao', order: 6 },
    { code: 'TLE', name: 'Technology and Livelihood Education', order: 7 },
    { code: 'MAPEH', name: 'MAPEH (Music, Arts, PE, Health)', order: 8 },
  ];

  const seniorHighSubjects = [
    { code: 'OC', name: 'Oral Communication', order: 1 },
    { code: 'RWS', name: 'Reading and Writing Skills', order: 2 },
    { code: 'KP', name: 'Komunikasyon at Pananaliksik sa Wika', order: 3 },
    { code: 'PNB', name: 'Pagbasa at Pagsusuri ng Ibat Ibang Teksto', order: 4 },
    { code: '21CL', name: '21st Century Literature from the PH and the World', order: 5 },
    { code: 'CPAR', name: 'Contemporary Philippine Arts from the Regions', order: 6 },
    { code: 'MIL', name: 'Media and Information Literacy', order: 7 },
    { code: 'GM', name: 'General Mathematics', order: 8 },
    { code: 'STATS', name: 'Statistics and Probability', order: 9 },
    { code: 'ELS', name: 'Earth and Life Science', order: 10 },
    { code: 'PS', name: 'Physical Science', order: 11 },
    { code: 'PE1', name: 'Physical Education and Health 1', order: 12 },
    { code: 'PE2', name: 'Physical Education and Health 2', order: 13 },
    { code: 'PERDEV', name: 'Personal Development', order: 14 },
    { code: 'UCSP', name: 'Understanding Culture, Society, and Politics', order: 15 },
    { code: 'IP', name: 'Introduction to Philosophy of the Human Person', order: 16 },
    { code: 'PR1', name: 'Practical Research 1', order: 17 },
    { code: 'PR2', name: 'Practical Research 2', order: 18 },
    { code: 'EAPP', name: 'English for Academic and Professional Purposes', order: 19 },
    { code: 'FPH', name: 'Filipino sa Piling Larangan', order: 20 },
    { code: 'EMP', name: 'Empowerment Technologies', order: 21 },
    { code: 'ENTRE', name: 'Entrepreneurship', order: 22 },
    { code: 'INQ', name: 'Inquiries, Investigations, and Immersion', order: 23 },
  ];

  const createdSubjects = {};

  // Create Junior High subjects for Grades 7-10
  for (const gradeCode of ['G7', 'G8', 'G9', 'G10']) {
    for (const subj of juniorHighSubjects) {
      const key = `${gradeCode}_${subj.code}`;
      const subject = await prisma.subject.upsert({
        where: {
          curriculumVersionId_gradeLevelId_code: {
            curriculumVersionId: curriculumVersion.id,
            gradeLevelId: createdGradeLevels[gradeCode].id,
            code: subj.code,
          },
        },
        update: {},
        create: {
          curriculumVersionId: curriculumVersion.id,
          gradeLevelId: createdGradeLevels[gradeCode].id,
          code: subj.code,
          name: subj.name,
          order: subj.order,
        },
      });
      createdSubjects[key] = subject;
    }
  }

  // Create Senior High subjects for Grades 11-12
  for (const gradeCode of ['G11', 'G12']) {
    for (const subj of seniorHighSubjects) {
      const key = `${gradeCode}_${subj.code}`;
      const subject = await prisma.subject.upsert({
        where: {
          curriculumVersionId_gradeLevelId_code: {
            curriculumVersionId: curriculumVersion.id,
            gradeLevelId: createdGradeLevels[gradeCode].id,
            code: subj.code,
          },
        },
        update: {},
        create: {
          curriculumVersionId: curriculumVersion.id,
          gradeLevelId: createdGradeLevels[gradeCode].id,
          code: subj.code,
          name: subj.name,
          order: subj.order,
        },
      });
      createdSubjects[key] = subject;
    }
  }

  /* ============================
     SECTIONS
  ============================ */
  console.log('🏫 Seeding sections...');

  const teachers = createdUsers.filter(u => u.roleName === 'TEACHER');
  const sectionNames = {
    G7: ['Sampaguita', 'Rosal', 'Gumamela'],
    G8: ['Narra', 'Molave', 'Acacia'],
    G9: ['Rizal', 'Bonifacio', 'Mabini'],
    G10: ['Einstein', 'Newton', 'Galileo'],
    G11: ['ABM-A', 'HUMSS-A', 'STEM-A'],
    G12: ['ABM-B', 'HUMSS-B', 'STEM-B'],
  };

  const createdSections = {};
  let teacherIndex = 0;

  // Current year sections
  for (const [gradeCode, sections] of Object.entries(sectionNames)) {
    for (const sectionName of sections) {
      const key = `${gradeCode}_${sectionName}`;
      const section = await prisma.section.upsert({
        where: {
          gradeLevelId_schoolYearId_name: {
            gradeLevelId: createdGradeLevels[gradeCode].id,
            schoolYearId: sy2526.id,
            name: sectionName,
          },
        },
        update: {},
        create: {
          name: sectionName,
          gradeLevelId: createdGradeLevels[gradeCode].id,
          schoolYearId: sy2526.id,
          adviserId: teachers[teacherIndex % teachers.length].id,
        },
      });
      createdSections[key] = section;
      teacherIndex++;
    }
  }

  // Previous year sections
  const prevYearSections = {};
  teacherIndex = 0;

  for (const [gradeCode, sections] of Object.entries(sectionNames)) {
    for (const sectionName of sections) {
      const key = `prev_${gradeCode}_${sectionName}`;
      const section = await prisma.section.upsert({
        where: {
          gradeLevelId_schoolYearId_name: {
            gradeLevelId: createdGradeLevels[gradeCode].id,
            schoolYearId: sy2425.id,
            name: sectionName,
          },
        },
        update: {},
        create: {
          name: sectionName,
          gradeLevelId: createdGradeLevels[gradeCode].id,
          schoolYearId: sy2425.id,
          adviserId: teachers[teacherIndex % teachers.length].id,
        },
      });
      prevYearSections[key] = section;
      teacherIndex++;
    }
  }

  /* ============================
     STUDENTS (20 Filipino Students)
  ============================ */
  console.log('👨‍🎓 Seeding 20 students...');

  const students = [
    { lrn: '136789012345', firstName: 'Juan Carlos', middleName: 'Santos', lastName: 'Dela Cruz', gender: 'Male', birthDate: '2012-03-15', address: '123 Sampaguita St., Brgy. Bagong Pag-asa, Quezon City', grade: 'G7', section: 'Sampaguita' },
    { lrn: '136789012346', firstName: 'Maria Clara', middleName: 'Reyes', lastName: 'Garcia', gender: 'Female', birthDate: '2012-07-22', address: '456 Rosal Ave., Brgy. Bagong Pag-asa, Quezon City', grade: 'G7', section: 'Sampaguita' },
    { lrn: '136789012347', firstName: 'Jose Miguel', middleName: 'Lopez', lastName: 'Mendoza', gender: 'Male', birthDate: '2012-01-10', address: '789 Dahlia Rd., Brgy. Bagong Silang, Quezon City', grade: 'G7', section: 'Rosal' },
    { lrn: '136789012348', firstName: 'Ana Patricia', middleName: 'Torres', lastName: 'Villanueva', gender: 'Female', birthDate: '2011-09-05', address: '234 Narra St., Brgy. Pinyahan, Quezon City', grade: 'G8', section: 'Narra' },
    { lrn: '136789012349', firstName: 'Mark Anthony', middleName: 'Cruz', lastName: 'Bautista', gender: 'Male', birthDate: '2011-12-18', address: '567 Acacia Lane, Brgy. Pinyahan, Quezon City', grade: 'G8', section: 'Narra' },
    { lrn: '136789012350', firstName: 'Princess Joy', middleName: 'Ramos', lastName: 'Fernandez', gender: 'Female', birthDate: '2011-04-30', address: '890 Molave Dr., Brgy. Bagong Pag-asa, Quezon City', grade: 'G8', section: 'Molave' },
    { lrn: '136789012351', firstName: 'John Patrick', middleName: 'Gonzales', lastName: 'Reyes', gender: 'Male', birthDate: '2010-06-12', address: '111 Rizal Ave., Brgy. Bagong Pag-asa, Quezon City', grade: 'G9', section: 'Rizal' },
    { lrn: '136789012352', firstName: 'Angela Marie', middleName: 'Santos', lastName: 'Cruz', gender: 'Female', birthDate: '2010-08-25', address: '222 Bonifacio St., Brgy. Holy Spirit, Quezon City', grade: 'G9', section: 'Rizal' },
    { lrn: '136789012353', firstName: 'Michael James', middleName: 'Diaz', lastName: 'Aquino', gender: 'Male', birthDate: '2010-02-14', address: '333 Mabini Rd., Brgy. Payatas, Quezon City', grade: 'G9', section: 'Bonifacio' },
    { lrn: '136789012354', firstName: 'Kathleen Nicole', middleName: 'Mercado', lastName: 'Santos', gender: 'Female', birthDate: '2010-11-08', address: '444 Luna St., Brgy. Bagong Pag-asa, Quezon City', grade: 'G9', section: 'Mabini' },
    { lrn: '136789012355', firstName: 'Christian Paul', middleName: 'Rivera', lastName: 'Gonzales', gender: 'Male', birthDate: '2009-05-20', address: '555 Einstein St., Brgy. Bagong Pag-asa, Quezon City', grade: 'G10', section: 'Einstein' },
    { lrn: '136789012356', firstName: 'Jessica Mae', middleName: 'Castillo', lastName: 'Lopez', gender: 'Female', birthDate: '2009-10-03', address: '666 Newton Ave., Brgy. Batasan Hills, Quezon City', grade: 'G10', section: 'Einstein' },
    { lrn: '136789012357', firstName: 'Rafael Angelo', middleName: 'Navarro', lastName: 'Torres', gender: 'Male', birthDate: '2009-07-16', address: '777 Galileo Rd., Brgy. Commonwealth, Quezon City', grade: 'G10', section: 'Newton' },
    { lrn: '136789012358', firstName: 'Samantha Rose', middleName: 'Pascual', lastName: 'Ramos', gender: 'Female', birthDate: '2009-03-28', address: '888 Curie St., Brgy. Fairview, Quezon City', grade: 'G10', section: 'Galileo' },
    { lrn: '136789012359', firstName: 'Joshua David', middleName: 'Valdez', lastName: 'Reyes', gender: 'Male', birthDate: '2008-09-11', address: '999 ABM Lane, Brgy. Bagong Pag-asa, Quezon City', grade: 'G11', section: 'ABM-A' },
    { lrn: '136789012360', firstName: 'Mariel Grace', middleName: 'Domingo', lastName: 'Castro', gender: 'Female', birthDate: '2008-01-24', address: '1010 HUMSS Ave., Brgy. Tandang Sora, Quezon City', grade: 'G11', section: 'HUMSS-A' },
    { lrn: '136789012361', firstName: 'Gabriel Luis', middleName: 'Mendez', lastName: 'Villanueva', gender: 'Male', birthDate: '2008-06-07', address: '1111 STEM St., Brgy. Bagong Pag-asa, Quezon City', grade: 'G11', section: 'STEM-A' },
    { lrn: '136789012362', firstName: 'Patricia Anne', middleName: 'Aguilar', lastName: 'Bautista', gender: 'Female', birthDate: '2007-04-19', address: '1212 Senior Ave., Brgy. Bagong Pag-asa, Quezon City', grade: 'G12', section: 'ABM-B' },
    { lrn: '136789012363', firstName: 'Kevin John', middleName: 'Salazar', lastName: 'Fernandez', gender: 'Male', birthDate: '2007-12-02', address: '1313 Graduate Rd., Brgy. UP Campus, Quezon City', grade: 'G12', section: 'HUMSS-B' },
    { lrn: '136789012364', firstName: 'Bianca Louise', middleName: 'Ocampo', lastName: 'Mendoza', gender: 'Female', birthDate: '2007-08-15', address: '1414 Science St., Brgy. Teachers Village, Quezon City', grade: 'G12', section: 'STEM-B' },
  ];

  const createdStudents = [];
  for (const s of students) {
    const student = await prisma.student.upsert({
      where: { lrn: s.lrn },
      update: {},
      create: {
        lrn: s.lrn,
        firstName: s.firstName,
        middleName: s.middleName,
        lastName: s.lastName,
        gender: s.gender,
        birthDate: new Date(s.birthDate),
        address: s.address,
      },
    });
    createdStudents.push({ ...student, grade: s.grade, section: s.section });
  }

  /* ============================
     ENROLLMENTS (Current Year)
  ============================ */
  console.log('📋 Seeding current year enrollments...');

  const createdEnrollments = [];
  for (const student of createdStudents) {
    const sectionKey = `${student.grade}_${student.section}`;
    const enrollment = await prisma.enrollment.upsert({
      where: {
        studentId_schoolYearId: {
          studentId: student.id,
          schoolYearId: sy2526.id,
        },
      },
      update: {},
      create: {
        studentId: student.id,
        schoolYearId: sy2526.id,
        curriculumVersionId: curriculumVersion.id,
        gradeLevelId: createdGradeLevels[student.grade].id,
        sectionId: createdSections[sectionKey].id,
        status: 'ACTIVE',
      },
    });
    createdEnrollments.push({ ...enrollment, grade: student.grade, studentIndex: createdStudents.indexOf(student) });
  }

  /* ============================
     GRADES (Batched)
  ============================ */
  console.log('📝 Seeding grades (this may take a moment)...');

  function generateGrade(basePerformance) {
    const ranges = {
      excellent: { min: 92, max: 99 },
      good: { min: 85, max: 94 },
      average: { min: 78, max: 88 },
      struggling: { min: 75, max: 82 },
    };
    const range = ranges[basePerformance];
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  }

  const performanceLevels = [
    'excellent', 'excellent', 'good', 'good', 'good',
    'good', 'average', 'average', 'average', 'average',
    'average', 'average', 'good', 'good', 'struggling',
    'average', 'good', 'excellent', 'good', 'average',
  ];

  const periods = ['Q1', 'Q2', 'Q3', 'Q4'];
  const allGradesData = [];

  for (const enrollment of createdEnrollments) {
    const performance = performanceLevels[enrollment.studentIndex];
    const isJuniorHigh = ['G7', 'G8', 'G9', 'G10'].includes(enrollment.grade);
    const subjectList = isJuniorHigh ? juniorHighSubjects : seniorHighSubjects;

    for (const subj of subjectList) {
      const subjectKey = `${enrollment.grade}_${subj.code}`;
      const subject = createdSubjects[subjectKey];
      if (!subject) continue;

      const quarterGrades = [];

      for (const period of periods) {
        const gradeValue = generateGrade(performance);
        quarterGrades.push(gradeValue);
        allGradesData.push({
          enrollmentId: enrollment.id,
          subjectId: subject.id,
          period: period,
          value: gradeValue,
          source: 'SYSTEM',
        });
      }

      const finalGrade = Math.round(quarterGrades.reduce((a, b) => a + b, 0) / quarterGrades.length);
      allGradesData.push({
        enrollmentId: enrollment.id,
        subjectId: subject.id,
        period: 'FINAL',
        value: finalGrade,
        source: 'SYSTEM',
      });
    }
  }

  // Delete existing grades and batch insert
  await prisma.grade.deleteMany({
    where: {
      enrollmentId: { in: createdEnrollments.map(e => e.id) }
    }
  });

  // Insert in batches of 500 to avoid connection issues
  const BATCH_SIZE = 500;
  for (let i = 0; i < allGradesData.length; i += BATCH_SIZE) {
    const batch = allGradesData.slice(i, i + BATCH_SIZE);
    await prisma.grade.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  /* ============================
     PREVIOUS YEAR ENROLLMENTS & GRADES
  ============================ */
  console.log('📅 Seeding previous year data...');

  const gradeProgression = {
    G8: 'G7', G9: 'G8', G10: 'G9', G11: 'G10', G12: 'G11',
  };

  const prevEnrollments = [];
  const prevGradesData = [];

  for (const student of createdStudents) {
    const previousGrade = gradeProgression[student.grade];
    if (!previousGrade) continue;

    const previousSectionKey = `prev_${previousGrade}_${sectionNames[previousGrade][0]}`;
    const previousSection = prevYearSections[previousSectionKey];
    if (!previousSection) continue;

    const prevEnrollment = await prisma.enrollment.upsert({
      where: {
        studentId_schoolYearId: {
          studentId: student.id,
          schoolYearId: sy2425.id,
        },
      },
      update: {},
      create: {
        studentId: student.id,
        schoolYearId: sy2425.id,
        curriculumVersionId: curriculumVersion.id,
        gradeLevelId: createdGradeLevels[previousGrade].id,
        sectionId: previousSection.id,
        status: 'COMPLETED',
      },
    });

    prevEnrollments.push(prevEnrollment);

    const performance = performanceLevels[createdStudents.indexOf(student)];
    const isJuniorHigh = ['G7', 'G8', 'G9', 'G10'].includes(previousGrade);
    const subjectList = isJuniorHigh ? juniorHighSubjects : seniorHighSubjects;

    for (const subj of subjectList) {
      const subjectKey = `${previousGrade}_${subj.code}`;
      const subject = createdSubjects[subjectKey];
      if (!subject) continue;

      const quarterGrades = [];

      for (const period of periods) {
        const gradeValue = generateGrade(performance);
        quarterGrades.push(gradeValue);
        prevGradesData.push({
          enrollmentId: prevEnrollment.id,
          subjectId: subject.id,
          period: period,
          value: gradeValue,
          source: 'SYSTEM',
        });
      }

      const finalGrade = Math.round(quarterGrades.reduce((a, b) => a + b, 0) / quarterGrades.length);
      prevGradesData.push({
        enrollmentId: prevEnrollment.id,
        subjectId: subject.id,
        period: 'FINAL',
        value: finalGrade,
        source: 'SYSTEM',
      });
    }
  }

  // Delete existing prev grades and batch insert
  if (prevEnrollments.length > 0) {
    await prisma.grade.deleteMany({
      where: {
        enrollmentId: { in: prevEnrollments.map(e => e.id) }
      }
    });

    for (let i = 0; i < prevGradesData.length; i += BATCH_SIZE) {
      const batch = prevGradesData.slice(i, i + BATCH_SIZE);
      await prisma.grade.createMany({
        data: batch,
        skipDuplicates: true,
      });
    }
  }

  /* ============================
     DOCUMENTS (Sample)
  ============================ */
  console.log('📄 Seeding documents...');

  const documentTypes = ['BIRTH_CERTIFICATE', 'FORM_137', 'GOOD_MORAL'];
  const documentsData = [];

  for (const student of createdStudents.slice(0, 10)) {
    const enrollment = createdEnrollments.find(e => e.studentId === student.id);
    for (const docType of documentTypes) {
      documentsData.push({
        studentId: student.id,
        enrollmentId: enrollment?.id,
        type: docType,
        fileUrl: `https://storage.bpnhs.edu.ph/documents/${student.lrn}/${docType.toLowerCase()}.pdf`,
      });
    }
  }

  await prisma.document.createMany({
    data: documentsData,
    skipDuplicates: true,
  });

  /* ============================
     AUDIT LOGS (Sample)
  ============================ */
  console.log('📜 Seeding audit logs...');

  await prisma.auditLog.createMany({
    data: [
      { userId: createdUsers[0].id, action: 'CREATE', entity: 'Student', entityId: 1, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 Chrome/120.0.0.0' },
      { userId: createdUsers[0].id, action: 'UPDATE', entity: 'Enrollment', entityId: 1, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 Chrome/120.0.0.0' },
      { userId: createdUsers[0].id, action: 'CREATE', entity: 'Grade', entityId: 1, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 Chrome/120.0.0.0' },
      { userId: createdUsers[0].id, action: 'LOGIN', entity: 'User', entityId: 1, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 Chrome/120.0.0.0' },
      { userId: createdUsers[0].id, action: 'VIEW', entity: 'SF10', entityId: 1, ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 Chrome/120.0.0.0' },
    ],
  });

  console.log('');
  console.log('✅ ===== SEED COMPLETED SUCCESSFULLY =====');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   • System Settings: ${systemSettings.length}`);
  console.log(`   • Permissions: ${permissions.length}`);
  console.log(`   • Roles: 4 (SUPER_ADMIN, REGISTRAR, TEACHER, VIEWER)`);
  console.log(`   • Users: ${users.length}`);
  console.log(`   • School Years: 3`);
  console.log(`   • Grade Levels: ${gradeLevels.length}`);
  console.log(`   • Curriculum Versions: 1`);
  console.log(`   • Subjects: ${Object.keys(createdSubjects).length}`);
  console.log(`   • Sections: ${Object.keys(createdSections).length + Object.keys(prevYearSections).length}`);
  console.log(`   • Students: ${students.length}`);
  console.log(`   • Enrollments: ${createdEnrollments.length + prevEnrollments.length}`);
  console.log(`   • Grades: ${allGradesData.length + prevGradesData.length}`);
  console.log('');
  console.log('🔐 Login Credentials:');
  console.log('   • Admin: admin@bpnhs.edu.ph / admin123');
  console.log('   • Registrar: registrar@bpnhs.edu.ph / registrar123');
  console.log('   • Teacher: mrodriguez@bpnhs.edu.ph / teacher123');
  console.log('   • Viewer: viewer@bpnhs.edu.ph / viewer123');
  console.log('');
}

main()
  .catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
