// Dòng mã export const CURRENT_USER = ${company}_USER; là một câu lệnh export trong JavaScript. Trong trường hợp này, nó đang 
// export một hằng số có tên CURRENT_USER.

// Giá trị của hằng số này được đặt bằng biểu thức ${company}_USER, trong đó company có thể là một biến hoặc hằng số trước đó đã 
// được định nghĩa trong mã. Biểu thức này sẽ tạo ra một chuỗi mới bằng cách nối giá trị của biến company với _USER.

// Ví dụ, nếu company được định nghĩa là 'ABC', thì giá trị của CURRENT_USER sẽ là 'ABC_USER'.

// Điều này giúp dễ dàng cấu hình hằng số CURRENT_USER dựa trên một giá trị động của company.

const company = 'ESD';
export const CURRENT_USER = `${company}_USER`;
