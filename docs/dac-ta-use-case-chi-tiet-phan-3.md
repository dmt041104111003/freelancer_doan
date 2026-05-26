# 2.2. Đặc tả Use Case chi tiết – WorkHub (Phần 3)

*Tiếp theo Phần 2 (`dac-ta-use-case-chi-tiet-phan-2.md`). Văn bản dùng tên đầy đủ, không viết tắt. Bảng 2.28 → 2.59.*

---

## V. Thực hiện công việc

### Bảng 2.28 – Use Case Nộp sản phẩm

| | |
|---|---|
| **Mô tả** | Freelancer gửi kết quả công việc (đường liên kết, ghi chú, tệp đính kèm) khi tin đang thực hiện và đã được Employer chọn. |
| **Tác nhân** | Freelancer |
| **Kích hoạt** | Nhấn **Nộp sản phẩm** tại trang công việc đang làm |
| **Điều kiện trước** | Có vai trò Freelancer; tin ở trạng thái đang thực hiện; có đơn ứng tuyển đã được chấp nhận; chưa nộp hoặc được phép nộp lại sau khi Employer yêu cầu chỉnh sửa |
| **Điều kiện sau** | Sản phẩm ở trạng thái đã nộp; thiết lập hạn duyệt cho Employer; Employer nhận thông báo |
| **Luồng sự kiện chính** | 1. Freelancer mở tin trong mục *Việc đang làm*.<br>2. Nhập đường liên kết kết quả, ghi chú (tùy chọn).<br>3. (Tùy chọn) Tải tệp lên, lấy mã tệp theo Use Case Tải tệp đính kèm.<br>4. Nhấn **Nộp**.<br>5. Gọi `POST /api/jobs/{id}/work/submit`.<br>6. Máy chủ lưu bài nộp, xóa hạn nộp, thiết lập hạn duyệt.<br>7. Ghi lịch sử *đã nộp sản phẩm*; gửi thông báo đẩy cho Employer.<br>8. Thông báo thành công. |
| **Luồng sự kiện thay thế** | 3a. Chỉ gửi đường liên kết, không đính kèm tệp.<br>3b. Tải nhiều tệp qua nhiều lần rồi gắn vào bài nộp. |
| **Luồng ngoại lệ** | 5a. Tin không còn đang thực hiện → báo lỗi nghiệp vụ.<br>5b. Không phải ứng viên được chọn → mã lỗi 403.<br>5c. Đã nộp và chưa được yêu cầu sửa → không cho nộp trùng.<br>5d. Quá hạn nộp → tiến trình nền có thể xử lý quá hạn (Use Case 2.32). |
| **Thông tin khác** | Tiền ký quỹ vẫn giữ trên tin cho đến khi Employer duyệt hoặc hệ thống tự duyệt |

### Bảng 2.29 – Use Case Duyệt sản phẩm

| | |
|---|---|
| **Mô tả** | Employer chấp nhận sản phẩm; tin công việc hoàn thành; chuyển **ngân sách** từ tiền ký quỹ vào ví Freelancer. |
| **Tác nhân** | Employer |
| **Kích hoạt** | Nhấn **Duyệt / Chấp nhận** trên bài nộp |
| **Điều kiện trước** | Là chủ tin; Freelancer đã nộp sản phẩm; còn trong hạn duyệt (nếu có) |
| **Điều kiện sau** | Tin hoàn thành; sản phẩm được duyệt; Freelancer nhận ngân sách vào ví; Employer và Freelancer mỗi bên được cộng một điểm uy tín |
| **Luồng sự kiện chính** | 1. Employer mở chi tiết tin hoặc bài nộp.<br>2. Xem đường liên kết, tệp, ghi chú.<br>3. Nhấn **Duyệt**.<br>4. Gọi `POST /api/jobs/{id}/work/approve`.<br>5. Máy chủ duyệt sản phẩm, hoàn thành tin, xóa các hạn thời gian.<br>6. Cộng ngân sách vào ví Freelancer (từ tiền ký quỹ đã khóa lúc đăng tin).<br>7. Cộng điểm uy tín cho Employer và Freelancer.<br>8. Ghi lịch sử *đã duyệt sản phẩm*, *tin hoàn thành*.<br>9. Thông báo Freelancer và Employer. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 4a. Chưa có bài nộp → báo lỗi.<br>4b. Không phải chủ tin → mã lỗi 403.<br>4c. Tin đang tranh chấp → không duyệt trực tiếp. |
| **Thông tin khác** | Phí 5% đăng tin không hoàn cho Employer khi hoàn thành bình thường |

### Bảng 2.30 – Use Case Yêu cầu chỉnh sửa sản phẩm

