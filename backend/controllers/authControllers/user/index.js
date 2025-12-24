const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ROLES_LIST = require('@/config/roles_list.js');
const userModel = require('@/models/authModels/user');

exports.create = async (req, res) => {
   const schema = Joi.object({
      id: Joi.required(),
      user_id: Joi.string().min(3).max(30).required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
      cpassword: Joi.string().valid(Joi.ref('password')).required().messages({
         'any.only': 'Confirm Password must match Password!',
         'any.required': 'Confirm Password is required!',
      }),
   });

   try {
      const { id, user_id, password, cpassword } = req.body;
      console.log(req.body);

      const { error } = schema.validate({ id, user_id, password, cpassword });
      if (error) {
         return res.status(400).json({
            err: error,
            status: false,
            msg: error.message,
         });
      }
      const salt = bcrypt.genSaltSync(12);
      const hash = bcrypt.hashSync(password, salt);
      const result = await userModel.create(id, user_id, hash);
      console.log(result);

      if (!result.status) {
         return res.status(500).json({
            status: false,
            msg: 'Something Went Wrong!',
         });
      }
      return res.status(200).json({ status: true, msg: 'User Created Successfully! Now you can login ' });
   } catch (err) {
      console.log(err);
      return res.status(500).json({
         status: false,
         errMsg: err.message,
         error: err,
         msg: 'Something Went Wrong!',
      });
   }
};
exports.handleLogin = async (req, res) => {
   const { user_id, password } = req.body;

   if (!user_id || !password) {
      return res.status(400).json({ status: false, message: 'user_id and password are required.' });
   }

   const schema = Joi.object({
      user_id: Joi.string().required().messages({ 'any.required': 'User ID is required!' }),
      password: Joi.string().required().messages({ 'any.required': 'Password is required!' }),
   });

   const { error } = schema.validate({ user_id, password });
   if (error) {
      return res.status(400).json({ status: false, message: error.message });
   }

   try {
      const result = await userModel.findByLoginInfo(user_id);
      if (!result) {
         return res.status(404).json({ status: false, msg: 'User not found!' });
      }

      const match = await bcrypt.compare(password, result.password);
      if (!match) {
         return res.status(400).json({ status: false, message: 'Invalid user_id or password!' });
      }

      const roles = ROLES_LIST.SuperAdmin;
      const accessToken = jwt.sign(
         {
            UserInfo: {
               user_id: result.id,
               user_id_alias: result.user_id,
               roles: roles,
            },
         },
         process.env.ACCESS_TOKEN_SECRET,
         { expiresIn: '10d' }
      );

      const refreshToken = jwt.sign({ user_id: result.user_id }, process.env.REFRESH_TOKEN_SECRET, {
         expiresIn: '30d',
      });
      await userModel.updateRefreshToken(result.id, refreshToken);
      res.cookie('jwt', refreshToken, {
         httpOnly: true,
         sameSite: 'None',
         secure: false,
         maxAge: 24 * 60 * 60 * 1000,
      });

      return res
         .status(200)
         .json({ status: true, msg: 'Successfully Login !', data: { role: 'super_admin', accessToken, refreshToken } });
   } catch (err) {
      console.error('Login Error:', err.message);
      return res.status(500).json({
         status: false,
         message: 'Something Went Wrong! Internal Server Error',
         error: err.message,
      });
   }
};

exports.handleRefreshToken = async (req, res) => {
   const cookies = req.cookies;
   if (!cookies?.jwt) return res.status(204).json({ status: true, msg: 'Refresh Failed! No Content' });
   const refreshToken = cookies.jwt;
   const foundUser = await userModel.getUserByToken(refreshToken);
   if (!foundUser) return res.status(403).json({ status: true, msg: 'User Not Found !' });
   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || foundUser.user_id !== decoded.user_id)
         return res.status(403).json({ status: true, msg: 'User Not Found !' });
      // const roles = Object.values(foundUser.roles);
      const roles = ROLES_LIST.SuperAdmin;
      const accessToken = jwt.sign(
         {
            UserInfo: {
               user_id: decoded.user_id,
               roles: roles,
            },
         },
         process.env.ACCESS_TOKEN_SECRET,
         { expiresIn: '10d' }
      );
      res.status(200).json({ status: true, msg: 'Successfully Login Refreshed !', accessToken });
   });
};

exports.handleLogout = async (req, res) => {
   const cookies = req.cookies;
   if (!cookies?.jwt) return res.status(204).json({ status: true, msg: 'Refresh Failed! No Content' });
   const refreshToken = cookies.jwt;
   const foundUser = await userModel.getUserByToken(refreshToken);
   if (!foundUser) {
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
      return res.status(204).json({ status: true, msg: 'Refresh Failed! No Content' });
   }
   // Delete refreshToken in db
   const DeleteToken = await userModel.DeleteToken(refreshToken);
   res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
   res.status(201).json({ status: true, msg: 'Account Logged out successfully!' });
};
