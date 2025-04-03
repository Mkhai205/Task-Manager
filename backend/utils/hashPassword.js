import bcrypt from "bcrypt";

const saltRounds = 10;

/**
 * Hash mật khẩu
 * @param {string} password - Mật khẩu cần hash
 * @returns {Promise<string>} - Mật khẩu đã hash
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

/**
 * So sánh mật khẩu nhập vào với hash đã lưu
 * @param {string} password - Mật khẩu nhập vào
 * @param {string} hashedPassword - Mật khẩu đã hash trong DB
 * @returns {Promise<boolean>} - true nếu khớp, ngược lại false
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};


export {
    hashPassword,
    comparePassword
}