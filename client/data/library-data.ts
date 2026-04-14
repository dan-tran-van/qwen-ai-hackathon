import type { Confidentiality } from "./mock-data";

export type LibraryDocStatus = "Hiệu lực" | "Hết hiệu lực" | "Dự thảo";

export interface LibraryDocument {
  id: string;
  code: string;
  title: string;
  issuingAgency: string;
  type: string;
  issueDate: string;
  effectiveDate: string;
  confidentiality: Confidentiality;
  status: LibraryDocStatus;
  summary: string;
  tags: string[];
  relatedDocs: string[];
  content: string;
}

export const libraryDocTypes = [
  "Nghị định",
  "Thông tư",
  "Quyết định",
  "Chỉ thị",
  "Hướng dẫn",
  "Quy trình",
  "Biểu mẫu",
  "Thông báo",
];

export const issuingAgencies = [
  "Chính phủ",
  "Bộ Nội vụ",
  "Bộ Tài chính",
  "UBND Thành phố",
  "Sở Kế hoạch và Đầu tư",
  "Sở Tài nguyên và Môi trường",
  "Sở Nội vụ",
  "Văn phòng Chính phủ",
];

export const libraryDocuments: LibraryDocument[] = [
  {
    id: "lib-1",
    code: "NĐ-01/2021/NĐ-CP",
    title: "Nghị định về đăng ký doanh nghiệp",
    issuingAgency: "Chính phủ",
    type: "Nghị định",
    issueDate: "2021-01-04",
    effectiveDate: "2021-04-04",
    confidentiality: "Thường",
    status: "Hiệu lực",
    summary:
      "Quy định chi tiết về đăng ký doanh nghiệp, bao gồm hồ sơ, trình tự, thủ tục đăng ký thành lập, thay đổi nội dung đăng ký và giải thể doanh nghiệp.",
    tags: ["Doanh nghiệp", "Đăng ký", "Thủ tục hành chính"],
    relatedDocs: ["TT-02/2021/TT-BKHĐT", "NĐ-78/2015/NĐ-CP"],
    content:
      "Chương I: QUY ĐỊNH CHUNG\n\nĐiều 1. Phạm vi điều chỉnh\nNghị định này quy định chi tiết về đăng ký doanh nghiệp; đăng ký hộ kinh doanh...\n\nĐiều 2. Đối tượng áp dụng\n1. Tổ chức, cá nhân trong nước; tổ chức, cá nhân nước ngoài thực hiện đăng ký doanh nghiệp...\n\nChương II: ĐĂNG KÝ DOANH NGHIỆP\n\nĐiều 3. Hồ sơ đăng ký doanh nghiệp\nHồ sơ đăng ký doanh nghiệp bao gồm:\na) Giấy đề nghị đăng ký doanh nghiệp;\nb) Điều lệ công ty;\nc) Danh sách thành viên hoặc cổ đông sáng lập...",
  },
  {
    id: "lib-2",
    code: "TT-02/2021/TT-BKHĐT",
    title: "Thông tư hướng dẫn về đăng ký doanh nghiệp",
    issuingAgency: "Bộ Kế hoạch và Đầu tư",
    type: "Thông tư",
    issueDate: "2021-03-15",
    effectiveDate: "2021-05-01",
    confidentiality: "Thường",
    status: "Hiệu lực",
    summary:
      "Hướng dẫn chi tiết thi hành một số điều của Nghị định 01/2021/NĐ-CP về đăng ký doanh nghiệp, bao gồm biểu mẫu và quy trình cụ thể.",
    tags: ["Doanh nghiệp", "Hướng dẫn", "Biểu mẫu"],
    relatedDocs: ["NĐ-01/2021/NĐ-CP"],
    content:
      "Chương I: QUY ĐỊNH CHUNG\n\nĐiều 1. Phạm vi điều chỉnh\nThông tư này hướng dẫn chi tiết một số điều của Nghị định số 01/2021/NĐ-CP...",
  },
  {
    id: "lib-3",
    code: "QĐ-1291/QĐ-UBND",
    title: "Quyết định ban hành quy chế phối hợp xử lý văn bản",
    issuingAgency: "UBND Thành phố",
    type: "Quyết định",
    issueDate: "2025-08-20",
    effectiveDate: "2025-09-01",
    confidentiality: "Thường",
    status: "Hiệu lực",
    summary:
      "Ban hành quy chế phối hợp giữa các sở, ban, ngành trong việc tiếp nhận, xử lý và phản hồi văn bản hành chính trên hệ thống điện tử.",
    tags: ["Quy chế", "Phối hợp", "Văn bản điện tử"],
    relatedDocs: ["CT-15/CT-UBND"],
    content:
      "Điều 1. Ban hành kèm theo Quyết định này Quy chế phối hợp xử lý văn bản hành chính giữa các sở, ban, ngành...\n\nĐiều 2. Quyết định này có hiệu lực kể từ ngày 01/09/2025...",
  },
  {
    id: "lib-4",
    code: "CT-15/CT-UBND",
    title: "Chỉ thị về đẩy mạnh chuyển đổi số trong cơ quan nhà nước",
    issuingAgency: "UBND Thành phố",
    type: "Chỉ thị",
    issueDate: "2025-06-10",
    effectiveDate: "2025-06-10",
    confidentiality: "Thường",
    status: "Hiệu lực",
    summary:
      "Yêu cầu các cơ quan, đơn vị đẩy mạnh ứng dụng công nghệ thông tin, chuyển đổi số trong giải quyết thủ tục hành chính và quản lý văn bản.",
    tags: ["Chuyển đổi số", "CNTT", "Thủ tục hành chính"],
    relatedDocs: ["QĐ-1291/QĐ-UBND"],
    content:
      "1. Tất cả các sở, ban, ngành hoàn thành triển khai hệ thống quản lý văn bản điện tử trước 31/12/2025...\n\n2. Áp dụng chữ ký số trong giao dịch văn bản nội bộ...",
  },
  {
    id: "lib-5",
    code: "HD-03/2026/HD-SNV",
    title: "Hướng dẫn quy trình xử lý hồ sơ hành chính một cửa",
    issuingAgency: "Sở Nội vụ",
    type: "Hướng dẫn",
    issueDate: "2026-01-15",
    effectiveDate: "2026-02-01",
    confidentiality: "Thường",
    status: "Hiệu lực",
    summary:
      "Hướng dẫn chi tiết quy trình tiếp nhận, xử lý và trả kết quả hồ sơ hành chính theo cơ chế một cửa, một cửa liên thông.",
    tags: ["Một cửa", "Thủ tục hành chính", "Quy trình"],
    relatedDocs: ["NĐ-61/2018/NĐ-CP"],
    content:
      "I. QUY TRÌNH TIẾP NHẬN HỒ SƠ\n\n1. Bước 1: Tiếp nhận hồ sơ tại Bộ phận Một cửa\n2. Bước 2: Kiểm tra tính hợp lệ của hồ sơ...",
  },
  {
    id: "lib-6",
    code: "BM-QLHC-01",
    title: "Biểu mẫu phiếu trình xử lý hồ sơ",
    issuingAgency: "Văn phòng Chính phủ",
    type: "Biểu mẫu",
    issueDate: "2025-03-01",
    effectiveDate: "2025-03-01",
    confidentiality: "Thường",
    status: "Hiệu lực",
    summary:
      "Mẫu phiếu trình dùng cho việc trình lãnh đạo xem xét, phê duyệt các hồ sơ, văn bản trong cơ quan hành chính.",
    tags: ["Biểu mẫu", "Phiếu trình", "Hành chính"],
    relatedDocs: [],
    content:
      "PHIẾU TRÌNH XỬ LÝ HỒ SƠ\n\nKính gửi: ...........................\n\n1. Nội dung trình: .......................\n2. Căn cứ pháp lý: .......................\n3. Đề xuất xử lý: .......................",
  },
  {
    id: "lib-7",
    code: "QT-TNMT-02/2026",
    title: "Quy trình thẩm định báo cáo đánh giá tác động môi trường",
    issuingAgency: "Sở Tài nguyên và Môi trường",
    type: "Quy trình",
    issueDate: "2026-02-20",
    effectiveDate: "2026-03-01",
    confidentiality: "Mật",
    status: "Hiệu lực",
    summary:
      "Quy trình nội bộ thẩm định báo cáo đánh giá tác động môi trường (ĐTM) cho các dự án đầu tư trên địa bàn thành phố.",
    tags: ["Môi trường", "ĐTM", "Thẩm định"],
    relatedDocs: [],
    content:
      "BƯỚC 1: Tiếp nhận hồ sơ ĐTM\n- Kiểm tra thành phần hồ sơ theo quy định...\n\nBƯỚC 2: Thẩm định nội dung\n- Thành lập hội đồng thẩm định...",
  },
  {
    id: "lib-8",
    code: "NĐ-61/2018/NĐ-CP",
    title: "Nghị định về thực hiện cơ chế một cửa, một cửa liên thông",
    issuingAgency: "Chính phủ",
    type: "Nghị định",
    issueDate: "2018-04-23",
    effectiveDate: "2018-06-21",
    confidentiality: "Thường",
    status: "Hiệu lực",
    summary:
      "Quy định về việc thực hiện cơ chế một cửa, một cửa liên thông trong giải quyết thủ tục hành chính.",
    tags: ["Một cửa", "Thủ tục hành chính", "Cải cách"],
    relatedDocs: ["HD-03/2026/HD-SNV"],
    content: "Chương I: NHỮNG QUY ĐỊNH CHUNG\n\nĐiều 1. Phạm vi điều chỉnh...",
  },
];

export const libraryStatusColors: Record<LibraryDocStatus, string> = {
  "Hiệu lực": "bg-success/10 text-success",
  "Hết hiệu lực": "bg-muted text-muted-foreground",
  "Dự thảo": "bg-warning/10 text-warning",
};