| | |
|---|---|
| **Mô tả** | Employer từ chối bản nộp hiện tại và yêu cầu Freelancer sửa lại kèm ghi chú. |
| **Tác nhân** | Employer |
| **Kích hoạt** | Nhấn **Yêu cầu chỉnh sửa** |
| **Điều kiện trước** | Tin đang thực hiện; bài đã được nộp; Employer là chủ tin |
| **Điều kiện sau** | Sản phẩm ở trạng thái yêu cầu chỉnh sửa; thiết lập hạn nộp lại (thêm 3 ngày theo mã nguồn); Employer có thể mở tranh chấp sau nhiều lần từ chối (Use Case 2.38) |
| **Luồng sự kiện chính** | 1. Employer xem bài nộp.<br>2. Nhập lý do hoặc ghi chú chỉnh sửa.<br>3. Nhấn gửi yêu cầu.<br>4. Gọi `POST /api/jobs/{id}/work/reject` (nghiệp vụ từ chối bài = yêu cầu sửa).<br>5. Cập nhật trạng thái chỉnh sửa; thiết lập lại hạn nộp.<br>6. Ghi lịch sử *yêu cầu chỉnh sửa sản phẩm*.<br>7. Thông báo Freelancer nộp lại. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 4a. Không có bài để từ chối → báo lỗi.<br>4b. Không phải chủ tin → mã lỗi 403. |
| **Thông tin khác** | Đếm số lần yêu cầu chỉnh sửa để Freelancer được tạo tranh chấp (ít nhất 3 lần) |

### Bảng 2.31 – Use Case Xem công việc đang thực hiện

| | |
|---|---|
| **Mô tả** | Freelancer xem danh sách và thống kê các tin đã được chấp nhận hoặc đang thực hiện. |
| **Tác nhân** | Freelancer |
| **Kích hoạt** | Truy cập `/my-accepted-jobs` hoặc `/my-working-jobs` |
| **Điều kiện trước** | Đã đăng nhập với vai trò Freelancer |
| **Điều kiện sau** | Hiển thị danh sách tin cùng trạng thái nộp bài và hạn thời gian |
| **Luồng sự kiện chính** | 1. Freelancer mở trang việc đang làm.<br>2. Gọi `GET /api/jobs/my-accepted-jobs` hoặc `my-working-jobs`.<br>3. Hiển thị danh sách: tiêu đề, hạn nộp, hạn duyệt, trạng thái sản phẩm.<br>4. (Tùy chọn) Gọi `GET /api/jobs/my-stats` để xem số tin đang làm và đã hoàn thành.<br>5. Chọn tin → nộp bài hoặc xem chi tiết. |
| **Luồng sự kiện thay thế** | 2a. Lọc theo trạng thái trên giao diện. |
| **Luồng ngoại lệ** | 2a. Chưa đăng nhập → chuyển sang trang đăng nhập.<br>2b. Không có tin → hiển thị trống. |
| **Thông tin khác** | — |

### Bảng 2.32 – Use Case Xử lý quá hạn (hệ thống)

| | |
|---|---|
| **Mô tả** | Tiến trình nền tự động xử lý khi quá hạn nộp bài hoặc quá hạn duyệt bài của Employer. |
| **Tác nhân** | Hệ thống |
| **Kích hoạt** | Chạy định kỳ mỗi 5 phút (`JobSchedulerService.checkDeadlines`) |
| **Điều kiện trước** | Tin đang thực hiện; hạn tương ứng đã qua |
| **Điều kiện sau** | **Trường hợp A:** Freelancer quá hạn nộp → đơn bị từ chối, tin mở lại, Freelancer bị trừ uy tín.<br>**Trường hợp B:** Employer quá hạn duyệt → tự duyệt, tin hoàn thành, Freelancer nhận ngân sách, cả hai được cộng uy tín |
| **Luồng sự kiện chính** | **Trường hợp A – Quá hạn nộp:**<br>1. Tìm tin đang thực hiện có hạn nộp đã qua.<br>2. Nếu Freelancer chưa nộp bài.<br>3. Đổi đơn từ chấp nhận sang từ chối; xóa dữ liệu nộp.<br>4. Mở lại tin để tuyển Freelancer mới.<br>5. Freelancer bị cộng điểm không uy tín.<br>6. Ghi lịch sử *Freelancer quá hạn*, *tin được mở lại*.<br>7. Thông báo Freelancer và Employer.<br><br>**Trường hợp B – Quá hạn duyệt:**<br>1. Tìm tin có hạn duyệt đã qua.<br>2. Nếu Freelancer đã nộp, chưa được duyệt.<br>3. Hệ thống tự duyệt và hoàn thành tin.<br>4. Cộng ngân sách vào ví Freelancer.<br>5. Employer và Freelancer được cộng điểm uy tín.<br>6. Ghi lịch sử *Employer quá hạn*, *tự động duyệt*, *tin hoàn thành*.<br>7. Thông báo hai bên. |
| **Luồng sự kiện thay thế** | 2a. Freelancer đã nộp → bỏ qua Trường hợp A.<br>2b. Sản phẩm đã duyệt → bỏ qua Trường hợp B. |
| **Luồng ngoại lệ** | 3a. Không tìm thấy đơn được chấp nhận → ghi nhật ký cảnh báo, bỏ qua tin đó. |
| **Thông tin khác** | Không có tác nhân người dùng trực tiếp thao tác |

---

## VI. Rút / Hủy công việc

### Bảng 2.33 – Use Case Freelancer xin rút việc

