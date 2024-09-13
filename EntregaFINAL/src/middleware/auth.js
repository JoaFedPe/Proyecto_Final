export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        res.redirect('/profile');
    }
};

export const isAdmin = (req, res, next) => {
    if (req.session.user.rol === 'admin') {
        return next();
    } else {
        return res.status(403).json({ message: 'No puedes acceder, solo Admins.' })
    }
};

export const isUser = (req, res, next) => {
    if (req.session.user.rol === 'user') {
        return next();
    } else {
        return res.status(403).json({ message: 'No puedes acceder, solo Usuarios.' })
    }
};