import { env } from '$env/dynamic/public';

console.info("Ứng dụng chuyển đổi số ver.1 revision 1 build 99482eb");
if (env.PUBLIC_API_URL === undefined) 
    console.warn("Không tìm thấy biến môi trường PUBLIC_API_URL. Sử dụng URL mặc định.");
else console.info("Đang nối với điểm cuối: " + env.PUBLIC_API_URL);