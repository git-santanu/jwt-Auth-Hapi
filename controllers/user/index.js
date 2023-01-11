const { success, error } = require("../../response/macros");
const user = require("../../models").user;

exports.userDetails = async (req, res) => {
  try {
    const userDetails = await user.findOne({
      where: {
        id: req.user.id,
      },
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });
    return success(userDetails)(res);
  } catch (err) {
    console.log(err);
    return error(err.message)(res);
  }
};
