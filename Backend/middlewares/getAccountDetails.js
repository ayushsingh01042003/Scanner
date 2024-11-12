import Account from "../models/account.model.js";

const getAccountDetails = async (req, res, next) => {
    try {
      const account = await Account.findById(req.user.id);
      if (!account) {
        return res.status(404).json({ msg: "Account not found" });
      }
      req.account = account;
      next();
    } catch (error) {
      res.status(500).json({ msg: "Error fetching account details" });
    }
};

export default getAccountDetails;