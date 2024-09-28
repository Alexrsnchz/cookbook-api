const userAuthorizationMiddleware = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    if (parseInt(id) !== userId) {
      return res.status(403).json({
        status: 'error',
        message: "You don't have permission to perform this action",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error validating permissions',
    });
  }
};

export default userAuthorizationMiddleware;
