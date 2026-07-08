const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize, connectDB } = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const userRoutes = require('./routes/userRoutes');
const mcqRoutes = require('./routes/mcqRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mcqs', mcqRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('CodeForge API is running');
});

const PORT = process.env.PORT || 5000;

const User = require('./models/User');
const Setting = require('./models/Setting');
const LoginSession = require('./models/LoginSession');
const AssessmentAttempt = require('./models/AssessmentAttempt');
const bcrypt = require('bcryptjs');

const startServer = async () => {
  await connectDB();
  // Sync database models
  await sequelize.sync({ alter: true })
    .then(async () => {
      console.log('MySQL Database synced');
      
      // Seed Admin
      const adminEmail = 'admin@codeforge.com';
      const adminExists = await User.findOne({ where: { email: adminEmail } });
      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Chinni@2105', salt);
        await User.create({
          name: 'Admin',
          email: adminEmail,
          password: hashedPassword,
          role: 'Admin',
          accountStatus: 'APPROVED'
        });
        console.log('Admin seeded successfully');
      } else if (adminExists.accountStatus !== 'APPROVED') {
        adminExists.accountStatus = 'APPROVED';
        await adminExists.save();
        console.log('Admin accountStatus updated to APPROVED');
      }

      // Seed Settings
      const settingsExist = await Setting.count();
      if (settingsExist === 0) {
        await Setting.bulkCreate([
          { key: 'copyPasteProtection', value: true },
          { key: 'practiceMode', value: true },
          { key: 'registrationsEnabled', value: true },
          { key: 'maxTabSwitches', value: 5 }
        ]);
        console.log('Default settings seeded successfully');
      }
    })
    .catch(err => console.error('Error syncing database:', err));

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