| | |
|---|---|
| **Mô tả** | Freelancer yêu cầu rút khỏi tin đang thực hiện; trả phí phạt **12%** trên số tiền ký quỹ. |
| **Tác nhân** | Freelancer |
| **Kích hoạt** | Gửi yêu cầu rút tại trang công việc đang làm |
| **Điều kiện trước** | Tin đang thực hiện; Freelancer là ứng viên được chọn; ví Freelancer đủ 12% tiền ký quỹ; chưa có yêu cầu rút đang chờ |
| **Điều kiện sau** | Yêu cầu rút ở trạng thái chờ; phí phạt đã trừ ví Freelancer; Employer nhận thông báo chờ duyệt |
| **Luồng sự kiện chính** | 1. Freelancer chọn **Xin rút việc**.<br>2. Nhập lý do (tùy chọn).<br>3. Gọi `POST /api/jobs/{jobId}/withdrawal/freelancer`.<br>4. Máy chủ tính phí bằng 12% tiền ký quỹ (làm tròn).<br>5. Kiểm tra số dư và trừ phí ngay.<br>6. Tạo yêu cầu rút của Freelancer ở trạng thái chờ.<br>7. Thông báo Employer. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 5a. Không đủ số dư phí → *"Số dư không đủ..."*.<br>5b. Đã có yêu cầu đang chờ → từ chối tạo mới.<br>5c. Tin không đang thực hiện → báo lỗi. |
| **Thông tin khác** | Tiền ký quỹ hoàn cho Employer khi Employer **duyệt** yêu cầu (Use Case 2.35) |

### Bảng 2.34 – Use Case Employer xin hủy việc

| | |
|---|---|
| **Mô tả** | Employer yêu cầu hủy tin đang thực hiện; trả phí phạt **40%** trên tiền ký quỹ. |
| **Tác nhân** | Employer |
| **Kích hoạt** | Gửi yêu cầu hủy tại trang quản lý tin |
| **Điều kiện trước** | Tin đang thực hiện; là chủ tin; ví Employer đủ 40% tiền ký quỹ; chưa có yêu cầu đang chờ |
| **Điều kiện sau** | Yêu cầu ở trạng thái chờ; phí 40% đã trừ ví Employer; Freelancer nhận thông báo |
| **Luồng sự kiện chính** | 1. Employer chọn **Xin hủy việc**.<br>2. Nhập lý do.<br>3. Gọi `POST /api/jobs/{jobId}/withdrawal/employer`.<br>4. Tính phí 40% tiền ký quỹ.<br>5. Trừ phí khỏi ví Employer.<br>6. Tạo yêu cầu hủy của Employer ở trạng thái chờ.<br>7. Thông báo Freelancer. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | Giống Use Case 2.33 (không đủ phí, trùng yêu cầu chờ, sai trạng thái). |
| **Thông tin khác** | — |

### Bảng 2.35 – Use Case Duyệt yêu cầu rút/hủy

| | |
|---|---|
| **Mô tả** | Bên **không** tạo yêu cầu chấp nhận → hủy tin và hoàn tiền ký quỹ cho Employer. |
| **Tác nhân** | Employer (khi Freelancer xin rút) hoặc Freelancer (khi Employer xin hủy) |
| **Kích hoạt** | Nhấn **Chấp nhận yêu cầu** |
| **Điều kiện trước** | Có yêu cầu rút hoặc hủy đang chờ; người duyệt là bên còn lại |
| **Điều kiện sau** | Yêu cầu được duyệt; tin bị hủy; tiền ký quỹ hoàn về ví Employer |
| **Luồng sự kiện chính** | 1. Bên nhận yêu cầu mở chi tiết.<br>2. Xem lý do và phí phạt đã trừ.<br>3. Gọi `PUT /api/jobs/{jobId}/withdrawal/{requestId}/approve`.<br>4. Máy chủ hủy tin, hoàn tiền ký quỹ cho Employer.<br>5. Cập nhật yêu cầu sang trạng thái đã duyệt.<br>6. Ghi lịch sử; thông báo hai bên. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 3a. Không phải bên được phép duyệt → mã lỗi 403.<br>3b. Yêu cầu không còn ở trạng thái chờ → báo lỗi. |
| **Thông tin khác** | Phí phạt đã trừ lúc tạo yêu cầu không được hoàn |

### Bảng 2.36 – Use Case Từ chối yêu cầu rút/hủy

| | |
|---|---|
| **Mô tả** | Bên còn lại từ chối; tin tiếp tục thực hiện. |
| **Tác nhân** | Employer hoặc Freelancer (bên không tạo yêu cầu) |
| **Kích hoạt** | Nhấn **Từ chối** |
| **Điều kiện trước** | Yêu cầu đang chờ |
| **Điều kiện sau** | Yêu cầu bị từ chối; tin vẫn đang thực hiện |
| **Luồng sự kiện chính** | 1. Bên nhận chọn từ chối.<br>2. Gọi `PUT .../withdrawal/{requestId}/reject`.<br>3. Cập nhật trạng thái từ chối.<br>4. Thông báo người gửi yêu cầu. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 2a. Sai quyền hoặc trạng thái → báo lỗi. |
| **Thông tin khác** | Phí phạt đã trừ **không** được hoàn khi yêu cầu bị từ chối (theo nghiệp vụ hiện tại) |

### Bảng 2.37 – Use Case Hủy yêu cầu rút/hủy (người gửi)

| | |
|---|---|
| **Mô tả** | Người tạo yêu cầu rút hoặc hủy bỏ yêu cầu trước khi bên kia phản hồi. |
| **Tác nhân** | Freelancer hoặc Employer (người tạo yêu cầu) |
| **Kích hoạt** | Nhấn **Hủy yêu cầu** |
| **Điều kiện trước** | Yêu cầu đang chờ; là người tạo yêu cầu |
| **Điều kiện sau** | Yêu cầu bị hủy; tin tiếp tục thực hiện |
| **Luồng sự kiện chính** | 1. Người gửi chọn hủy yêu cầu.<br>2. Gọi API hủy yêu cầu (theo triển khai).<br>3. Đánh dấu yêu cầu đã hủy.<br>4. Thông báo bên còn lại. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 2a. Yêu cầu đã được duyệt hoặc từ chối → không hủy được. |
| **Thông tin khác** | — |

