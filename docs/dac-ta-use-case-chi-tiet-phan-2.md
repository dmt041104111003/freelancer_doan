# 2.2. Đặc tả Use Case chi tiết – WorkHub (Phần 2)

*Tiếp theo Phần 1 (`dac-ta-use-case-chi-tiet.md`). Văn bản dùng tên đầy đủ, không viết tắt. Bảng 2.12 → 2.27.*

---

## II. Tra cứu công việc

### Bảng 2.12 – Use Case Xem danh sách công việc

| | |
|---|---|
| **Mô tả** | Hiển thị các tin tuyển dụng đang ở trạng thái OPEN. |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Truy cập trang `/jobs` |
| **Điều kiện trước** | Không bắt buộc đăng nhập (`GET /api/jobs` public) |
| **Điều kiện sau** | Danh sách tin công việc hiển thị theo phân trang, sắp xếp |
| **Luồng sự kiện chính** | 1. Người dùng mở trang Việc làm.<br>2. Ứng dụng gọi API lấy các tin ở trạng thái đang mở (OPEN).<br>3. Hiển thị danh sách: tiêu đề, ngân sách, kỹ năng, thời hạn.<br>4. Người dùng chọn phân trang hoặc sắp xếp. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 2a. Không có tin công việc → hiển thị trống.<br>2b. Lỗi máy chủ → thông báo thử lại. |
| **Thông tin khác** | — |

### Bảng 2.13 – Use Case Xem chi tiết công việc

| | |
|---|---|
| **Mô tả** | Xem đầy đủ thông tin một tin công việc. |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Nhấn vào một tin trong danh sách |
| **Điều kiện trước** | Tin công việc tồn tại |
| **Điều kiện sau** | Hiển thị chi tiết; lượt xem (`viewCount`) tăng thêm một |
| **Luồng sự kiện chính** | 1. Chọn tin công việc → mở trang `/jobs/[id]`.<br>2. Gọi `GET /api/jobs/{id}`.<br>3. Hiển thị mô tả, yêu cầu, sản phẩm bàn giao, ngân sách, người đăng tuyển, trạng thái.<br>4. Nếu đã đăng nhập với vai trò Freelancer: hiển thị nút Ứng tuyển hoặc trạng thái đơn ứng tuyển. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 2a. Tin công việc không tồn tại → mã lỗi 404. |
| **Thông tin khác** | — |

### Bảng 2.14 – Use Case Tìm kiếm công việc

| | |
|---|---|
| **Mô tả** | Tìm tin công việc đang mở theo từ khóa trong tiêu đề hoặc mô tả. |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Nhập từ khóa và thực hiện tìm |
| **Điều kiện trước** | Từ khóa không rỗng |
| **Điều kiện sau** | Danh sách kết quả khớp từ khóa |
| **Luồng sự kiện chính** | 1. Nhập từ khóa ô tìm kiếm.<br>2. Gọi `GET /api/jobs/search?keyword=`.<br>3. Hiển thị kết quả phân trang. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 3a. Không có kết quả → *"Không tìm thấy công việc"*. |
| **Thông tin khác** | — |

### Bảng 2.15 – Use Case Lọc công việc theo kỹ năng

| | |
|---|---|
| **Mô tả** | Lọc tin công việc đang mở có chứa kỹ năng đã chọn. |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Chọn một hoặc nhiều kỹ năng bộ lọc |
| **Điều kiện trước** | Có danh sách kỹ năng |
| **Điều kiện sau** | Danh sách tin công việc khớp kỹ năng |
| **Luồng sự kiện chính** | 1. Chọn kỹ năng trên UI.<br>2. `GET /api/jobs/by-skills?skills=`.<br>3. Hiển thị kết quả. |
| **Luồng sự kiện thay thế** | 1a. Kết hợp với tìm kiếm từ khóa trên client. |
| **Luồng ngoại lệ** | 3a. Không khớp → danh sách rỗng. |
| **Thông tin khác** | — |

### Bảng 2.16 – Use Case Lưu / Bỏ lưu công việc

