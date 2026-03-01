const authRoutes = require('./auth.routes')
const userRoutes = require('./user.routes')

module.exports = function registerRoutes(app){
    app.use('/api/auth', authRoutes);
    app.use('/api/user', userRoutes);
};