---

## VII. Tranh chấp

### Bảng 2.38 – Use Case Employer tạo tranh chấp

| | |
|---|---|
| **Mô tả** | Employer khiếu nại chất lượng hoặc tiến độ sau khi Freelancer đã nộp sản phẩm. |
| **Tác nhân** | Employer |
| **Kích hoạt** | Gửi biểu mẫu tranh chấp trên tin đang thực hiện |
| **Điều kiện trước** | Tin đang thực hiện; Freelancer đã nộp bài; chưa có tranh chấp đang xử lý |
| **Điều kiện sau** | Tin chuyển sang tranh chấp; chờ phản hồi Freelancer |
| **Luồng sự kiện chính** | 1. Employer mở **Tạo tranh chấp**.<br>2. Nhập mô tả, tải bằng chứng (loại tệp tranh chấp).<br>3. Gọi `POST /api/jobs/{jobId}/disputes`.<br>4. Máy chủ tạo hồ sơ tranh chấp, chuyển trạng thái tin.<br>5. Thông báo Freelancer có thời hạn phản hồi.<br>6. Ghi lịch sử tin. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 3a. Freelancer chưa nộp bài → từ chối.<br>3b. Đã có tranh chấp → từ chối trùng.<br>3c. Không phải chủ tin → mã lỗi 403. |
| **Thông tin khác** | — |

### Bảng 2.39 – Use Case Freelancer phản hồi tranh chấp

| | |
|---|---|
| **Mô tả** | Freelancer gửi lời giải trình và bằng chứng sau khi Employer mở tranh chấp. |
| **Tác nhân** | Freelancer |
| **Kích hoạt** | Gửi phản hồi trong thời hạn |
| **Điều kiện trước** | Tranh chấp do Employer tạo; Freelancer là bên liên quan; còn hạn phản hồi |
| **Điều kiện sau** | Trạng thái chờ Quản trị viên phân xử |
| **Luồng sự kiện chính** | 1. Freelancer đọc nội dung khiếu nại.<br>2. Nhập phản hồi, đính kèm tệp.<br>3. Gọi `POST /api/disputes/{id}/freelancer-response`.<br>4. Lưu phản hồi và bằng chứng.<br>5. Thông báo Quản trị viên có hồ sơ mới. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 3a. Quá hạn phản hồi → Quản trị viên có thể xử lý khi thiếu phản hồi.<br>3b. Không phải Freelancer của tin → mã lỗi 403. |
| **Thông tin khác** | — |

### Bảng 2.40 – Use Case Freelancer tạo tranh chấp

| | |
|---|---|
| **Mô tả** | Freelancer khiếu nại khi bị yêu cầu chỉnh sửa quá nhiều lần (ít nhất **3** lần trong lịch sử tin). |
| **Tác nhân** | Freelancer |
| **Kích hoạt** | Gửi tranh chấp từ tin đang làm |
| **Điều kiện trước** | Tin đang thực hiện; đã có ít nhất 3 lần yêu cầu chỉnh sửa; chưa có tranh chấp đang xử lý |
| **Điều kiện sau** | Tin chuyển tranh chấp; chờ Quản trị viên (không bắt buộc Employer phản hồi trước) |
| **Luồng sự kiện chính** | 1. Freelancer chọn **Tạo tranh chấp**.<br>2. Nhập mô tả và bằng chứng.<br>3. Gọi `POST /api/jobs/{jobId}/disputes/freelancer`.<br>4. Máy chủ kiểm tra số lần yêu cầu chỉnh sửa.<br>5. Tạo tranh chấp, cập nhật trạng thái tin.<br>6. Thông báo Quản trị viên và Employer. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 4a. Chưa đủ 3 lần từ chối → *"Cần ít nhất 3 lần yêu cầu chỉnh sửa"*. |
| **Thông tin khác** | — |

### Bảng 2.41 – Use Case Xem thông tin tranh chấp

| | |
|---|---|
| **Mô tả** | Employer, Freelancer hoặc Quản trị viên xem chi tiết tranh chấp theo tin công việc. |
| **Tác nhân** | Employer, Freelancer, Quản trị viên |
| **Kích hoạt** | Mở trang tranh chấp của job |
| **Điều kiện trước** | Có quyền xem job/dispute |
| **Điều kiện sau** | Hiển thị mô tả, trạng thái, bằng chứng, phản hồi |
| **Luồng sự kiện chính** | 1. Chọn tin có tranh chấp.<br>2. Gọi `GET /api/jobs/{jobId}/disputes`.<br>3. Hiển thị dòng thời gian và tệp bằng chứng.<br>4. (Quản trị viên) mở từ danh sách tranh chấp đang chờ. |
| **Luồng sự kiện thay thế** | 2a. `GET /api/files/dispute/{disputeId}` lấy file đính kèm. |
| **Luồng ngoại lệ** | 2a. Chưa có dispute → 404 / empty. |
| **Thông tin khác** | — |

### Bảng 2.42 – Use Case Quản trị viên phân xử tranh chấp