| | |
|---|---|
| **Mô tả** | Đánh dấu tin công việc quan tâm để xem lại sau. |
| **Tác nhân** | Freelancer |
| **Kích hoạt** | Nhấn biểu tượng Lưu (toggle) |
| **Điều kiện trước** | Đã đăng nhập |
| **Điều kiện sau** | Bản ghi SavedJob tạo hoặc xóa |
| **Luồng sự kiện chính** | 1. Tại chi tiết hoặc danh sách tin công việc, nhấn Lưu.<br>2. Gọi `POST /api/saved-jobs/{jobId}/toggle`.<br>3. Cập nhật biểu tượng trạng thái đã lưu.<br>4. Xem danh sách đã lưu: `GET /api/saved-jobs`. |
| **Luồng sự kiện thay thế** | 2a. Gọi `POST` lưu hoặc `DELETE` bỏ lưu riêng lẻ. |
| **Luồng ngoại lệ** | 2a. Chưa đăng nhập → chuyển sang trang đăng nhập.<br>2b. Tin công việc không tồn tại → báo lỗi. |
| **Thông tin khác** | — |

---

## III. Quản lý tin tuyển dụng (Employer)

### Bảng 2.17 – Use Case Đăng tin tuyển dụng

| | |
|---|---|
| **Mô tả** | Employer tạo tin tuyển dụng; hệ thống trừ ví (ngân sách cộng 5% phí nền tảng) làm tiền ký quỹ; tin chờ Quản trị viên duyệt. |
| **Tác nhân** | Employer |
| **Kích hoạt** | Hoàn tất biểu mẫu tại `/my-posted-jobs/create` |
| **Điều kiện trước** | Có vai trò Employer; số dư ví ≥ ngân sách × 1,05 |
| **Điều kiện sau** | Tin ở trạng thái chờ duyệt (`PENDING_APPROVAL`); tiền ký quỹ bằng ngân sách cộng phí; ví Employer bị trừ tương ứng |
| **Luồng sự kiện chính** | 1. Employer mở biểu mẫu đăng tin.<br>2. Nhập tiêu đề, mô tả, ngữ cảnh, yêu cầu, sản phẩm bàn giao, ngân sách, hạn ứng tuyển, số ngày nộp sản phẩm, số ngày duyệt sản phẩm, kỹ năng, độ phức tạp, loại việc.<br>3. Nhấn **Đăng tin**.<br>4. Máy chủ tính phí 5% làm tròn lên; tổng trừ ví = ngân sách + phí.<br>5. Kiểm tra số dư, trừ ví Employer, lưu tin ở trạng thái chờ duyệt.<br>6. Thông báo thành công; chờ Quản trị viên phê duyệt. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 5a. Không đủ số dư → *"Không đủ số dư để đăng tin"*.<br>5b. Ngân sách ≤ 0 → lỗi kiểm tra dữ liệu.<br>5c. Thiếu quyền Employer → mã lỗi 403. |
| **Thông tin khác** | API `POST /api/jobs`; không trừ điểm ứng tuyển khi đăng tin (chỉ trừ số dư ví) |

### Bảng 2.18 – Use Case Sửa tin tuyển dụng

| | |
|---|---|
| **Mô tả** | Chỉnh sửa tin khi còn ở trạng thái bản nháp và chưa có ứng viên được chọn. |
| **Tác nhân** | Employer |
| **Kích hoạt** | Lưu thay đổi tại `/jobs/[id]/edit` |
| **Điều kiện trước** | Tin thuộc Employer đang đăng nhập; trạng thái bản nháp; chưa có đơn ứng tuyển; chưa có ứng viên được chấp nhận |
| **Điều kiện sau** | Nội dung tin công việc được cập nhật |
| **Luồng sự kiện chính** | 1. Mở biểu mẫu sửa.<br>2. Chỉnh các trường cho phép.<br>3. Gọi `PUT /api/jobs/{id}`.<br>4. Thông báo thành công. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 3a. Tin không còn ở trạng thái bản nháp → *"Chỉ sửa được bản nháp"*.<br>3b. Đã có ứng viên ứng tuyển → không cho sửa.<br>3c. Không phải chủ tin → mã lỗi 403. |
| **Thông tin khác** | — |

### Bảng 2.19 – Use Case Đóng tin tuyển dụng

| | |
|---|---|
| **Mô tả** | Đóng tin, không nhận thêm ứng tuyển. |
| **Tác nhân** | Employer |
| **Kích hoạt** | Chọn **Đóng tin** |
| **Điều kiện trước** | Là chủ tin công việc; trạng thái cho phép đóng |
| **Điều kiện sau** | Tin chuyển sang trạng thái đã đóng (`CLOSED`) |
| **Luồng sự kiện chính** | 1. Chọn đóng.<br>2. `PATCH /api/jobs/{id}/close`.<br>3. Cập nhật trạng thái.<br>4. Thông báo thành công. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 2a. Trạng thái không hợp lệ → lỗi nghiệp vụ. |
| **Thông tin khác** | — |

### Bảng 2.20 – Use Case Chuyển trạng thái tin (Draft ↔ gửi duyệt)

