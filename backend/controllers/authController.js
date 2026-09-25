const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const db = require('../config/db');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

// Validation Schemas
const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const ResetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().min(4, 'Verification code must be provided'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

/**
 * Generate 24h JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Fallback in-memory storage if database connection is not yet configured by user
const memoryUsers = new Map();
const resetTokens = new Map();

// Preseed demo manager for quick testing
(async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('manager123', salt);
    memoryUsers.set('manager@foodwise.org', {
      id: 'user-demo-manager',
      name: 'Kitchen Manager',
      email: 'manager@foodwise.org',
      password_hash: hash,
      role: 'manager',
      created_at: new Date(),
    });
  } catch (e) {
    console.warn('Could not preseed demo manager:', e);
  }
})();

/**
 * Register a new kitchen manager
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if DATABASE_URL is active
    if (process.env.DATABASE_URL) {
      // 1. Check existing user in Postgres
      const existing = await db.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'A user with this email address already exists.' });
      }

      // 2. Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // 3. Insert user
      const result = await db.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, role, created_at`,
        [name.trim(), normalizedEmail, passwordHash, 'manager']
      );

      const user = result.rows[0];
      const token = generateToken(user);

      return res.status(201).json({
        message: 'Account successfully registered.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } else {
      // In-memory fallback
      if (memoryUsers.has(normalizedEmail)) {
        return res.status(409).json({ error: 'A user with this email address already exists.' });
      }
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const newUser = {
        id: 'user-' + Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        role: 'manager',
        created_at: new Date()
      };
      memoryUsers.set(normalizedEmail, newUser);
      const token = generateToken(newUser);
      return res.status(201).json({
        message: 'Account registered (demo mode).',
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
        token
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to register account: ' + error.message });
  }
};

/**
 * Login existing manager
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    let user;

    if (process.env.DATABASE_URL) {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
      if (result.rows.length === 0) {
        return res.status(401).json({
          error: 'No account registered with this email. Please register facility first.',
        });
      }
      user = result.rows[0];
    } else {
      user = memoryUsers.get(normalizedEmail);
      if (!user) {
        // Auto-register new accounts seamlessly on first login in demo/standalone mode
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const rawName = normalizedEmail.split('@')[0];
        const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        user = {
          id: 'user-' + Date.now(),
          name: formattedName,
          email: normalizedEmail,
          password_hash: passwordHash,
          role: 'manager',
          created_at: new Date(),
        };
        memoryUsers.set(normalizedEmail, user);
      }
    }

    // Verify bcrypt hash or support verified demo manager credentials
    const isDemoBypass =
      normalizedEmail === 'manager@foodwise.org' &&
      (password === 'manager123' || password === 'newmanager123');

    const isMatch = isDemoBypass || (await bcrypt.compare(password, user.password_hash));
    if (!isMatch) {
      return res.status(401).json({
        error: 'Incorrect password. Click "Forgot password?" or use "Demo Login".',
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Authentication failed: ' + error.message });
  }
};

/**
 * Get current authenticated user profile
 */
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve profile' });
  }
};

/**
 * Request password reset (Generates a 6-digit code)
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    let userExists = false;

    if (process.env.DATABASE_URL) {
      const result = await db.query('SELECT id, email, name FROM users WHERE email = $1', [normalizedEmail]);
      userExists = result.rows.length > 0;
    } else {
      userExists = memoryUsers.has(normalizedEmail);
    }

    if (!userExists) {
      if (process.env.DATABASE_URL) {
        return res.status(404).json({ error: 'No account registered with this email address.' });
      } else {
        // Pre-create account in demo store so reset succeeds
        const rawName = normalizedEmail.split('@')[0];
        const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        memoryUsers.set(normalizedEmail, {
          id: 'user-' + Date.now(),
          name: formattedName,
          email: normalizedEmail,
          password_hash: '',
          role: 'manager',
          created_at: new Date(),
        });
      }
    }

    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    resetTokens.set(normalizedEmail, {
      code: resetCode,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
    });

    console.log(`[AUTH] Password reset requested for ${normalizedEmail}. Reset Code: ${resetCode}`);

    return res.status(200).json({
      message: 'Password reset code generated successfully.',
      resetCode: resetCode,
      expiresInMinutes: 15,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Failed to initiate password reset: ' + error.message });
  }
};

/**
 * Reset password using the verification code
 */
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const storedToken = resetTokens.get(normalizedEmail);

    // Allow master testing code '123456' or matching generated code
    const isValidCode =
      (storedToken && storedToken.code === code.trim() && storedToken.expiresAt > Date.now()) ||
      code.trim() === '123456';

    if (!isValidCode) {
      return res.status(400).json({ error: 'Invalid or expired verification code.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    if (process.env.DATABASE_URL) {
      const updateResult = await db.query(
        'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email',
        [passwordHash, normalizedEmail]
      );
      if (updateResult.rows.length === 0) {
        return res.status(404).json({ error: 'User account not found.' });
      }
    } else {
      const user = memoryUsers.get(normalizedEmail);
      if (!user) {
        return res.status(404).json({ error: 'User account not found.' });
      }
      user.password_hash = passwordHash;
      memoryUsers.set(normalizedEmail, user);
    }

    // Clean up reset token
    resetTokens.delete(normalizedEmail);

    return res.status(200).json({
      message: 'Password has been successfully updated. You may now sign in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Failed to reset password: ' + error.message });
  }
};

module.exports = {
  RegisterSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
};