| | |
|---|---|
| **Mô tả** | Quản trị viên quyết định bên thắng và phân bổ tiền ký quỹ. |
| **Tác nhân** | Quản trị viên |
| **Kích hoạt** | Chọn **Phân xử** trên hồ sơ tranh chấp |
| **Điều kiện trước** | Có vai trò quản trị; tranh chấp chờ quyết định |
| **Điều kiện sau** | Tranh chấp đã xử lý; tin kết thúc theo phương án (hoàn Employer, chi Freelancer, chia tỷ lệ, v.v.) |
| **Luồng sự kiện chính** | 1. Quản trị viên mở `/admin/disputes`.<br>2. Đọc khiếu nại, phản hồi, bằng chứng.<br>3. Chọn **Employer thắng** hoặc **Freelancer thắng** (kèm ghi chú).<br>4. Gọi `POST /api/admin/disputes/{id}/resolve`.<br>5. Máy chủ chuyển tiền ký quỹ, cập nhật tin và tranh chấp.<br>6. Thông báo Employer và Freelancer. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 4a. Dispute đã xử lý → lỗi.<br>4b. Không đủ quyền → 403. |
| **Thông tin khác** | Logic chi tiết trong `DisputeService.resolveDispute` |

### Bảng 2.43 – Use Case Quản trị viên yêu cầu phản hồi bổ sung

| | |
|---|---|
| **Mô tả** | Quản trị viên gia hạn hoặc yêu cầu Freelancer bổ sung phản hồi trước khi phân xử. |
| **Tác nhân** | Quản trị viên |
| **Kích hoạt** | Chọn **Yêu cầu phản hồi** trên hồ sơ tranh chấp |
| **Điều kiện trước** | Tranh chấp đang chờ phản hồi Freelancer |
| **Điều kiện sau** | Hạn phản hồi được gia hạn; Freelancer nhận thông báo |
| **Luồng sự kiện chính** | 1. Quản trị viên xem hồ sơ thiếu thông tin.<br>2. Nhập ghi chú hoặc số ngày gia hạn.<br>3. Gọi `POST /api/admin/disputes/{id}/request-response`.<br>4. Cập nhật hạn phản hồi.<br>5. Gửi thông báo đẩy cho Freelancer. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 3a. Dispute không ở trạng thái phù hợp → lỗi. |
| **Thông tin khác** | — |

---

## VIII. Tài chính

### Bảng 2.44 – Use Case Nạp tiền VNPay

| | |
|---|---|
| **Mô tả** | Nạp số dư ví qua cổng VNPay (redirect + IPN xác nhận). |
| **Tác nhân** | Employer (chủ yếu), Freelancer |
| **Kích hoạt** | Nhấn **Nạp tiền** tại `/wallet` |
| **Điều kiện trước** | Đã đăng nhập; số tiền ≥ **10.000 VND** |
| **Điều kiện sau** | Giao dịch PENDING → sau thanh toán SUCCESS → ví được cộng |
| **Luồng sự kiện chính** | 1. Mở biểu mẫu nạp tiền.<br>2. Nhập số tiền hoặc chọn mức nhanh (50.000 đến 1.000.000 đồng).<br>3. Chọn cổng **VNPay** (mặc định).<br>4. Gọi `POST /api/balance/deposit` → tạo giao dịch chờ và đường dẫn thanh toán.<br>5. Chuyển hướng sang VNPay.<br>6. Người dùng thanh toán.<br>7. VNPay gọi thông báo IPN và/hoặc URL quay về.<br>8. Máy chủ xác thực chữ ký, cộng ví, đánh dấu thành công.<br>9. Trang quay về hiển thị kết quả. |
| **Luồng sự kiện thay thế** | 2a. Dùng số tiền gợi ý sẵn trên giao diện. |
| **Luồng ngoại lệ** | 4a. Số tiền dưới 10.000 đồng → báo lỗi kiểm tra dữ liệu.<br>7a. Thanh toán bị hủy → giao dịch thất bại.<br>7b. Chữ ký IPN sai → không cộng tiền. |
| **Thông tin khác** | Luồng luận văn chỉ mô tả VNPay |

### Bảng 2.45 – Use Case Kiểm tra trạng thái nạp tiền

| | |
|---|---|
| **Mô tả** | Tra cứu kết quả giao dịch nạp theo mã đơn (`appTransId`). |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Sau khi quay về từ VNPay hoặc làm mới trạng thái |
| **Điều kiện trước** | Đã tạo đơn nạp |
| **Điều kiện sau** | Giao diện hiển thị trạng thái chờ, thành công hoặc thất bại |
| **Luồng sự kiện chính** | 1. Trang quay về hoặc trang ví lấy mã giao dịch từ địa chỉ hoặc bộ nhớ cục bộ.<br>2. Gọi `GET /api/balance/deposit/status?appTransId=`.<br>3. Hiển thị trạng thái và số tiền.<br>4. Nếu thành công → cập nhật số dư hiển thị. |
| **Luồng sự kiện thay thế** | 2a. Hỏi trạng thái định kỳ khi giao dịch còn chờ. |
| **Luồng ngoại lệ** | 2a. Không tìm thấy đơn → thông báo lỗi. |
| **Thông tin khác** | — |

### Bảng 2.46 – Use Case Mua điểm ứng tuyển