| | |
|---|---|
| **Mô tả** | Chuyển trạng thái giữa bản nháp và gửi duyệt theo API `toggle-status`. |
| **Tác nhân** | Employer |
| **Kích hoạt** | Thao tác chuyển trạng thái trên giao diện quản lý tin |
| **Điều kiện trước** | Là chủ sở hữu tin; đủ điều kiện nghiệp vụ của từng trạng thái |
| **Điều kiện sau** | Trạng thái tin công việc thay đổi tương ứng |
| **Luồng sự kiện chính** | 1. Employer chọn hành động chuyển trạng thái.<br>2. Gọi `PATCH /api/jobs/{id}/toggle-status`.<br>3. Máy chủ kiểm tra và cập nhật.<br>4. Phản hồi lên giao diện. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 3a. Không đủ ví khi chuyển sang chờ duyệt → lỗi (nếu áp dụng). |
| **Thông tin khác** | Chi tiết phụ thuộc logic `Job.toggleStatus` |

### Bảng 2.21 – Use Case Xóa tin tuyển dụng

| | |
|---|---|
| **Mô tả** | Xóa tin công việc khỏi hệ thống khi được phép. |
| **Tác nhân** | Employer |
| **Kích hoạt** | Xác nhận xóa |
| **Điều kiện trước** | Là chủ tin; trạng thái cho phép xóa |
| **Điều kiện sau** | Tin bị xóa hoặc đánh dấu xóa (theo triển khai) |
| **Luồng sự kiện chính** | 1. Chọn Xóa → hộp thoại xác nhận.<br>2. `DELETE /api/jobs/{id}`.<br>3. Thông báo thành công; quay danh sách tin. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 2a. Tin đang thực hiện → không cho xóa.<br>2b. Không phải chủ tin → mã lỗi 403. |
| **Thông tin khác** | — |

### Bảng 2.22 – Use Case Xem tin đã đăng

| | |
|---|---|
| **Mô tả** | Employer xem và lọc các tin do mình đăng. |
| **Tác nhân** | Employer |
| **Kích hoạt** | Truy cập `/my-posted-jobs` |
| **Điều kiện trước** | Đã đăng nhập với vai trò Employer |
| **Điều kiện sau** | Hiển thị danh sách tin công việc của Employer |
| **Luồng sự kiện chính** | 1. Mở trang tin đã đăng.<br>2. Gọi `GET /api/jobs/my-jobs?status=` (tùy chọn lọc theo trạng thái).<br>3. Hiển thị theo trạng thái: chờ duyệt, đang tuyển, đang thực hiện, v.v.<br>4. Chọn tin → xem chi tiết, danh sách ứng viên hoặc chỉnh sửa. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 2a. Chưa đăng nhập → chuyển sang trang đăng nhập. |
| **Thông tin khác** | — |

---

## IV. Ứng tuyển và tuyển chọn

### Bảng 2.23 – Use Case Ứng tuyển công việc

| | |
|---|---|
| **Mô tả** | Freelancer gửi đơn ứng tuyển kèm thư giới thiệu; hệ thống trừ một điểm ứng tuyển. |
| **Tác nhân** | Freelancer |
| **Kích hoạt** | Nhấn **Ứng tuyển** tại chi tiết tin công việc đang mở |
| **Điều kiện trước** | Có vai trò Freelancer; tin đang mở; không phải chủ tin; còn ít nhất một điểm ứng tuyển; chưa ứng tuyển (hoặc đã rút đơn trước đó) |
| **Điều kiện sau** | Đơn ở trạng thái chờ duyệt; trừ một điểm ứng tuyển; Employer nhận thông báo |
| **Luồng sự kiện chính** | 1. Freelancer mở tin công việc đang mở.<br>2. (Tùy chọn) nhập thư giới thiệu.<br>3. Nhấn **Ứng tuyển**.<br>4. Máy chủ trừ một điểm ứng tuyển, tạo hoặc cập nhật đơn ứng tuyển ở trạng thái chờ.<br>5. Tăng số lượng đơn ứng tuyển trên tin.<br>6. Ghi lịch sử tin; gửi thông báo đẩy cho Employer.<br>7. Thông báo số điểm ứng tuyển còn lại. |
| **Luồng sự kiện thay thế** | 4a. Đã từng rút đơn → nộp lại trên bản ghi đơn cũ. |
| **Luồng ngoại lệ** | 4b. Không đủ điểm ứng tuyển → *"Không đủ điểm ứng tuyển"*.<br>4c. Tự ứng tuyển tin do mình đăng → báo lỗi.<br>4d. Tin không còn mở → báo lỗi.<br>4e. Đã ứng tuyển → báo lỗi trùng. |
| **Thông tin khác** | API `POST /api/jobs/{id}/apply` |

