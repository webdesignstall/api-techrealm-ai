import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  app_name: process.env.APP_NAME,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt: process.env.BCRYPT_SALT,
  jwt_secret: process.env.JWT_SEKRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SEKRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  sendGrid_key: process.env.SENDGRID_KEY,
  sendGrid_email_from: process.env.SENDGRID_EMAIL_FROM,
  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  super_admin_mobile: process.env.SUPER_ADMIN_MOBILE,
  default_pass: process.env.DEFAULT_PASSWORD,
  jwt_mail_verify_secret: process.env.JWT_MAIL_VERIFY_SECRET,
  jwt_mail_verify_expires_in: process.env.JWT_MAIL_VERIFY_EXPIRES_IN,
  password_set_url: process.env.PASSWORD_SET_URL,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  ai_url: process.env.AI_URL,
};