| | |
|---|---|
| **Mô tả** | Đổi số dư ví lấy điểm ứng tuyển (gói hoặc theo đơn giá ~10.000đ/điểm). |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Chọn gói tại trang ví |
| **Điều kiện trước** | Số dư ví đủ thanh toán gói |
| **Điều kiện sau** | Ví bị trừ tiền; điểm ứng tuyển của người dùng tăng; lưu lịch sử mua điểm |
| **Luồng sự kiện chính** | 1. Mở mục mua điểm.<br>2. Chọn gói (ví dụ: 1 điểm = 10.000 đồng).<br>3. Gọi `POST /api/credits/purchase` với tên gói.<br>4. Máy chủ trừ ví, cộng điểm ứng tuyển.<br>5. Thông báo số điểm mới. |
| **Luồng sự kiện thay thế** | 2a. Mua số lượng tùy chỉnh nếu API hỗ trợ. |
| **Luồng ngoại lệ** | 4a. Không đủ số dư → báo lỗi.<br>4b. Gói không hợp lệ → báo lỗi kiểm tra dữ liệu. |
| **Thông tin khác** | Đăng nhập hàng ngày vẫn nhận 10 điểm miễn phí (Use Case 2.3) |

### Bảng 2.47 – Use Case Xem lịch sử nạp tiền / mua điểm

| | |
|---|---|
| **Mô tả** | Xem danh sách giao dịch nạp ví và mua điểm của bản thân. |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Mở tab lịch sử trong `/wallet` |
| **Điều kiện trước** | Đã đăng nhập |
| **Điều kiện sau** | Hiển thị bảng giao dịch phân trang |
| **Luồng sự kiện chính** | 1. Chọn **Lịch sử nạp**.<br>2. `GET /api/balance/my-deposits`.<br>3. Hiển thị: mã đơn, số tiền, cổng VNPay, trạng thái, thời gian.<br>4. Chọn **Lịch sử mua điểm**.<br>5. `GET /api/credits/my-purchases`.<br>6. Hiển thị gói, số điểm, số tiền. |
| **Luồng sự kiện thay thế** | 2a. Phân trang page/size. |
| **Luồng ngoại lệ** | 2a. Chưa có giao dịch → hiển thị trống. |
| **Thông tin khác** | — |

---

## IX. Chat và thông báo

### Bảng 2.48 – Use Case Gửi yêu cầu kết nối

| | |
|---|---|
| **Mô tả** | Gửi lời mời kết bạn kèm tin nhắn đầu tiên để mở kênh chat 1-1. |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Gửi lời mời từ trang trò chuyện hoặc hồ sơ Freelancer |
| **Điều kiện trước** | Đã đăng nhập; chưa kết nối ACCEPTED; chưa bị chặn |
| **Điều kiện sau** | `FriendRequest` PENDING; người nhận có thông báo |
| **Luồng sự kiện chính** | 1. Tìm người dùng (theo email hoặc danh sách Freelancer).<br>2. Nhập tin nhắn giới thiệu.<br>3. Gọi `POST /api/chat/friend-requests` kèm mã người nhận và nội dung.<br>4. Máy chủ tạo yêu cầu ở trạng thái chờ.<br>5. Thông báo người nhận. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 3a. Đã kết nối → báo lỗi.<br>3b. Đã có yêu cầu đang chờ → báo lỗi.<br>3c. Người dùng bị chặn → từ chối. |
| **Thông tin khác** | Chỉ trò chuyện sau khi yêu cầu được chấp nhận |

### Bảng 2.49 – Use Case Chấp nhận / Từ chối / Hủy yêu cầu kết nối

| | |
|---|---|
| **Mô tả** | Xử lý lời mời kết bạn: nhận, từ chối, hoặc người gửi hủy. |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Thao tác trên danh sách lời mời (received/sent) |
| **Điều kiện trước** | Request ở trạng thái PENDING |
| **Điều kiện sau** | ACCEPTED (mở chat) / REJECTED / CANCELLED |
| **Luồng sự kiện chính** | **Chấp nhận:**<br>1. Người nhận chọn Chấp nhận.<br>2. Gọi `PUT /api/chat/friend-requests/{id}/accept`.<br>3. Trạng thái đã chấp nhận; có thể gửi tin nhắn.<br><br>**Từ chối:**<br>1. Gọi `PUT .../reject`.<br><br>**Hủy (người gửi):**<br>1. Gọi API hủy yêu cầu tương ứng. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 2a. Không phải người nhận/người gửi → 403. |
| **Thông tin khác** | — |

### Bảng 2.50 – Use Case Trao đổi tin nhắn

| | |
|---|---|
| **Mô tả** | Trò chuyện một-một theo thời gian thực: văn bản, ảnh, tệp; trả lời; sửa hoặc xóa tin của mình. |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Gửi tin trong conversation đã kết nối |
| **Điều kiện trước** | FriendRequest ACCEPTED; không bị block |
| **Điều kiện sau** | Tin nhắn lưu vào cơ sở dữ liệu; đối phương nhận qua WebSocket |
| **Luồng sự kiện chính** | 1. Mở `/chat`, chọn hội thoại.<br>2. Gọi API lấy hội thoại và tin nhắn (phân trang).<br>3. Kết nối SockJS và STOMP tới `/ws`.<br>4. Gửi tin qua REST hoặc kênh STOMP.<br>5. Máy chủ lưu và phát tới người đăng ký.<br>6. (Tùy chọn) Trả lời, sửa hoặc xóa tin của mình. |
| **Luồng sự kiện thay thế** | 4a. Gửi ảnh hoặc tệp: tải tệp loại trò chuyện trước, gửi tin kèm mã tệp. |
| **Luồng ngoại lệ** | 4a. Chưa kết nối → không gửi được.<br>4b. Bị chặn → từ chối.<br>4c. Mất kết nối WebSocket → hỏi lại qua REST. |
| **Thông tin khác** | — |

