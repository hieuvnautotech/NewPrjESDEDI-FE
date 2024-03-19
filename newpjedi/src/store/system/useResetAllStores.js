//Thư viện zustand là một thư viện quản lý trạng thái (state management) dành cho React. Nó cung cấp một cách đơn giản 
//và linh hoạt để tạo và quản lý các store trạng thái trong ứng dụng React mà không cần sử dụng các khái niệm phức tạp như 
//là Redux hoặc MobX.

//Với zustand, bạn có thể tạo các store trạng thái với các hàm tạo store đơn giản, và bạn có thể sử dụng hook useStore 
//để truy cập trạng thái từ bất kỳ thành phần React nào.
import { create } from 'zustand';

const resetters = [];

export const createStore = (f) => {
  if (f === undefined) return createStore;
  const store = create(f);
  const initialState = store.getState();
  resetters.push(() => {
    store.setState(initialState, true);
  });
  return store;
};

export const resetAllStores = () => {
  for (const resetter of resetters) {
    console.log('resetter: ', resetter);
    resetter();
  }
};
//Đoạn mã trên định nghĩa hai hàm và một mảng.

//resetters: Đây là một mảng trống ban đầu được sử dụng để lưu trữ các hàm reset trạng thái của các store. Mỗi hàm trong mảng này sẽ được gọi khi chúng ta muốn đặt lại (reset) trạng thái của tất cả các store về trạng thái ban đầu.

//createStore: Đây là một hàm tạo store, nhận vào một hàm f là hàm tạo store từ thư viện zustand. Trong hàm này:

//Nếu f không được định nghĩa (undefined), hàm trả về chính nó (createStore). Điều này có thể được sử dụng khi gọi hàm createStore mà không cần truyền vào hàm tạo store.

//Nếu f được định nghĩa, hàm tạo store create(f) được gọi để tạo ra một store mới. Sau đó, trạng thái ban đầu của store được lấy ra và lưu vào biến initialState. Hàm resetters.push() được sử dụng để thêm một hàm reset trạng thái của store vào mảng resetters. Hàm này sẽ thiết lập trạng thái của store về trạng thái ban đầu mỗi khi được gọi.

//resetAllStores: Đây là hàm được sử dụng để đặt lại (reset) trạng thái của tất cả các store về trạng thái ban đầu. Trong hàm này:

//Vòng lặp for...of được sử dụng để lặp qua mỗi hàm resetter trong mảng resetters.

//Mỗi hàm resetter được gọi để đặt lại trạng thái của store tương ứng về trạng thái ban đầu.

//Với cách thiết kế này, khi muốn đặt lại trạng thái của tất cả các store, chúng ta chỉ cần gọi hàm resetAllStores().