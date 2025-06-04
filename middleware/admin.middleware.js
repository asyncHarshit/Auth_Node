const isAdminUser = (req, res, next) => {
    if (!req.userInfo || req.userInfo.role !== 'admin') {
        return res.status(403).json({
            message: "Access denied! Admin rights required."
        });
    }
    next();
};

export default isAdminUser;