### Bảng 2.51 – Use Case Đánh dấu tin nhắn đã đọc

| | |
|---|---|
| **Mô tả** | Đánh dấu toàn bộ tin trong hội thoại đã đọc. |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Mở hội thoại hoặc rời khỏi tab chat |
| **Điều kiện trước** | Có conversation hợp lệ |
| **Điều kiện sau** | `unreadCount` về 0 cho user hiện tại |
| **Luồng sự kiện chính** | 1. Người dùng mở hội thoại.<br>2. Gọi `PUT /api/chat/conversations/{id}/read`.<br>3. Máy chủ cập nhật thời điểm đọc cuối.<br>4. Giao diện bỏ nhãn chưa đọc. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 2a. Conversation không tồn tại → 404. |
| **Thông tin khác** | — |

### Bảng 2.52 – Use Case Chặn / Bỏ chặn người dùng

| | |
|---|---|
| **Mô tả** | Chặn không nhận tin từ người dùng khác; hoặc bỏ chặn để nhắn lại. |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Chọn Chặn hoặc Bỏ chặn trong trò chuyện |
| **Điều kiện trước** | Đã đăng nhập |
| **Điều kiện sau** | Bản ghi block tạo hoặc xóa |
| **Luồng sự kiện chính** | 1. Trong menu hội thoại chọn **Chặn**.<br>2. `POST /api/chat/block/{userId}`.<br>3. Ngăn gửi/nhận tin mới.<br>4. **Bỏ chặn:** `DELETE /api/chat/block/{userId}`. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 2a. Tự chặn chính mình → lỗi. |
| **Thông tin khác** | — |

### Bảng 2.53 – Use Case Quản lý thông báo

| | |
|---|---|
| **Mô tả** | Xem, đánh dấu đã đọc từng thông báo hoặc tất cả; nhận push realtime. |
| **Tác nhân** | Freelancer, Employer |
| **Kích hoạt** | Mở chuông thông báo / trang notifications |
| **Điều kiện trước** | Đã đăng nhập |
| **Điều kiện sau** | Trạng thái read cập nhật |
| **Luồng sự kiện chính** | 1. Gọi `GET /api/notifications` (phân trang).<br>2. Hiển thị danh sách theo loại: tin công việc, ứng tuyển, nộp bài, tranh chấp, v.v.<br>3. Nhấn một mục → `PUT /api/notifications/{id}/read`.<br>4. **Đọc tất cả** → `PUT /api/notifications/read-all`.<br>5. Sự kiện mới: máy chủ đẩy qua WebSocket. |
| **Luồng sự kiện thay thế** | 2a. Lọc chưa đọc trên giao diện. |
| **Luồng ngoại lệ** | 1a. Lỗi API → thử lại. |
| **Thông tin khác** | — |

### Bảng 2.54 – Use Case Xem lịch sử công việc

| | |
|---|---|
| **Mô tả** | Xem dòng thời gian các sự kiện trên một tin (đăng, duyệt, nộp bài, tranh chấp, v.v.). |
| **Tác nhân** | Freelancer, Employer, Quản trị viên |
| **Kích hoạt** | Mở tab **Lịch sử** tại chi tiết tin công việc |
| **Điều kiện trước** | Có quyền xem tin |
| **Điều kiện sau** | Hiển thị danh sách lịch sử tin công việc |
| **Luồng sự kiện chính** | 1. Mở chi tiết tin.<br>2. Gọi `GET /api/jobs/{id}/history`.<br>3. Hiển thị từng dòng: hành động, mô tả, thời gian, người thực hiện.<br>4. Dùng để tra cứu tranh chấp hoặc đếm số lần yêu cầu chỉnh sửa. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 2a. Tin không tồn tại → mã lỗi 404. |
| **Thông tin khác** | — |

---

## X. Quản trị

### Bảng 2.55 – Use Case Quản trị viên duyệt tin tuyển dụng

| | |
|---|---|
| **Mô tả** | Quản trị viên phê duyệt tin chờ duyệt → tin mở, cho phép Freelancer ứng tuyển. |
| **Tác nhân** | Quản trị viên |
| **Kích hoạt** | Nhấn **Duyệt** trên tin chờ |
| **Điều kiện trước** | Có vai trò quản trị; tin đang chờ duyệt |
| **Điều kiện sau** | Tin chuyển sang đang mở; Employer nhận thông báo |
| **Luồng sự kiện chính** | 1. Quản trị viên mở `/admin/jobs/pending`.<br>2. Xem nội dung tin, ngân sách, tiền ký quỹ.<br>3. Gọi `PUT /api/admin/jobs/{id}/approve`.<br>4. Máy chủ chuyển tin sang trạng thái mở.<br>5. Thông báo Employer; ghi lịch sử. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 3a. Tin không còn chờ duyệt → báo lỗi. |
| **Thông tin khác** | Tiền ký quỹ đã trừ lúc Employer đăng tin |

