#!/usr/bin/env python3
"""Generate 13 Use Case diagram HTML files (WorkHub thesis style)."""
from pathlib import Path

OUT = Path(__file__).parent

def stick_figure(x, y, label, label_dy=78):
    return f'''
  <g transform="translate({x},{y})">
    <circle cx="0" cy="-25" r="12" fill="none" stroke="#000" stroke-width="1.5"/>
    <line x1="0" y1="-13" x2="0" y2="15" stroke="#000" stroke-width="1.5"/>
    <line x1="0" y1="0" x2="-18" y2="12" stroke="#000" stroke-width="1.5"/>
    <line x1="0" y1="0" x2="18" y2="12" stroke="#000" stroke-width="1.5"/>
    <line x1="0" y1="15" x2="-14" y2="38" stroke="#000" stroke-width="1.5"/>
    <line x1="0" y1="15" x2="14" y2="38" stroke="#000" stroke-width="1.5"/>
    <text x="0" y="{label_dy}" text-anchor="middle" font-family="Arial,sans-serif" font-size="13">{label}</text>
  </g>'''

def system_actor(x, y, label):
    return f'''
  <g transform="translate({x},{y})">
    <rect x="-55" y="-20" width="110" height="40" fill="none" stroke="#000" stroke-width="1.5"/>
    <text x="0" y="5" text-anchor="middle" font-family="Arial,sans-serif" font-size="13">{label}</text>
    <text x="0" y="55" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-style="italic">«Hệ thống»</text>
  </g>'''

def ellipse(cx, cy, rx, ry, text, fs=12):
  # wrap long text
  lines = text.split("\n") if "\n" in text else [text]
  tspans = "".join(
    f'<tspan x="{cx}" dy="{fs+4 if i else 0}">{ln}</tspan>'
    for i, ln in enumerate(lines)
  )
  dy_start = -(len(lines) - 1) * (fs + 2) / 2
  return f'''
  <ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#fff" stroke="#000" stroke-width="1.5"/>
  <text x="{cx}" y="{cy + dy_start + 4}" text-anchor="middle" font-family="Arial,sans-serif" font-size="{fs}" fill="#000">{tspans}</text>'''

def include_arrow(x1, y1, x2, y2):
    mid = (x1 + x2) / 2
    return f'''
  <path d="M {x1} {y1} L {x2} {y2}" fill="none" stroke="#000" stroke-width="1.2" stroke-dasharray="6,4" marker-end="url(#arrow)"/>
  <text x="{mid}" y="{y1 - 8}" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#000">&lt;&lt;include&gt;&gt;</text>'''

def render(diagram):
    n = len(diagram["includes"])
    h = max(280, 70 + n * 75)
    w = 920
    main_x, main_y = 300, h / 2
    inc_x = 620
    start_y = h / 2 - (n - 1) * 37.5
    actors_html = ""
    if diagram.get("system"):
        actors_html = system_actor(70, h / 2 - 10, diagram["actors"][0])
    else:
        ay = h / 2 - (len(diagram["actors"]) - 1) * 45
        for i, act in enumerate(diagram["actors"]):
            actors_html += stick_figure(70, ay + i * 90, act)

    inc_html = ""
    arrows = ""
    for i, inc in enumerate(diagram["includes"]):
        cy = start_y + i * 75
        inc_html += ellipse(inc_x, cy, 115, 28, inc)
        arrows += include_arrow(main_x + 120, main_y, inc_x - 118, cy)

    main_html = ellipse(main_x, main_y, diagram.get("main_rx", 125), diagram.get("main_ry", 32), diagram["main"], fs=13)

  # association lines actor to main
    assoc = ""
    ax = 130
    for i in range(len(diagram["actors"]) if not diagram.get("system") else 1):
        ay = (h / 2 - (len(diagram["actors"]) - 1) * 45 + i * 90 + 15) if not diagram.get("system") else h/2
        assoc += f'<line x1="{ax}" y1="{ay}" x2="{main_x - 125}" y2="{main_y}" stroke="#000" stroke-width="1.5"/>'

    return f'''<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8"/>
  <title>{diagram["title"]}</title>
  <style>
    body {{ font-family: "Times New Roman", Arial, serif; background: #fff; margin: 0; padding: 24px; }}
    h2 {{ text-align: center; font-size: 14pt; font-weight: normal; margin: 0 0 20px; }}
    .wrap {{ display: flex; justify-content: center; overflow-x: auto; }}
  </style>
</head>
<body>
  <h2>{diagram["title"]}</h2>
  <div class="wrap">
    <svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#000"/>
        </marker>
      </defs>
      {actors_html}
      {assoc}
      {main_html}
      {inc_html}
      {arrows}
    </svg>
  </div>
</body>
</html>'''

