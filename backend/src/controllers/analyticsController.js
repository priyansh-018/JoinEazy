const db = require('../db/db');

// Admin Analytics
const getAdminAnalytics = async (req, res, next) => {
  try {
    // 1. Summary counts
    const totalAssignmentsRes = await db.query('SELECT COUNT(*) as count FROM assignments');
    const totalGroupsRes = await db.query('SELECT COUNT(*) as count FROM groups');
    const totalStudentsRes = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
    const totalSubmissionsRes = await db.query('SELECT COUNT(*) as count FROM submissions');

    const totalAssignments = parseInt(totalAssignmentsRes.rows[0].count, 10);
    const totalGroups = parseInt(totalGroupsRes.rows[0].count, 10);
    const totalStudents = parseInt(totalStudentsRes.rows[0].count, 10);
    const totalSubmissions = parseInt(totalSubmissionsRes.rows[0].count, 10);

    // 2. Assignment-wise completion metrics
    const assignmentsRes = await db.query(
      `SELECT a.id, a.title, a.due_date, a.target_type
       FROM assignments a
       ORDER BY a.due_date ASC`
    );

    const assignmentBreakdown = await Promise.all(
      assignmentsRes.rows.map(async (a) => {
        const subCountRes = await db.query(
          'SELECT COUNT(*) as count FROM submissions WHERE assignment_id = $1',
          [a.id]
        );
        const submitted = parseInt(subCountRes.rows[0].count, 10);

        let target = totalGroups;
        if (a.target_type === 'specific_groups') {
          const targetRes = await db.query(
            'SELECT COUNT(*) as count FROM assignment_groups WHERE assignment_id = $1',
            [a.id]
          );
          target = parseInt(targetRes.rows[0].count, 10);
        }

        const rate = target > 0 ? Math.round((submitted / target) * 100) : 0;
        const isOverdue = new Date(a.due_date) < new Date();

        return {
          id: a.id,
          title: a.title,
          due_date: a.due_date,
          target_type: a.target_type,
          submitted_count: submitted,
          total_target: target,
          pending_count: Math.max(0, target - submitted),
          completion_rate: rate,
          is_overdue: isOverdue
        };
      })
    );

    // 3. Group-wise performance metrics
    const allGroupsRes = await db.query(
      `SELECT g.id, g.name, u.name as leader_name,
              COUNT(gm.id) as member_count
       FROM groups g
       LEFT JOIN users u ON g.created_by = u.id
       LEFT JOIN group_members gm ON g.id = gm.group_id
       GROUP BY g.id, g.name, u.name`
    );

    const groupPerformance = await Promise.all(
      allGroupsRes.rows.map(async (grp) => {
        // Count how many assignments apply to this group
        const assignedRes = await db.query(
          `SELECT COUNT(DISTINCT a.id) as count
           FROM assignments a
           LEFT JOIN assignment_groups ag ON a.id = ag.assignment_id
           WHERE a.target_type = 'all' OR ag.group_id = $1`,
          [grp.id]
        );
        const assignedCount = parseInt(assignedRes.rows[0].count, 10);

        // Count how many this group has submitted
        const submittedRes = await db.query(
          'SELECT COUNT(*) as count FROM submissions WHERE group_id = $1',
          [grp.id]
        );
        const completedCount = parseInt(submittedRes.rows[0].count, 10);
        const rate = assignedCount > 0 ? Math.round((completedCount / assignedCount) * 100) : 0;

        return {
          id: grp.id,
          name: grp.name,
          leader_name: grp.leader_name,
          member_count: parseInt(grp.member_count, 10),
          assigned_count: assignedCount,
          completed_count: completedCount,
          pending_count: Math.max(0, assignedCount - completedCount),
          completion_rate: rate
        };
      })
    );

    // 4. Overall completion rate calculation
    let totalPossibleSubmissions = 0;
    assignmentBreakdown.forEach(a => {
      totalPossibleSubmissions += a.total_target;
    });
    const overallCompletionRate = totalPossibleSubmissions > 0
      ? Math.round((totalSubmissions / totalPossibleSubmissions) * 100)
      : 0;

    // 5. Recent Activity Feed
    const recentSubmissionsRes = await db.query(
      `SELECT s.id, s.submitted_at, s.status,
              a.title as assignment_title,
              g.name as group_name,
              u.name as student_name
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       JOIN groups g ON s.group_id = g.id
       JOIN users u ON s.submitted_by = u.id
       ORDER BY s.submitted_at DESC
       LIMIT 8`
    );

    // 6. Courses being taught along with student count & submission status analytics (Task 2 requirement)
    const coursesRes = await db.query(
      `SELECT c.id, c.name, c.course_code, c.join_code,
              COUNT(DISTINCT g.id) as group_count,
              COUNT(DISTINCT gm.user_id) as student_count,
              COUNT(DISTINCT a.id) as assignment_count
       FROM courses c
       LEFT JOIN groups g ON c.id = g.course_id
       LEFT JOIN group_members gm ON g.id = gm.group_id
       LEFT JOIN assignments a ON c.id = a.course_id
       WHERE c.professor_id = $1 OR $2 = 'admin'
       GROUP BY c.id, c.name, c.course_code, c.join_code
       ORDER BY c.created_at DESC`,
      [req.user.id, req.user.role]
    );

    const coursesAnalytics = await Promise.all(
      coursesRes.rows.map(async (c) => {
        const subRes = await db.query(
          `SELECT COUNT(s.id) as count
           FROM submissions s
           JOIN assignments a ON s.assignment_id = a.id
           WHERE a.course_id = $1`,
          [c.id]
        );
        const subCount = parseInt(subRes.rows[0].count, 10);
        return {
          id: c.id,
          name: c.name,
          course_code: c.course_code,
          join_code: c.join_code,
          group_count: parseInt(c.group_count, 10),
          student_count: parseInt(c.student_count, 10),
          assignment_count: parseInt(c.assignment_count, 10),
          submission_count: subCount
        };
      })
    );

    res.json({
      success: true,
      analytics: {
        total_assignments: totalAssignments,
        total_groups: totalGroups,
        total_students: totalStudents,
        total_submissions: totalSubmissions,
        overall_completion_rate: overallCompletionRate,
        assignment_breakdown: assignmentBreakdown,
        group_performance: groupPerformance,
        courses_analytics: coursesAnalytics,
        recent_activity: recentSubmissionsRes.rows
      }
    });
  } catch (error) {
    next(error);
  }
};

