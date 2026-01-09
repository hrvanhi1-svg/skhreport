import { Task, TaskCategory } from './types';

export const INITIAL_PLAN_TASKS: Task[] = [
  {
    id: 'p1',
    category: TaskCategory.I,
    name: "Lên kế hoạch Content Noel & Tết",
    weight: 30,
    startDate: "2025-12-01",
    deadline: "2025-12-15",
    actualFinish: "",
    collaboration: "Design, Content",
    resultDescription: "",
    subTasks: [],
    selfScore: 0,
    managerScore: 0,
    note: "Tập trung trend TikTok"
  },
  {
    id: 'p2',
    category: TaskCategory.II,
    name: "Booking KOLs chiến dịch cuối năm",
    weight: 40,
    startDate: "2025-12-05",
    deadline: "2025-12-25",
    actualFinish: "",
    collaboration: "Agency",
    resultDescription: "",
    subTasks: [],
    selfScore: 0,
    managerScore: 0,
    note: "Ngân sách 50tr"
  },
  {
    id: 'p3',
    category: TaskCategory.III,
    name: "Thiết kế bộ quà tặng đối tác",
    weight: 30,
    startDate: "2025-12-01",
    deadline: "2025-12-10",
    actualFinish: "",
    collaboration: "Purchasing",
    resultDescription: "",
    subTasks: [],
    selfScore: 0,
    managerScore: 0,
    note: ""
  }
];

export const INITIAL_REPORT_TASKS: Task[] = [
  {
    id: 'r1',
    category: TaskCategory.I,
    name: "Viết content fanpage (25 bài)",
    weight: 20,
    startDate: "2025-11-01",
    deadline: "2025-11-30",
    actualFinish: "2025-11-29",
    collaboration: "Kinh doanh",
    resultDescription: "Hoàn thành tốt chỉ tiêu",
    subTasks: [
      { id: 'st1', name: "Lên content plan tuần 1-4", result: "Đã duyệt 4/4 plan" },
      { id: 'st2', name: "Viết và đăng 25 bài", result: "Đã đăng 25 bài, reach 50k" },
      { id: 'st3', name: "Seeding group", result: "Đã share vào 10 group/bài" }
    ],
    selfScore: 95,
    managerScore: 90,
    note: "Hoàn thành tốt"
  },
  {
    id: 'r2',
    category: TaskCategory.II,
    name: "Quay chụp sự kiện ra mắt sản phẩm",
    weight: 30,
    startDate: "2025-11-05",
    deadline: "2025-11-25",
    actualFinish: "2025-11-25",
    collaboration: "TTS Phan Rang",
    resultDescription: "Đủ KPI media",
    subTasks: [
       { id: 'st4', name: "Chụp ảnh sự kiện", result: "200 ảnh đã chỉnh sửa" },
       { id: 'st5', name: "Quay dựng video highlight", result: "Video 3 phút, đã đăng Youtube" }
    ],
    selfScore: 90,
    managerScore: 85,
    note: ""
  },
  {
    id: 'r3',
    category: TaskCategory.III,
    name: "Tổ chức webinar khách hàng",
    weight: 20,
    startDate: "2025-11-10",
    deadline: "2025-11-15",
    actualFinish: "2025-11-15",
    collaboration: "IT, Sales",
    resultDescription: "Webinar thành công",
    subTasks: [],
    selfScore: 100,
    managerScore: 95,
    note: ""
  },
  {
    id: 'r4',
    category: TaskCategory.IV,
    name: "Thiết kế POSM chi nhánh mới",
    weight: 20,
    startDate: "2025-11-01",
    deadline: "2025-11-20",
    actualFinish: "2025-11-22",
    collaboration: "HCNS",
    resultDescription: "Trễ deadline in ấn",
    subTasks: [
      { id: 'st6', name: "Thiết kế backdrop", result: "Duyệt lần 2" },
      { id: 'st7', name: "Thiết kế standee", result: "Xong" }
    ],
    selfScore: 80,
    managerScore: 75,
    note: "Trễ deadline"
  },
  {
    id: 'r5',
    category: TaskCategory.V,
    name: "Hỗ trợ đào tạo nội bộ",
    weight: 10,
    startDate: "2025-11-20",
    deadline: "2025-11-21",
    actualFinish: "2025-11-21",
    collaboration: "Phòng Đào tạo",
    resultDescription: "",
    subTasks: [],
    selfScore: 90,
    managerScore: 90,
    note: ""
  }
];