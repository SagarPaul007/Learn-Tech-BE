const validator = require("validator");

const validateRegisterInput = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Please enter all fields" });
  } else if (!validator.isEmail(email)) {
    return res.json({ success: false, message: "Please enter a valid email" });
  } else if (!validator.isLength(password, { min: 5, max: 30 })) {
    return res.json({
      success: false,
      message: "Password must be between 5 and 30 characters",
    });
  } else if (!validator.isLength(name, { min: 3, max: 30 })) {
    return res.json({
      success: false,
      message: "Name must be between 3 and 30 characters",
    });
  }
  next();
};

const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "Please enter all fields" });
  }
  next();
};

const validateAddResourceInput = (req, res, next) => {
  const { title, url, description, parentTag } = req.body;
  if (!title || !url || !description || !parentTag) {
    return res.json({ success: false, message: "Please enter all fields" });
  }
  next();
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateAddResourceInput,
};