### Bảng 2.24 – Use Case Rút đơn ứng tuyển

| | |
|---|---|
| **Mô tả** | Freelancer hủy đơn đang chờ Employer xem xét. |
| **Tác nhân** | Freelancer |
| **Kích hoạt** | Chọn **Rút đơn** |
| **Điều kiện trước** | Có đơn ứng tuyển đang chờ của Freelancer cho tin đó |
| **Điều kiện sau** | Đơn chuyển trạng thái đã rút; điểm ứng tuyển không được hoàn (theo nghiệp vụ hiện tại) |
| **Luồng sự kiện chính** | 1. Freelancer chọn rút đơn.<br>2. Gọi `DELETE /api/jobs/applications/{applicationId}`.<br>3. Cập nhật trạng thái đã rút.<br>4. Thông báo thành công. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 2a. Đơn đã được chấp nhận → không rút được.<br>2b. Không phải chủ đơn → mã lỗi 403. |
| **Thông tin khác** | Điểm ứng tuyển đã trừ khi nộp đơn không tự hoàn |

### Bảng 2.25 – Use Case Xem danh sách ứng viên

| | |
|---|---|
| **Mô tả** | Employer xem các đơn ứng tuyển của một tin công việc. |
| **Tác nhân** | Employer |
| **Kích hoạt** | Mở `/jobs/[id]/applications` |
| **Điều kiện trước** | Là chủ tin công việc |
| **Điều kiện sau** | Hiển thị danh sách ứng viên kèm hồ sơ Freelancer |
| **Luồng sự kiện chính** | 1. Từ trang tin đã đăng, chọn **Xem ứng viên**.<br>2. Gọi `GET /api/jobs/{id}/applications`.<br>3. Hiển thị thư giới thiệu, điểm uy tín, trạng thái đơn.<br>4. Employer chọn **Chấp nhận** hoặc **Từ chối**. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 2a. Không phải chủ tin → mã lỗi 403.<br>2b. Chưa có ứng viên → danh sách rỗng. |
| **Thông tin khác** | — |

### Bảng 2.26 – Use Case Chấp nhận ứng viên

| | |
|---|---|
| **Mô tả** | Employer chọn một Freelancer; tin chuyển sang đang thực hiện; các đơn khác bị từ chối. |
| **Tác nhân** | Employer |
| **Kích hoạt** | Nhấn **Chấp nhận** trên một đơn đang chờ |
| **Điều kiện trước** | Tin đang mở; đơn ứng tuyển hợp lệ và đang chờ |
| **Điều kiện sau** | Đơn được chấp nhận; tin chuyển đang thực hiện; thiết lập hạn nộp sản phẩm; các đơn chờ khác bị từ chối |
| **Luồng sự kiện chính** | 1. Employer chọn ứng viên.<br>2. Gọi `PUT .../applications/{id}/accept`.<br>3. Cập nhật đơn được chấp nhận.<br>4. Tin chuyển đang thực hiện; thiết lập hạn nộp sản phẩm.<br>5. Từ chối hàng loạt các đơn còn lại đang chờ.<br>6. Thông báo Freelancer được chọn và các Freelancer bị từ chối.<br>7. Ghi lịch sử tin công việc. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 2a. Đơn không còn ở trạng thái chờ → báo lỗi.<br>2b. Tin không còn mở → báo lỗi. |
| **Thông tin khác** | Tiền ký quỹ đã trừ lúc đăng tin; chưa chi trả cho Freelancer |

### Bảng 2.27 – Use Case Từ chối ứng viên

| | |
|---|---|
| **Mô tả** | Employer từ chối từng đơn ứng tuyển. |
| **Tác nhân** | Employer |
| **Kích hoạt** | Nhấn **Từ chối** |
| **Điều kiện trước** | Đơn đang ở trạng thái chờ |
| **Điều kiện sau** | Đơn bị từ chối; Freelancer nhận thông báo |
| **Luồng sự kiện chính** | 1. Employer chọn từ chối.<br>2. Gọi `PUT .../reject`.<br>3. Cập nhật trạng thái đơn.<br>4. Gửi thông báo cho Freelancer. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 2a. Không phải chủ tin → mã lỗi 403. |
| **Thông tin khác** | — |

---

*Tiếp theo: `dac-ta-use-case-chi-tiet-phan-3.md` (Bảng 2.28 – 2.59).*
