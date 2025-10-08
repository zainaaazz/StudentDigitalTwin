const { getAzureSqlPool, sql } = require('../utils/azureSql');

const academicsController = {
  async getAllStudents(req, res) {
    try {
      const pool = await getAzureSqlPool();
      const request = pool.request();

      const parseStudentId = (value) => {
        if (value === undefined || value === null || value === '') {
          return null;
        }
        const numeric = Number.parseInt(value, 10);
        return Number.isNaN(numeric) ? null : numeric;
      };

      // Determine which student ID (if any) we should restrict results to.
      const tokenStudentId =
        parseStudentId(req.user?.id_student ?? req.user?.student_id);
      const queryStudentId = parseStudentId(req.query?.studentId);

      let targetStudentId = null;
      let restrictedToStudent = false;

      if (req.user?.role === 'student' && tokenStudentId !== null) {
        targetStudentId = tokenStudentId;
        restrictedToStudent = true;
      } else if (queryStudentId !== null) {
        targetStudentId = queryStudentId;
      }

      let result;
      if (targetStudentId !== null) {
        request.input('studentId', sql.Int, targetStudentId);
        const filteredQuery = `
IF EXISTS (
  SELECT 1
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'tblStudents' AND COLUMN_NAME = 'student_id'
)
BEGIN
  SELECT * FROM tblStudents WHERE student_id = @studentId;
END
ELSE IF EXISTS (
  SELECT 1
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'tblStudents' AND COLUMN_NAME = 'id_student'
)
BEGIN
  SELECT * FROM tblStudents WHERE id_student = @studentId;
END
ELSE
BEGIN
  SELECT * FROM tblStudents;
END
        `;
        result = await request.query(filteredQuery);
      } else {
        result = await request.query('SELECT * FROM tblStudents');
      }

      let rows = result.recordset || [];

      // Fallback filtering in case the table uses a different column name than expected.
      if (restrictedToStudent && rows.length) {
        rows = rows.filter((row) => {
          const candidate =
            row?.student_id ??
            row?.id_student ??
            row?.studentId ??
            row?.idStudent ??
            null;
          return parseStudentId(candidate) === tokenStudentId;
        });
      }

      return res.json({
        success: true,
        data: rows,
        count: rows.length,
        restrictedToStudent
      });
    } catch (error) {
      console.error('[ACADEMICS] Failed to fetch students from Azure SQL:', error);
      const message = error?.message || 'Failed to fetch students';
      return res.status(500).json({
        success: false,
        error: message
      });
    }
  }
};

module.exports = academicsController;