DIAGRAMS = [
    {
        "file": "uc-bang-2-01-quan-ly-tai-khoan.html",
        "title": "2.2.3.1. Biểu đồ use case Quản lý tài khoản",
        "actors": ["Người dùng"],
        "main": "Quản lý tài khoản",
        "includes": ["Đăng ký và xác thực OTP", "Đăng nhập và đăng xuất", "Khôi phục mật khẩu", "Cập nhật hồ sơ"],
        "main_rx": 130,
    },
    {
        "file": "uc-bang-2-02-tai-tep-dinh-kem.html",
        "title": "2.2.3.2. Biểu đồ use case Tải tệp đính kèm",
        "actors": ["Người dùng"],
        "main": "Tải tệp đính kèm",
        "includes": ["Chọn tệp", "Upload lên Cloudinary", "Gán tệp vào nghiệp vụ"],
    },
    {
        "file": "uc-bang-2-03-tra-cuu-thong-tin.html",
        "title": "2.2.3.3. Biểu đồ use case Tra cứu thông tin",
        "actors": ["Người dùng"],
        "main": "Tra cứu thông tin",
        "includes": ["Tra cứu tin công việc", "Tìm kiếm và lọc kỹ năng", "Lưu tin quan tâm", "Tra cứu Freelancer"],
    },
    {
        "file": "uc-bang-2-04-trao-doi-thong-bao.html",
        "title": "2.2.3.4. Biểu đồ use case Trao đổi và thông báo",
        "actors": ["Người dùng"],
        "main": "Trao đổi và thông báo",
        "includes": ["Quản lý kết nối", "Trao đổi tin nhắn", "Quản lý thông báo"],
        "main_rx": 135,
    },
    {
        "file": "uc-bang-2-05-quan-ly-tai-chinh.html",
        "title": "2.2.3.5. Biểu đồ use case Quản lý tài chính",
        "actors": ["Người dùng"],
        "main": "Quản lý tài chính",
        "includes": ["Nạp tiền VNPay", "Mua điểm ứng tuyển", "Xem lịch sử giao dịch"],
    },
    {
        "file": "uc-bang-2-06-quan-ly-tin-tuyen-dung.html",
        "title": "2.2.3.6. Biểu đồ use case Quản lý tin tuyển dụng",
        "actors": ["Người đăng tuyển"],
        "main": "Quản lý tin tuyển dụng",
        "includes": ["Đăng tin tuyển dụng", "Chờ quản trị duyệt", "Sửa, đóng, xóa tin"],
        "main_rx": 140,
    },
    {
        "file": "uc-bang-2-07-quan-ly-ung-tuyen.html",
        "title": "2.2.3.7. Biểu đồ use case Quản lý ứng tuyển",
        "actors": ["Người làm việc tự do", "Người đăng tuyển"],
        "main": "Quản lý ứng tuyển",
        "includes": ["Ứng tuyển công việc", "Rút đơn ứng tuyển", "Duyệt hoặc từ chối ứng viên"],
        "main_rx": 125,
    },
    {
        "file": "uc-bang-2-08-thuc-hien-cong-viec.html",
        "title": "2.2.3.8. Biểu đồ use case Quản lý thực hiện công việc",
        "actors": ["Người làm việc tự do", "Người đăng tuyển"],
        "main": "Quản lý thực hiện\ncông việc",
        "includes": ["Nộp sản phẩm", "Duyệt sản phẩm", "Yêu cầu chỉnh sửa"],
        "main_rx": 130,
    },
    {
        "file": "uc-bang-2-09-rut-huy-cong-viec.html",
        "title": "2.2.3.9. Biểu đồ use case Quản lý rút / hủy công việc",
        "actors": ["Người làm việc tự do", "Người đăng tuyển"],
        "main": "Quản lý rút / hủy\ncông việc",
        "includes": ["Gửi yêu cầu rút/hủy", "Duyệt yêu cầu", "Từ chối hoặc hủy yêu cầu"],
        "main_rx": 125,
    },
    {
        "file": "uc-bang-2-10-quan-ly-tranh-chap.html",
        "title": "2.2.3.10. Biểu đồ use case Quản lý tranh chấp",
        "actors": ["Người dùng", "Quản trị viên"],
        "main": "Quản lý tranh chấp",
        "includes": ["Tạo tranh chấp", "Phản hồi tranh chấp", "Phân xử tranh chấp"],
    },
    {
        "file": "uc-bang-2-11-lich-su-cong-viec.html",
        "title": "2.2.3.11. Biểu đồ use case Xem lịch sử công việc",
        "actors": ["Người dùng"],
        "main": "Xem lịch sử công việc",
        "includes": ["Xem timeline sự kiện", "Tra cứu lịch sử tin"],
    },
    {
        "file": "uc-bang-2-12-quan-tri-he-thong.html",
        "title": "2.2.3.12. Biểu đồ use case Quản trị hệ thống",
        "actors": ["Quản trị viên"],
        "main": "Quản trị hệ thống",
        "includes": ["Duyệt tin tuyển dụng", "Quản lý người dùng", "Xử lý tranh chấp", "Thống kê nạp tiền"],
        "main_rx": 125,
    },
    {
        "file": "uc-bang-2-13-xu-ly-qua-han.html",
        "title": "2.2.3.13. Biểu đồ use case Xử lý quá hạn",
        "system": True,
        "actors": ["Hệ thống"],
        "main": "Xử lý quá hạn",
        "includes": ["Quá hạn nộp sản phẩm", "Quá hạn duyệt sản phẩm"],
    },
]

def main():
    links = []
    for d in DIAGRAMS:
        html = render(d)
        path = OUT / d["file"]
        path.write_text(html, encoding="utf-8")
        links.append((d["title"].split(". ", 1)[-1], d["file"]))
        print("Wrote", path.name)

    index = ['<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"/><title>Biểu đồ Use Case – WorkHub</title>',
             '<style>body{font-family:Arial,sans-serif;padding:24px;max-width:720px;margin:0 auto}',
             'h1{font-size:18pt;font-weight:normal}li{margin:8px 0}a{color:#04A0EF}</style></head><body>',
             '<h1>2.2.3. Biểu đồ Use Case (13 nhóm quản lý)</h1><ol>']
    for title, fname in links:
        index.append(f'<li><a href="{fname}" target="_blank">{title}</a></li>')
    index.append("</ol></body></html>")
    (OUT / "index.html").write_text("\n".join(index), encoding="utf-8")
    print("Wrote index.html")

if __name__ == "__main__":
    main()
