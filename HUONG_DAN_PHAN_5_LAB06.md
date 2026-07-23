# Hướng dẫn Phần 5 — Hoàn thiện và nghiệm thu Lab 06

## 1. Hoàn thiện `App.jsx`

Đảm bảo ứng dụng hiển thị đủ ba tính năng trong một `Container`:

```jsx
import { Container } from 'react-bootstrap'
import Counter from './features/counter/Counter'
import Todos from './features/todos/Todos'
import Posts from './features/posts/Posts'

export default function App() {
  return (
    <Container className="py-4" style={{ maxWidth: 680 }}>
      <h1 className="mb-4">Redux Toolkit — Lab 06</h1>

      <Counter />
      <Todos />
      <Posts />
    </Container>
  )
}
```

Mỗi component `Counter`, `Todos` và `Posts` nên tự chứa một `Card` riêng.

## 2. Kiểm tra Redux store

File `src/app/store.js` phải đăng ký đủ ba reducer:

```js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import todosReducer from '../features/todos/todosSlice'
import postsReducer from '../features/posts/postsSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
    posts: postsReducer,
  },
})
```

Trong Redux DevTools, state phải có đủ ba nhánh:

```js
{
  counter: {},
  todos: {},
  posts: {}
}
```

Cấu trúc chi tiết của từng nhánh phụ thuộc vào `initialState` của slice tương ứng.

## 3. Kiểm tra Provider và Bootstrap

File `src/main.jsx` phải bọc `App` bằng Redux `Provider` và import CSS của Bootstrap:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App'
import { store } from './app/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
```

## 4. Nội dung đề xuất cho `README.md`

Sao chép phần dưới đây vào file `README.md` của project Lab 06 và thay thông tin repository cho phù hợp.

````md
# Lab 06 — Redux Toolkit trong ReactJS

Ứng dụng minh họa cách quản lý state trong React bằng Redux Toolkit.

## Tính năng

- Counter: tăng, giảm, reset và tăng theo giá trị nhập vào.
- Todos: thêm, đánh dấu hoàn thành và xóa công việc.
- Posts: tải danh sách bài viết bất đồng bộ từ API.
- Giao diện được xây dựng bằng React-Bootstrap.
- Theo dõi action và state bằng Redux DevTools.

## Công nghệ sử dụng

- React
- Vite
- Redux Toolkit
- React-Redux
- React-Bootstrap
- Bootstrap
- JSONPlaceholder API

## Cài đặt

Clone repository:

```bash
git clone <repository-url>
cd <repository-folder>
```

Cài đặt dependencies:

```bash
npm install
```

## Chạy ứng dụng

```bash
npm run dev
```

Sau đó mở địa chỉ được Vite hiển thị, thông thường:

```text
http://localhost:5173
```

## Build production

```bash
npm run build
```

Nếu build thành công, kết quả được tạo trong thư mục `dist`.

## Cấu trúc thư mục

```text
src/
├── app/
│   └── store.js
├── features/
│   ├── counter/
│   │   ├── counterSlice.js
│   │   └── Counter.jsx
│   ├── todos/
│   │   ├── todosSlice.js
│   │   └── Todos.jsx
│   └── posts/
│       ├── postsSlice.js
│       └── Posts.jsx
├── App.jsx
└── main.jsx
```

## Luồng dữ liệu Redux

1. Người dùng tương tác với giao diện.
2. Component gọi `dispatch(action)`.
3. Reducer xử lý action và cập nhật state.
4. `useSelector` nhận state mới.
5. React render lại component liên quan.

## Kiểm tra Redux DevTools

Redux DevTools phải hiển thị ba nhánh state:

- `counter`
- `todos`
- `posts`

Các action có thể quan sát gồm:

- Counter: tăng, giảm và reset.
- Todos: thêm, toggle và xóa todo.
- Posts: `pending`, `fulfilled` hoặc `rejected`.

## API sử dụng

Posts được tải từ JSONPlaceholder:

```text
https://jsonplaceholder.typicode.com/posts?_limit=5
```
````

## 5. Chạy kiểm tra

Chạy lần lượt các lệnh sau:

```bash
npm run build
npm run lint
npm run dev
```

Kiểm tra thủ công trên trình duyệt:

- Counter tăng, giảm và reset chính xác.
- Todo có thể thêm, toggle và xóa.
- Posts hiển thị trạng thái loading.
- Posts hiển thị dữ liệu khi gọi API thành công.
- Posts hiển thị thông báo khi gọi API thất bại.
- Console trình duyệt không có lỗi đỏ.
- Redux DevTools có đủ ba nhánh state.
- Các tính năng không làm thay đổi state của nhau.

Không nên commit thư mục `dist`. Đảm bảo `.gitignore` có:

```gitignore
node_modules
dist
.env
.env.local
```

## 6. Cập nhật checklist trong `HuongDan_Lab06.md`

Chỉ đổi `[ ]` thành `[x]` sau khi yêu cầu tương ứng đã được kiểm tra thực tế:

```md
## Phần 5 — Hoàn thiện & nghiệm thu