// Student Progress & Visual Progress Tracking
const getStudentProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find student's groups
    const myGroupsRes = await db.query(
      `SELECT g.id, g.name, gm.role
       FROM groups g
       JOIN group_members gm ON g.id = gm.group_id
       WHERE gm.user_id = $1`,
      [userId]
    );

    // Fetch enrolled courses for the student (Task 2 Requirement)
    const enrolledCoursesRes = await db.query(
      `SELECT DISTINCT c.id, c.name, c.course_code, c.description,
              u.name as professor_name,
              g.id as group_id, g.name as group_name,
              COUNT(DISTINCT a.id) as assignment_count
       FROM groups g
       JOIN group_members gm ON g.id = gm.group_id
       JOIN courses c ON g.course_id = c.id
       LEFT JOIN users u ON c.professor_id = u.id
       LEFT JOIN assignments a ON c.id = a.course_id
       WHERE gm.user_id = $1
       GROUP BY c.id, c.name, c.course_code, c.description, u.name, g.id, g.name
       ORDER BY c.name ASC`,
      [userId]
    );
    const enrolledCourses = enrolledCoursesRes.rows;

    const myGroups = myGroupsRes.rows;
    const groupIds = myGroups.map(g => g.id);

    if (groupIds.length === 0) {
      return res.json({
        success: true,
        progress: {
          has_group: false,
          total_assigned: 0,
          completed: 0,
          pending: 0,
          overdue: 0,
          completion_rate: 0,
          badges: [],
          assignments: [],
          enrolled_courses: enrolledCourses
        }
      });
    }

    // Get assignments for student's groups
    const placeholders = groupIds.map((_, i) => `$${i + 1}`).join(', ');
    const assignmentsRes = await db.query(
      `SELECT DISTINCT a.*
       FROM assignments a
       LEFT JOIN assignment_groups ag ON a.id = ag.assignment_id
       WHERE a.target_type = 'all' OR ag.group_id IN (${placeholders})
       ORDER BY a.due_date ASC`,
      [...groupIds]
    );

    const assignments = assignmentsRes.rows;
    let completedCount = 0;
    let overdueCount = 0;
    let pendingCount = 0;

    const enrichedAssignments = await Promise.all(
      assignments.map(async (a) => {
        const subPlaceholders = groupIds.map((_, i) => `$${i + 2}`).join(', ');
        const subRes = await db.query(
          `SELECT s.*, g.name as group_name
           FROM submissions s
           JOIN groups g ON s.group_id = g.id
           WHERE s.assignment_id = $1 AND s.group_id IN (${subPlaceholders})`,
          [a.id, ...groupIds]
        );

        const hasSubmitted = subRes.rows.length > 0;
        const isPastDue = new Date(a.due_date) < new Date();

        if (hasSubmitted) {
          completedCount++;
        } else if (isPastDue) {
          overdueCount++;
        } else {
          pendingCount++;
        }

        return {
          ...a,
          has_submitted: hasSubmitted,
          is_overdue: isPastDue && !hasSubmitted,
          submission: hasSubmitted ? subRes.rows[0] : null
        };
      })
    );

    const totalAssigned = assignments.length;
    const completionRate = totalAssigned > 0 ? Math.round((completedCount / totalAssigned) * 100) : 0;

    // Badges determination
    const badges = [];
    if (myGroups.length > 0) {
      badges.push({
        id: 'team_player',
        name: 'Team Player',
        description: 'Active member of a collaborative group',
        icon: 'Users',
        color: 'blue'
      });
    }

    if (myGroups.some(g => g.role === 'leader')) {
      badges.push({
        id: 'group_leader',
        name: 'Group Leader',
        description: 'Leading and orchestrating team collaboration',
        icon: 'Crown',
        color: 'amber'
      });
    }

    if (completionRate === 100 && totalAssigned > 0) {
      badges.push({
        id: 'all_caught_up',
        name: 'All Caught Up',
        description: '100% of all assigned coursework completed!',
        icon: 'CheckCircle2',
        color: 'emerald'
      });
    } else if (completionRate >= 50) {
      badges.push({
        id: 'momentum',
        name: 'On A Roll',
        description: 'Completed more than 50% of coursework',
        icon: 'Flame',
        color: 'orange'
      });
    }

    if (completedCount >= 1) {
      badges.push({
        id: 'first_submission',
        name: 'First Milestone',
        description: 'Successfully verified an external submission',
        icon: 'Award',
        color: 'purple'
      });
    }

    res.json({
      success: true,
      progress: {
        has_group: true,
        groups: myGroups,
        total_assigned: totalAssigned,
        completed: completedCount,
        pending: pendingCount,
        overdue: overdueCount,
        completion_rate: completionRate,
        badges,
        enrolled_courses: enrolledCourses,
        assignments: enrichedAssignments
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminAnalytics,
  getStudentProgress
};
