const joi = require("joi");
const bcrypt = require("bcrypt");
const Account = require("../../models/Account");
const { signToken } = require("../../middlewares/jsonwebtoken");

async function login(request, response, next) {
  try {
    // Validate request data
    await joi
      .object({
        username: joi.string().required(),
        password: joi.string().required(),
        walletAddress: joi.string().required(),
      })
      .validateAsync(request.body);
  } catch (error) {
    return response.status(400).json({
      error: "ValidationError",
      message: error.message,
    });
  }

  try {
    const { username, password, walletAddress } = request.body;
    // console.log(walletAddress);
    // Get account from DB, and verify existance
    const foundAccount = await Account.findOne({ username });
    if (!foundAccount) {
      return response.status(400).json({
        message: "Bad credentials",
      });
    }

    // console.log(foundAccount.walletaddress)

    // Decrypt and verify password
    const passOk = await bcrypt.compare(password, foundAccount.password);
    if (!passOk) {
      return response.status(400).json({
        message: "Bad credentials",
      });
    }
    if (walletAddress != foundAccount.walletaddress) {
      return response.status(400).json({
        message: "Use the registered Wallet.",
      });
    }
  
    // Remove password from response data
    foundAccount.password = undefined;
    delete foundAccount.password;

    // Generate access token
    const token = signToken({ username: foundAccount.username, role: foundAccount.role });

    response.status(200).json({
      message: "Succesfully logged-in",
      data: foundAccount,
      token,
    });
  } catch (error) {
    console.error(error);
    response.status(500).send();
  }
}

module.exports = login;