### Bảng 2.56 – Use Case Quản trị viên từ chối tin tuyển dụng

| | |
|---|---|
| **Mô tả** | Quản trị viên từ chối tin vi phạm; hoàn tiền ký quỹ về ví Employer. |
| **Tác nhân** | Quản trị viên |
| **Kích hoạt** | Nhấn **Từ chối** và nhập lý do |
| **Điều kiện trước** | Tin đang chờ duyệt |
| **Điều kiện sau** | Tin bị từ chối; tiền ký quỹ hoàn cho Employer |
| **Luồng sự kiện chính** | 1. Quản trị viên xem tin.<br>2. Nhập lý do từ chối.<br>3. Gọi `PUT /api/admin/jobs/{id}/reject`.<br>4. Hoàn tiền ký quỹ vào ví Employer.<br>5. Thông báo Employer kèm lý do. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 3a. Thiếu lý do → báo lỗi kiểm tra dữ liệu. |
| **Thông tin khác** | — |

### Bảng 2.57 – Use Case Quản trị viên quản lý người dùng

| | |
|---|---|
| **Mô tả** | Xem danh sách người dùng; bật hoặc tắt tài khoản. |
| **Tác nhân** | Quản trị viên |
| **Kích hoạt** | Truy cập `/admin/users` |
| **Điều kiện trước** | Có vai trò quản trị |
| **Điều kiện sau** | Trạng thái người dùng được cập nhật (nếu có thao tác) |
| **Luồng sự kiện chính** | 1. Quản trị viên mở danh sách người dùng.<br>2. Gọi `GET /api/admin/users` (phân trang, tìm kiếm).<br>3. Xem email, vai trò, trạng thái kích hoạt, điểm uy tín.<br>4. Chọn **Khóa** hoặc **Mở** → `PUT /api/admin/users/{id}/toggle-enabled`.<br>5. Tài khoản bị khóa không đăng nhập được. |
| **Luồng sự kiện thay thế** | 2a. Lọc theo vai trò Freelancer hoặc Employer. |
| **Luồng ngoại lệ** | 4a. Không khóa được chính tài khoản quản trị → báo lỗi (nếu có quy tắc). |
| **Thông tin khác** | — |

### Bảng 2.58 – Use Case Quản trị viên cấp điểm ứng tuyển

| | |
|---|---|
| **Mô tả** | Quản trị viên cộng điểm ứng tuyển thủ công cho người dùng. |
| **Tác nhân** | Quản trị viên |
| **Kích hoạt** | Biểu mẫu cấp điểm trên trang quản trị người dùng |
| **Điều kiện trước** | Có vai trò quản trị |
| **Điều kiện sau** | Điểm ứng tuyển của người dùng tăng |
| **Luồng sự kiện chính** | 1. Quản trị viên chọn người dùng.<br>2. Nhập số điểm cần cộng.<br>3. Gọi `POST /api/admin/users/{id}/grant-credits`.<br>4. Máy chủ cộng điểm ứng tuyển.<br>5. Thông báo thành công. |
| **Luồng sự kiện thay thế** | Không có. |
| **Luồng ngoại lệ** | 3a. Số điểm ≤ 0 → báo lỗi kiểm tra dữ liệu.<br>3b. Người dùng không tồn tại → mã lỗi 404. |
| **Thông tin khác** | — |

### Bảng 2.59 – Use Case Quản trị viên thống kê và xem giao dịch nạp

| | |
|---|---|
| **Mô tả** | Xem số liệu tổng quan và toàn bộ giao dịch nạp tiền trên hệ thống. |
| **Tác nhân** | Quản trị viên |
| **Kích hoạt** | Truy cập bảng điều khiển quản trị |
| **Điều kiện trước** | Có vai trò quản trị |
| **Điều kiện sau** | Hiển thị biểu đồ, số liệu và bảng giao dịch nạp |
| **Luồng sự kiện chính** | 1. Quản trị viên mở `/admin` hoặc mục thống kê.<br>2. Gọi `GET /api/admin/statistics` (người dùng, tin, nạp tiền, tranh chấp, v.v.).<br>3. Gọi `GET /api/admin/balance/deposits` (danh sách nạp toàn hệ thống).<br>4. Hiển thị bảng: người dùng, số tiền, trạng thái, thời gian. |
| **Luồng sự kiện thay thế** | 3a. Lọc theo ngày hoặc trạng thái trên giao diện. |
| **Luồng ngoại lệ** | 2a. Lỗi máy chủ → thông báo. |
| **Thông tin khác** | — |

---

## Chỉ mục file đặc tả đầy đủ

| File | Nội dung |
|------|----------|
| `dac-ta-use-case-chi-tiet.md` | Bảng 2.1 – 2.11 (Xác thực và tài khoản) |
| `dac-ta-use-case-chi-tiet-phan-2.md` | Bảng 2.12 – 2.27 (Tra cứu, tin tuyển dụng, ứng tuyển) |
| `dac-ta-use-case-chi-tiet-phan-3.md` | Bảng 2.28 – 2.59 (Thực hiện công việc đến quản trị) |

*Tổng: **59** Use Case – format bảng đầy đủ (Mô tả, Tác nhân, Kích hoạt, Điều kiện trước/sau, Luồng chính/thay thế/ngoại lệ, Thông tin khác).*
