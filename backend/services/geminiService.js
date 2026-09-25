const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let aiClient = null;
if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_google_gemini_api_key') {
  try {
    aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  } catch (err) {
    console.warn('⚠️ GoogleGenAI initialization error:', err.message);
  }
} else {
  console.warn('⚠️ GEMINI_API_KEY is not configured or using placeholder. Fallback algorithm enabled.');
}

const SYSTEM_INSTRUCTION = `You are FoodWise AI, an expert food demand forecaster and sustainability analyst for institutional kitchens. Your goal is to analyze quantitative historical data and contextual factors to provide an accurate, explainable food preparation recommendation. 

You do not guess numbers blindly. You will be provided with the expected headcount, the historical baseline average, and the day's conditions. 
Calculate the optimal buffer based on attendance fluctuations, and provide a short, highly professional reasoning paragraph explaining the recommendation to the kitchen manager. Output your response strictly as valid JSON matching the provided schema.`;

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    predictedDemand: {
      type: "INTEGER",
      description: "The baseline calculated demand before buffer."
    },
    safetyBuffer: {
      type: "INTEGER",
      description: "A small safety margin (usually 2-5% of demand) to prevent food shortages."
    },
    recommendedPreparation: {
      type: "INTEGER",
      description: "predictedDemand + safetyBuffer"
    },
    reason: {
      type: "STRING",
      description: "A 2-3 sentence explanation justifying the numbers based on the input factors."
    }
  },
  required: ["predictedDemand", "safetyBuffer", "recommendedPreparation", "reason"]
};

/**
 * Robust mathematical heuristic algorithm used when GEMINI_API_KEY is unset or API call is offline
 */
const calculateMathematicalFallback = ({ expectedPeople, historicalAverage, dayOfWeek, isHoliday }) => {
  // If historical average is available, blend expected headcount with historical data
  // Base demand: 60% expected headcount weight + 40% historical attendance weight
  let baseline;
  if (historicalAverage && historicalAverage > 0) {
    baseline = Math.round((expectedPeople * 0.65) + (historicalAverage * 0.35));
  } else {
    baseline = expectedPeople;
  }

  // Holiday reduction factor (usually 10-15% lower institutional attendance)
  if (isHoliday) {
    baseline = Math.round(baseline * 0.88);
  }

  // Day of week subtle dynamics (Mondays and Fridays often see attendance fluctuations)
  let bufferPercent = 0.04; // 4% default safety buffer
  if (dayOfWeek === 'Monday') {
    bufferPercent = 0.05; // 5% buffer for erratic start of week
  } else if (dayOfWeek === 'Friday' || dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') {
    bufferPercent = 0.03; // 3% buffer for lighter weekend flow
  }

  const predictedDemand = baseline;
  const safetyBuffer = Math.max(2, Math.round(predictedDemand * bufferPercent));
  const recommendedPreparation = predictedDemand + safetyBuffer;

  const holidayNote = isHoliday ? ' Given the holiday schedule, typical attendance is anticipated to soften by ~12%.' : '';
  const historyNote = (historicalAverage && historicalAverage > 0)
    ? ` Historical consumption for ${dayOfWeek}s averages ${historicalAverage} meals.`
    : ` Based on the initial expected headcount of ${expectedPeople}.`;

  const reason = `Demand calculated for ${dayOfWeek} with ${expectedPeople} expected patrons.${historyNote}${holidayNote} A prudent safety buffer of ${safetyBuffer} meals (${Math.round(bufferPercent * 100)}%) is incorporated to prevent shortages while minimizing preparation surplus.`;

  return {
    predictedDemand,
    safetyBuffer,
    recommendedPreparation,
    reason
  };
};

/**
 * Generate Food Demand Prediction via Gemini AI or mathematical engine
 */
const generatePrediction = async ({ expectedPeople, historicalAverage, dayOfWeek, isHoliday }) => {
  if (aiClient) {
    try {
      const userPrompt = `Analyze the following parameters to recommend food preparation quantities:
- Expected People Today: ${expectedPeople}
- Historical Average for this Day: ${historicalAverage || 'No prior records yet'}
- Day of the Week: ${dayOfWeek}
- Is it a Holiday?: ${isHoliday ? 'Yes' : 'No'}

Calculate the predicted demand, a sensible safety buffer, and the total recommended preparation quantity. Provide a brief professional explanation.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.2, // low temperature for consistent math
        }
      });

      const responseText = response.text?.();
      if (responseText) {
        const parsed = JSON.parse(responseText);
        
        // Strict invariant enforcement: recommendedPreparation = predictedDemand + safetyBuffer
        const predictedDemand = Number(parsed.predictedDemand) || expectedPeople;
        const safetyBuffer = Number(parsed.safetyBuffer) || Math.max(1, Math.round(predictedDemand * 0.03));
        const recommendedPreparation = predictedDemand + safetyBuffer;

        return {
          predictedDemand,
          safetyBuffer,
          recommendedPreparation,
          reason: parsed.reason || 'Calculated by FoodWise AI based on expected headcount and historical patterns.'
        };
      }
    } catch (err) {
      console.error('Gemini API call failed, seamlessly falling back to mathematical engine:', err.message);
    }
  }

  // Fallback to validated mathematical heuristic
  return calculateMathematicalFallback({ expectedPeople, historicalAverage, dayOfWeek, isHoliday });
};

module.exports = {
  generatePrediction,
  calculateMathematicalFallback
};
