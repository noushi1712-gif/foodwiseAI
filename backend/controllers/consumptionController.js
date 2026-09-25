const { z } = require('zod');
const db = require('../config/db');

const ConsumptionLogSchema = z.object({
  recordDate: z.string().min(1, 'Record date is required'),
  peopleExpected: z.number().int().positive('Expected people must be greater than 0'),
  foodPrepared: z.number().int().positive('Food prepared must be greater than 0'),
  foodConsumed: z.number().int().nonnegative('Food consumed must be 0 or more')
}).refine(data => data.foodConsumed <= data.foodPrepared, {
  message: "Food consumed cannot exceed food prepared."
});

// Memory fallback for demo mode
const memoryConsumption = [];

const getDayName = (dateStr) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const d = new Date(dateStr);
  return days[isNaN(d.getDay()) ? 0 : d.getDay()];
};

/**
 * Log actual meal consumption and compute waste
 */
const recordConsumption = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recordDate, peopleExpected, foodPrepared, foodConsumed } = req.body;

    // Normalize date to YYYY-MM-DD
    const parsedDate = new Date(recordDate);
    const dateFormatted = !isNaN(parsedDate) ? parsedDate.toISOString().split('T')[0] : recordDate;
    const dayOfWeek = getDayName(dateFormatted);
    const foodWasted = foodPrepared - foodConsumed;

    let savedRecord;

    if (process.env.DATABASE_URL) {
      const insertQuery = `
        INSERT INTO consumption (
          user_id, record_date, day_of_week, people_expected, food_prepared, food_consumed
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, user_id, record_date, day_of_week, people_expected, food_prepared, food_consumed, food_wasted, created_at
      `;
      const result = await db.query(insertQuery, [
        userId,
        dateFormatted,
        dayOfWeek,
        peopleExpected,
        foodPrepared,
        foodConsumed
      ]);
      savedRecord = result.rows[0];
    } else {
      savedRecord = {
        id: 'cons-' + Date.now(),
        user_id: userId,
        record_date: dateFormatted,
        day_of_week: dayOfWeek,
        people_expected: peopleExpected,
        food_prepared: foodPrepared,
        food_consumed: foodConsumed,
        food_wasted: foodWasted,
        created_at: new Date()
      };
      memoryConsumption.unshift(savedRecord);
    }

    return res.status(201).json({
      success: true,
      message: 'Consumption record logged successfully.',
      record: savedRecord
    });
  } catch (err) {
    console.error('Error logging consumption:', err);
    return res.status(500).json({ error: 'Failed to record consumption: ' + err.message });
  }
};

/**
 * Fetch consumption history for the authenticated user
 */
const getConsumptionHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    if (process.env.DATABASE_URL) {
      const result = await db.query(
        `SELECT id, user_id, record_date, day_of_week, people_expected, food_prepared, food_consumed, food_wasted, created_at
         FROM consumption
         WHERE user_id = $1
         ORDER BY record_date DESC, created_at DESC
         LIMIT 100`,
        [userId]
      );
      return res.status(200).json({ records: result.rows });
    } else {
      const records = memoryConsumption.filter(c => c.user_id === userId);
      return res.status(200).json({ records });
    }
  } catch (err) {
    console.error('Error fetching consumption history:', err);
    return res.status(500).json({ error: 'Failed to fetch consumption history' });
  }
};

module.exports = {
  ConsumptionLogSchema,
  recordConsumption,
  getConsumptionHistory
};
