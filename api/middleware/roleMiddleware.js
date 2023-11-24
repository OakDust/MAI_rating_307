module.exports = function checkRole(role) {
    return function(req, res, next) {
        // Предположим, что после успешной проверки токена, информация о роли пользователя доступна в req.user.role
        if (req.user && req.user.role === role) {
            next(); // Если роль пользователя совпадает с ожидаемой ролью, переходим к следующему middleware
        } else {
            res.status(403).json({ message: 'У вас нет разрешения для доступа к этому ресурсу.' });
        }
    };
}