// // middleware/protect.js
// const protect = (req, res, next) => {
//   // express-openid-connect додає об'єкт oidc
//   if (req.oidc && req.oidc.isAuthenticated()) {
//     // Якщо oidc.user є, але req.user порожній — копіюємо дані
//     if (!req.user && req.oidc.user) {
//        req.user = req.oidc.user;
//     }
//     return next();
//   }

//   res.status(401).json({ message: "Ви не залогінені в Auth0" });
// };

// export default protect;


const protect = (req, res, next) => {
  if (req.oidc.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: "Not Authorized" });
  }
};

export default protect;
