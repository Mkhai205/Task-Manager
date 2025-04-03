import moment from "moment";

/**
 * Định dạng ngày giờ
 * @param {string | Date} date - Ngày cần định dạng
 * @param {string} format - Định dạng (mặc định: "YYYY-MM-DD HH:mm:ss")
 * @returns {string} - Ngày đã định dạng
 */
export const formatDate = (date, format = "YYYY-MM-DD HH:mm:ss") => {
  return moment(date).format(format);
};

/**
 * Chuyển đổi dữ liệu sang JSON một cách an toàn
 * @param {any} data - Dữ liệu cần chuyển đổi
 * @returns {string} - JSON string hoặc '{}' nếu lỗi
 */
export const safeJsonStringify = (data) => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    return "{}";
  }
};

export {
    formatDate,
    safeJsonStringify
}