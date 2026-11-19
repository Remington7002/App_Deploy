const fs = require('fs');
const path = require('path');
const vm = require('vm');
const files = ['server.js', 'config/db.js', 'models/User.js', 'models/Complaint.js',
  'middleware/auth.js', 'routes/authRoutes.js', 'routes/metaRoutes.js',
  'routes/complaintRoutes.js', 'routes/dashboardRoutes.js', 'utils/http.js',
  'utils/constants.js', 'scripts/seedAdmins.js'];
for (const file of files) {
  const code = fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
  new vm.Script(code, { filename: file });
  console.log('Syntax OK:', file);
}
