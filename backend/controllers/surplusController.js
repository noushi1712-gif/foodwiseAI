const { z } = require('zod');
const db = require('../config/db');

const OfferSchema = z.object({
  organizationId: z.string().uuid().or(z.string().min(1)),
  quantity: z.number().int().positive('Quantity of meals must be at least 1')
});

const DEFAULT_ORGS = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Community Food Center', location: 'Downtown', contact_email: 'contact@cfc.org', is_available: true },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Local Shelter', location: 'Westside', contact_email: 'help@shelter.org', is_available: true },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Food Redistribution NGO', location: 'North District', contact_email: 'logistics@foodngo.org', is_available: true }
];

const memorySurplus = [];

/**
 * Get verified partner organizations available for surplus redistribution
 */
const getOrganizations = async (req, res) => {
  try {
    if (process.env.DATABASE_URL) {
      const result = await db.query(
        'SELECT id, name, location, contact_email, is_available FROM organizations WHERE is_available = true ORDER BY name ASC'
      );
      if (result.rows.length > 0) {
        return res.status(200).json({ organizations: result.rows });
      }
    }
    return res.status(200).json({ organizations: DEFAULT_ORGS });
  } catch (err) {
    console.error('Error fetching organizations:', err);
    return res.status(200).json({ organizations: DEFAULT_ORGS });
  }
};

/**
 * Create a surplus food donation offer to a selected organization
 */
const createOffer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { organizationId, quantity } = req.body;
    const today = new Date().toISOString().split('T')[0];

    let savedOffer;

    if (process.env.DATABASE_URL) {
      const insertQuery = `
        INSERT INTO surplus (user_id, organization_id, record_date, quantity, status)
        VALUES ($1, $2, $3, $4, 'Offered')
        RETURNING *
      `;
      const result = await db.query(insertQuery, [userId, organizationId, today, quantity]);
      savedOffer = result.rows[0];
    } else {
      const org = DEFAULT_ORGS.find(o => o.id === organizationId) || DEFAULT_ORGS[0];
      savedOffer = {
        id: 'surplus-' + Date.now(),
        user_id: userId,
        organization_id: organizationId,
        organization_name: org.name,
        record_date: today,
        quantity,
        status: 'Offered',
        created_at: new Date()
      };
      memorySurplus.unshift(savedOffer);
    }

    return res.status(201).json({
      success: true,
      message: 'Surplus meal batch successfully offered to organization.',
      offer: savedOffer
    });
  } catch (err) {
    console.error('Error creating surplus offer:', err);
    return res.status(500).json({ error: 'Failed to record surplus offer: ' + err.message });
  }
};

/**
 * Get all surplus food offers initiated by the manager
 */
const getMyOffers = async (req, res) => {
  try {
    const userId = req.user.id;

    if (process.env.DATABASE_URL) {
      const query = `
        SELECT 
          s.id, s.record_date, s.quantity, s.status, s.created_at,
          o.name AS organization_name, o.location AS organization_location, o.contact_email
        FROM surplus s
        LEFT JOIN organizations o ON s.organization_id = o.id
        WHERE s.user_id = $1
        ORDER BY s.created_at DESC
      `;
      const result = await db.query(query, [userId]);
      return res.status(200).json({ offers: result.rows });
    } else {
      const userOffers = memorySurplus.filter(s => s.user_id === userId);
      return res.status(200).json({ offers: userOffers });
    }
  } catch (err) {
    console.error('Error fetching surplus offers:', err);
    return res.status(500).json({ error: 'Failed to retrieve surplus offers' });
  }
};

module.exports = {
  OfferSchema,
  getOrganizations,
  createOffer,
  getMyOffers
};
