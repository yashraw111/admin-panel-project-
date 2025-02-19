const Admin = require("../model/admin.model");
const { plainToHash, hashToPlain } = require("../utils/password");
const sendEmail = require("../config/sendMail");
const otpGenerator = require("otp-generator");
const Register = async (req, res) => {
  console.log(req.body);
  try {
    const { userName, email, password } = req.body;

    const existEmail = await Admin.findOne({ email });
    if (existEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    } else {
      req.flash("info", "your registration successfully");
      const hash = await plainToHash(password);
      await Admin.create({ userName, email, password: hash });
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  const existEmail = await Admin.findOne({ email }).countDocuments().exec();
  // console.log(existEmail);

  if (existEmail > 0) {
    const admin = await Admin.findOne({ email });
    // console.log(admin);

    const match_pass = await hashToPlain(password, admin.password);
    if (match_pass) {
      const payload = {
        username: admin.userName,
        email: admin.email,
      };
      res.cookie("admin", payload, { httpOnly: true });
      res.redirect("/");
    } else {
      res.json("password not Match ");
    }
  } else {
    res.json("email is not exist");
  }
};
const updateProfile = async (req, res) => {
  // console.log(req.file);
  // console.log(req.body);

  const { email, userName } = req.body;

  const existEmail = await Admin.findOne({ email }).countDocuments().exec();
  // console.log(existEmail);

  if (existEmail > 0) {
    await Admin.updateOne(
      { email: email },
      { userName, admin_profile: req?.file?.filename }
    );
    res.redirect("/myprofile");
  } else {
    res.json("your email is not Exist");
  }
};
const changePassword = async (req, res) => {
  // console.log(req.body);
  const { currentPass, newPass, confirmPass, email } = req.body;

  const existEmail = await Admin.findOne({ email }).countDocuments().exec();
  // console.log(existEmail);

  if (existEmail > 0) {
    const admin = await Admin.findOne({ email });
    const match = await hashToPlain(currentPass, admin.password);
    if (match) {
      if (newPass == confirmPass) {
        const hash_pass = await plainToHash(newPass);
        await Admin.updateOne({ email: email }, { password: hash_pass });
        res.redirect("/");
      } else {
        console.log("confirm pass not match");
      }
    } else {
      console.log("password Is Wrong");
    }
  } else {
    console.log("email is not exist");
  }
};
const forgotPassword = async (req, res) => {
  console.log(req.body);
  try {
    const { email } = req.body;
    const existEmail = await Admin.findOne({ email }).countDocuments().exec();

    if (existEmail > 0) {
      var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: true,
        specialChars: true,
      });
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
            <h2 style="color: #4CAF50; text-align: center;">Account Verification OTP</h2>
            <p>Dear User,</p>
            <p>We received a request to verify your account. Use the OTP below to complete your verification process. This OTP is valid for the next <b>10 minutes</b>.</p>
            <div style="text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 1px dashed #4CAF50; border-radius: 5px;">${otp}</span>
            </div>
            <p>If you did not request this, please ignore this email. Do not share this OTP with anyone for security reasons.</p>
            <p>Thank you,<br><b>Your Company Name</b></p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #888; text-align: center;">If you have any issues, contact us at <a href="mailto:support@yourcompany.com" style="color: #4CAF50;">support@yourcompany.com</a>.</p>
        </div>
    `;
      const admin = await Admin.updateOne(
        { email: email },
        {
          token: otp,
        }
      );
      await sendEmail(email, "forgot password", htmlContent);
      req.flash("info", "check your email");
      res.redirect("/forgotPassword");
    } else {
      req.flash("info", "email is not Exist");
      res.redirect("/login");
    }
  } catch (error) {
    res.json(error);
  }
};
const updatePassword = async (req, res) => {
  // console.log(req.body);

  try {
    const { token, password, confirmPassword } = req.body;
    const existToken = await Admin.findOne({ token }).countDocuments().exec();
    if (existToken > 0) {
      if (password === confirmPassword) {
        const hash_pass = await plainToHash(password);
        await Admin.updateOne(
          { token: token },
          { password: hash_pass, token: "" }
        );
        req.flash("info", "password change successfully");
        res.redirect("/login");
      } else {
        req.flash("info", "password not match");
        res.redirect("/forgotPassword");
      }
    } else {
      req.flash("info", "token is not Exist");
      res.redirect("/forgotPassword");
    }
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  Register,
  login,
  updateProfile,
  changePassword,
  forgotPassword,
  updatePassword,
};