### TODO

- [x] `App.jsx` render đủ 3 component trong `Container`.
- [x] Kiểm tra `src/app/store.js` đã có đủ 3 reducer.
- [x] Chạy `npm run build` để chắc chắn không lỗi biên dịch.
- [x] Viết `README.md` mô tả cách chạy.

### Checklist nghiệm thu cuối cùng ✅

- [x] 3 tính năng hiển thị trong 3 `Card` riêng.
- [x] Cả 3 tính năng hoạt động độc lập.
- [x] `npm run build` thành công.
- [x] Redux DevTools hiển thị `counter`, `todos`, `posts`.
- [x] Không có lỗi/cảnh báo đỏ trong Console.
- [x] Code được tổ chức theo feature folder.
```

Nếu chưa kiểm tra Redux DevTools hoặc Console, phải giữ nguyên `[ ]`. Không đánh dấu hoàn thành chỉ dựa trên việc `npm run build` thành công.

## 7. Commit Phần 5

### Phương án khuyến nghị: tách hai commit

Commit hoàn thiện và kiểm tra ứng dụng:

```bash
git add src package.json package-lock.json
git commit -m "chore(lab): TODO-05 - finalize application and verify build"
```

Commit README và checklist:

```bash
git add README.md HuongDan_Lab06.md
git commit -m "docs(lab-guide): document setup and mark verified tasks complete"
```

Trước mỗi commit, chạy:

```bash
git status
git diff --staged
```

Việc này giúp bảo đảm commit chỉ chứa đúng các file liên quan.

### Phương án một commit

Nếu giảng viên yêu cầu mỗi TODO tương ứng đúng một commit:

```bash
git add src README.md HuongDan_Lab06.md package.json package-lock.json
git commit -m "chore(lab): TODO-05 - finalize application and verification checklist"
```

## 8. Checklist trước khi nộp bài

- [ ] Đã chạy `npm install` thành công.
- [ ] Đã chạy `npm run lint` thành công.
- [ ] Đã chạy `npm run build` thành công.
- [ ] Counter hoạt động đúng.
- [ ] Todos hoạt động đúng.
- [ ] Posts xử lý đủ loading, success và error.
- [ ] Ba tính năng nằm trong ba `Card` riêng.
- [ ] Redux DevTools hiển thị đủ ba nhánh state.
- [ ] Console trình duyệt không có lỗi đỏ.
- [ ] Source code được tổ chức theo feature folder.
- [ ] README có hướng dẫn cài đặt và chạy project.
- [ ] Chỉ đánh dấu `[x]` cho nội dung đã kiểm tra.
- [ ] `git status` không còn file cần commit.
- [ ] Không commit `node_modules` hoặc `dist`.

