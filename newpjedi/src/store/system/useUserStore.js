import { create } from 'zustand';
import { CURRENT_USER } from '@constants/ConfigConstants';

//Dòng mã import { CURRENT_USER } from '@constants/ConfigConstants'; là một câu lệnh import trong JavaScript. 
// Trong trường hợp này, nó đang import một biến hoặc hằng số có tên CURRENT_USER từ một module được gọi là ConfigConstants, 
// mà được đặt trong thư mục constants của dự án.

// Cách viết @constants trong import có thể là một cách thường được sử dụng để chỉ đến một đường dẫn tương đối hoặc alias được cấu 
// hình trong dự án, thường được sử dụng để tránh việc phải chỉ định đường dẫn tuyệt đối từ thư mục gốc của dự án.

// Hằng số hoặc biến CURRENT_USER được import có thể được sử dụng để lưu trữ thông tin của người dùng hiện tại trong ứng dụng. Điều 
// này có thể bao gồm thông tin như tên người dùng, quyền hạn, hoặc bất kỳ dữ liệu nào liên quan đến người dùng đang đăng nhập.
import { persist } from 'zustand/middleware';

//Dòng mã import { persist } from 'zustand/middleware'; là một câu lệnh import trong JavaScript. Trong trường hợp này, 
// nó đang import một hàm hoặc biến được gọi là persist từ một module nằm trong thư viện zustand/middleware.

// Zustand là một thư viện quản lý trạng thái cho ứng dụng React. Trong trường hợp này, persist có thể là một middleware được 
// cung cấp bởi thư viện này để hỗ trợ việc lưu trữ trạng thái ứng dụng vào local storage hoặc các cơ sở dữ liệu khác nhau giữa 
// các phiên làm việc.

// Điều này có thể giúp ứng dụng của bạn duy trì trạng thái ngay cả khi trang web được tải lại hoặc trình duyệt được khởi động lại, 
// cải thiện trải nghiệm người dùng và giảm mất mát dữ liệu.


// define the initial state
const initialUser = {
    userId: null,
    userName: null,
    lastLoginOnWeb: null,
    RoleNameList: null,
    RoleCodeList: null,
    row_version: null,
  };
const useUserStore = create(
    persist(
      (set, get) => ({
        user: initialUser,
        kickOutState: false,
        kickOutMessage: 'general.Initializing',
        missingPermission: [],
        missingPermissionGroupByRole: [],
  
        dispatchSetUser: (user) => {
          set({ user: user });
        },
  
        dispatchRemoveUser: () => {
          set({ user: initialUser });
          set({ missingPermission: [] });
          set({ missingPermissionGroupByRole: [] });
          // localStorage.removeItem(CURRENT_USER);
        },
  
        dispatchSetKickOutState: (flag) => {
          set({ kickOutState: flag });
        },
        dispatchSetKickOutMessage: (message) => set({ kickOutMessage: message }),
  
        dispatchSetMissingPermission: (missingPermissionData) => set({ missingPermission: missingPermissionData }),
        dispatchSetMissingPermissionGroupByRole: (missingPermissionGroupByRoleData) =>
          set({ missingPermissionGroupByRole: missingPermissionGroupByRoleData }),
      }),
      {
        name: CURRENT_USER, // unique name
      }
    )
  );
  
  export default useUserStore;
  //Đoạn mã trên định nghĩa một hook tên là useUserStore bằng cách sử dụng hàm create từ một thư viện không rõ nguồn gốc 
//   (có thể là Zustand hoặc một thư viện tương tự). Hook này được tạo ra để quản lý trạng thái của người dùng trong ứng dụng React.

// Cụ thể, useUserStore được khởi tạo với một trạng thái ban đầu và các hàm dispatch để cập nhật trạng thái. Trong đó:

// persist là một middleware được sử dụng để lưu trữ trạng thái của hook vào local storage hoặc cơ sở dữ liệu khác.
// Hàm set được cung cấp để cập nhật trạng thái của hook.
// Các thuộc tính trong đối tượng trạng thái bao gồm user (người dùng hiện tại), kickOutState (trạng thái kick-out), kickOutMessage 
// (thông báo khi bị kick-out), missingPermission (danh sách quyền bị thiếu), và missingPermissionGroupByRole (danh sách quyền bị 
//     thiếu được nhóm theo vai trò).
// Các hàm dispatch được sử dụng để cập nhật các giá trị trong trạng thái, bao gồm cả việc đặt người dùng, loại bỏ người dùng, cài 
// đặt trạng thái kick-out, cài đặt thông báo kick-out, cài đặt danh sách quyền bị thiếu, và cài đặt danh sách quyền bị thiếu được 
// nhóm theo vai trò.
// Sau khi hook useUserStore được tạo, nó được xuất ra mặc định để có thể sử dụng trong các thành phần React khác trong ứng dụng.