const { z } = require('zod');
const db = require('../config/db');
const { generatePrediction } = require('../services/geminiService');

const PredictionRequestSchema = z.object({
  expectedPeople: z.number().int().positive('Expected people must be a positive integer'),
  dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  isHoliday: z.boolean().default(false),
  targetDate: z.string().optional()
});

// In-memory fallback if database connection is not active
const memoryPredictions = [];

/**
 * Calculate historical average for the given day of the week from the past 4 occurrences
 */
const getHistoricalAverage = async (userId, dayOfWeek) => {
  if (!process.env.DATABASE_URL) {
    return 0;
  }
  try {
    const query = `
      SELECT ROUND(AVG(food_consumed)) as avg_consumed
      FROM (
        SELECT food_consumed
        FROM consumption
        WHERE user_id = $1 AND day_of_week = $2 AND food_consumed IS NOT NULL
        ORDER BY record_date DESC
        LIMIT 4
      ) as sub
    `;
    const result = await db.query(query, [userId, dayOfWeek]);
    if (result.rows.length > 0 && result.rows[0].avg_consumed !== null) {
      return parseInt(result.rows[0].avg_consumed, 10);
    }
  } catch (err) {
    console.warn('Notice querying historical average:', err.message);
  }
  return 0;
};

/**
 * Generate AI food preparation prediction and store in database
 */
const createPrediction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { expectedPeople, dayOfWeek, isHoliday, targetDate } = req.body;

    // 1. Calculate dynamic historical average for the past 4 corresponding days
    const historicalAverage = await getHistoricalAverage(userId, dayOfWeek);

    // 2. Query Gemini AI with structured schema (or fallback math model)
    const aiResult = await generatePrediction({
      expectedPeople,
      historicalAverage,
      dayOfWeek,
      isHoliday
    });

    const target = targetDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];

    // 3. Persist to PostgreSQL with user data isolation
    let savedRecord;
    if (process.env.DATABASE_URL) {
      const insertQuery = `
        INSERT INTO predictions (
          user_id, target_date, expected_people, predicted_demand, 
          recommended_quantity, safety_buffer, reason
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const result = await db.query(insertQuery, [
        userId,
        target,
        expectedPeople,
        aiResult.predictedDemand,
        aiResult.recommendedPreparation,
        aiResult.safetyBuffer,
        aiResult.reason
      ]);
      savedRecord = result.rows[0];
    } else {
      savedRecord = {
        id: 'pred-' + Date.now(),
        user_id: userId,
        target_date: target,
        expected_people: expectedPeople,
        predicted_demand: aiResult.predictedDemand,
        recommended_quantity: aiResult.recommendedPreparation,
        safety_buffer: aiResult.safetyBuffer,
        reason: aiResult.reason,
        created_at: new Date()
      };
      memoryPredictions.unshift(savedRecord);
    }

    return res.status(201).json({
      success: true,
      prediction: savedRecord,
      historicalAverage
    });
  } catch (err) {
    console.error('Error generating prediction:', err);
    return res.status(500).json({ error: 'Failed to generate prediction: ' + err.message });
  }
};

/**
 * Get past predictions for the authenticated user
 */
const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    if (process.env.DATABASE_URL) {
      const result = await db.query(
        `SELECT * FROM predictions 
         WHERE user_id = $1 
         ORDER BY target_date DESC, created_at DESC 
         LIMIT 50`,
        [userId]
      );
      return res.status(200).json({ history: result.rows });
    } else {
      const userHistory = memoryPredictions.filter(p => p.user_id === userId);
      return res.status(200).json({ history: userHistory });
    }
  } catch (err) {
    console.error('Error retrieving prediction history:', err);
    return res.status(500).json({ error: 'Failed to retrieve prediction history' });
  }
};

module.exports = {
  PredictionRequestSchema,
  createPrediction,
  getHistory
};
