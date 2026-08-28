# Component status tracker

Bảng theo dõi độ hoàn thiện từng component trong `@metap/ui` — cập nhật mỗi khi thêm/sửa
component, không phải tài liệu tĩnh viết một lần. Nguồn chân lý cho "component nào đã có, cái
nào cần review, cái nào còn thiếu" — đọc file này trước khi hỏi lại hoặc build trùng.

**Quy ước:**
- **Ngày tạo/Ngày cập nhật**: theo lần commit thật gần nhất đụng tới file component đó (không
  phải ngày trong đầu, xem qua `git log --follow -- src/components/<tên>/`). 12 component ban đầu
  đều chung một ngày vì cùng nằm trong 1 commit khởi tạo (`dacc4de`, 2026-08-26) — không có lịch
  sử chi tiết hơn cho từng cái.
- **Đã review chưa**: review bởi người (không phải tự Claude verify bằng lint/test/build — 3 việc
  đó là điều kiện cần, không phải review). Mặc định "Chưa" cho tới khi ai đó trong team xác nhận.
- **Nhóm ưu tiên**: đúng "Thứ tự build" trong `readme.md` (8 nhóm, xếp theo tần suất dùng chung
  giữa grocery-app/F&B app/DocFlow).
- **Dùng Radix?**: `readme.md`'s Stack ghi "Tailwind CSS + shadcn/ui (Radix UI primitives)", nhưng
  tới 2026-08-28 (trước Group 3) **chưa component nào dùng `@radix-ui/react-*`** — mọi component
  tự viết tay bằng HTML/ARIA thuần. **Quyết định chốt 2026-08-28**: dùng Radix thật cho các
  component overlay/phức tạp cần focus-trap/portal/positioning (Dialog/Sheet/AlertDialog ở nhóm 4;
  Tabs/Accordion/DropdownMenu/Popover/Tooltip ở nhóm 8) — cài `@radix-ui/react-*` tương ứng từng
  component, không tự viết tay nữa. Breadcrumb/Pagination (nhóm 8) và mọi component đã build trước
  đó vẫn giữ nguyên tự viết tay — không cần Radix cho semantic nav/label thuần.

## Đã build

| Component | Nhóm ưu tiên | Trạng thái | Ngày tạo | Ngày cập nhật | Test | Story | Dùng Radix? | Đã review | Cần cải thiện |
|---|---|---|---|---|---|---|---|---|---|
| Button | 1 | Done | 2026-08-26 | 2026-08-26 | ✓ | ✓ | ✗ (tự viết) | Chưa | — |
| Input | 1 | Done | 2026-08-26 | 2026-08-26 | ✓ | ✓ | ✗ (tự viết) | Chưa | — |
| **Label** | 1 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✗ (tự viết) | Chưa | Mới build, chưa ai review |
| **Textarea** | 1 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✗ (tự viết) | Chưa | Mới build, chưa ai review |
| **IconButton** | 1 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✗ (tự viết) | Chưa | Mới build, chưa ai review |
| Chip | 2 | Done | 2026-08-26 | 2026-08-26 | ✓ | ✓ | ✗ (tự viết) | Chưa | — |
| Avatar | 8 | Done | 2026-08-26 | 2026-08-26 | ✓ | ✓ | ✗ (tự viết) | Chưa | — |
| Checkbox | 6 | Done | 2026-08-26 | 2026-08-26 | ✓ | ✓ | ✗ (tự viết) | Chưa | — |
| RadioGroup | 6 | Done | 2026-08-26 | 2026-08-26 | ✓ | ✓ | ✗ (tự viết) | Chưa | — |
| Select | 6 | Done | 2026-08-26 | 2026-08-26 | ✓ | ✓ | ✗ (tự viết) | Chưa | — |
| Toggle *(≡ Switch trong danh mục chuẩn)* | 6 | Done | 2026-08-26 | 2026-08-26 | ✓ | ✓ | ✗ (tự viết) | Chưa | Tên component lệch danh mục chuẩn (`Switch`) — cân nhắc export thêm alias `Switch` để khớp tên khi app import, hoặc đổi tên hẳn |
| Autocomplete *(≡ Combobox trong danh mục chuẩn)* | 6 | Thiếu test | 2026-08-26 | 2026-08-26 | ✗ | ✓ | ✗ (tự viết) | Chưa | Không có file test; tên lệch danh mục chuẩn (`Combobox`), cùng vấn đề với Toggle/Switch |
| DatePicker | 6 | Thiếu test | 2026-08-26 | 2026-08-26 | ✗ | ✓ | ✗ (tự viết) | Chưa | Không có file test |
| DateRangePicker | 6 (mở rộng) | Thiếu test | 2026-08-26 | 2026-08-26 | ✗ | ✓ | ✗ (tự viết) | Chưa | Không có file test; không nằm trong danh mục chuẩn gốc (mở rộng hợp lý từ DatePicker) |
| Toast | 7 | 2 test fail | 2026-08-26 | 2026-08-26 | ✓ (2 fail) | ✓ | ✗ (tự viết) | Chưa | 2 test timeout với `vi.useFakeTimers()` (`auto-dismisses after duration ms`, `does not auto-dismiss when duration is 0`) — cần sửa cách advance fake timer trong test, không phải bug ở component |
| **Card** *(+ CardHeader/CardTitle/CardDescription/CardContent/CardFooter)* | 2 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✗ (tự viết) | Chưa | Mới build, chưa ai review |
| **Badge** | 2 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✗ (tự viết) | Chưa | Mới build, chưa ai review. Thêm 2 variant `success`/`warning` ngoài danh mục shadcn gốc (default/secondary/destructive/outline) vì thực tế hay cần trạng thái "hoàn thành"/"đang chờ" |
| **Tag** | 2 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✗ (tự viết) | Chưa | Mới build, chưa ai review. Không có trong danh mục chuẩn gốc — thêm để tách rõ 2 nhu cầu khác nhau đang bị gộp chung vào Chip/Badge: label phân loại tự do theo màu (`color` prop: gray/blue/green/yellow/red/purple, không có ý nghĩa trạng thái) so với Badge (semantic status) và Chip (có thể xoá) |
| **Separator** | 2 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✗ (tự viết) | Chưa | Mới build, chưa ai review |
| **Skeleton** | 2 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✗ (tự viết) | Chưa | Mới build, chưa ai review |
| **Form + FormField** | 3 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✗ (tự viết) | Chưa | Mới build, chưa ai review. Theo đúng spec trong `readme.md` (`react-hook-form` + `zod` + `@hookform/resolvers`). `zod` v4/`@hookform/resolvers` v5 đổi generic signature so với bản readme viết sẵn — `FormProps.schema` phải khai là `ZodType<T, T>` (input=output=T) thay vì `ZodSchema<T>` để khớp `Resolver<T, any, T>` mà `useForm<T>` cần, nếu không `tsc` build:types fail. Cũng thêm `src/lib/validators.ts` (`patterns.phoneVN/email/noSpecialChars`) đúng như "Việc cần làm" trong spec |
| **Dialog** *(+ Trigger/Close/Portal/Overlay/Content/Header/Footer/Title/Description)* | 4 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✓ `@radix-ui/react-dialog` | Chưa | Mới build, chưa ai review. Animation dùng transition CSS thuần (`transition-opacity`/`transition-[opacity,transform]` + `data-[state=]`) thay vì `animate-in`/`fade-in-0`/`zoom-in-95` — project chưa cài plugin `tailwindcss-animate`, các class đó sẽ không render gì (không lỗi nhưng cũng không có hiệu ứng); nếu sau này cần animation phức tạp hơn (keyframe) thì cân nhắc thêm plugin |
| **Sheet** *(+ Trigger/Close/Portal/Overlay/Content/Header/Footer/Title/Description)* | 4 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✓ `@radix-ui/react-dialog` | Chưa | Mới build, chưa ai review. Dùng chung primitive với Dialog (đúng như shadcn/ui gốc), khác nhau ở styling — `side` prop (right/left/top/bottom) chọn cạnh trượt vào |
| **AlertDialog** *(+ Trigger/Portal/Overlay/Content/Header/Footer/Title/Description/Action/Cancel)* | 4 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✓ `@radix-ui/react-alert-dialog` | Chưa | Mới build, chưa ai review. Lưu ý: Radix AlertDialog **có** đóng khi nhấn Escape theo mặc định (giống Dialog, không phải hành vi "bắt buộc chọn nút" như một số lib khác) — đã verify bằng test, không phải giả định |
| **Table** *(+ TableHeader/TableBody/TableFooter/TableRow/TableHead/TableCell/TableCaption)* | 5 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✗ (tự viết — semantic HTML `<table>`, không cần Radix) | Chưa | Mới build, chưa ai review. `Table` tự bọc trong `div.overflow-x-auto` để bảng rộng không phá layout trên mobile |
| **NumberInput** | 6 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✗ (tự viết) | Chưa | Mới build, chưa ai review — component cuối cùng còn thiếu trong nhóm 6, nhóm 6 giờ đã đủ. Hỗ trợ cả controlled (`value`+`onChange`) và uncontrolled (`defaultValue`); nút tăng/giảm tự vô hiệu hoá khi chạm `min`/`max`; ẩn spinner mặc định của trình duyệt (`appearance-none`) để dùng UI tự thiết kế |
| **Alert** *(+ AlertTitle/AlertDescription)* | 7 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✗ (tự viết) | Chưa | Mới build, chưa ai review. 2 variant (default/destructive), `role="alert"` |
| **Progress** | 7 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✗ (tự viết) | Chưa | Mới build, chưa ai review. `role="progressbar"` + `aria-valuenow/min/max`, tự clamp `value` vào khoảng `[0, max]` |
| **Spinner** | 7 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✗ (tự viết) | Chưa | Mới build, chưa ai review — nhóm 7 giờ đã đủ. `role="status"` + text ẩn cho screen reader (`label` prop, mặc định "Đang tải...") |
| **Tabs** | 8 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✓ `@radix-ui/react-tabs` | Chưa | Mới build, chưa ai review |
| **Accordion** | 8 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✓ `@radix-ui/react-accordion` | Chưa | Mới build, chưa ai review. Không có animation mở/đóng theo chiều cao (cần keyframe + `tailwindcss-animate`, project chưa cài) — đóng/mở tức thời, không tệ về UX nhưng không mượt như bản shadcn/ui gốc |
| **DropdownMenu** *(+ Trigger/Group/Portal/Sub/RadioGroup/Content/Item/CheckboxItem/RadioItem/Label/Separator)* | 8 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✓ `@radix-ui/react-dropdown-menu` | Chưa | Mới build, chưa ai review |
| **Popover** *(+ Trigger/Anchor/Content)* | 8 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✓ `@radix-ui/react-popover` | Chưa | Mới build, chưa ai review |
| **Tooltip** *(+ TooltipProvider/Trigger/Content)* | 8 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✓ `@radix-ui/react-tooltip` | Chưa | Mới build, chưa ai review. App dùng phải tự bọc `TooltipProvider` ở gốc cây (đúng pattern Radix, không tự động bọc trong `Tooltip` để tránh nhiều provider lồng nhau không cần thiết nếu app có nhiều tooltip). Test "đóng khi rời hover" phải dùng phím Escape thay vì `unhover` thật — Radix Tooltip theo dõi toạ độ con trỏ thật để quyết định có nên đóng không, jsdom không mô phỏng layout/toạ độ thật nên `unhover` không đáng tin cậy trong test |
| **Breadcrumb** *(+ List/Item/Link/Page/Separator)* | 8 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✗ (tự viết — semantic `nav`/`ol`, không cần Radix) | Chưa | Mới build, chưa ai review |
| **Pagination** | 8 | Done | 2026-08-28 | 2026-08-28 | ✓ | ✓ | ✗ (tự viết — không cần focus-trap/positioning) | Chưa | Mới build, chưa ai review. Khác với shadcn/ui gốc (các mảnh ghép rời PaginationContent/PaginationItem/...) — đóng gói thành 1 component "thông minh" nhận `page`/`totalPages`/`onPageChange`, tự tính danh sách trang kèm dấu "…" (thuật toán sibling/ellipsis chuẩn), thực dụng hơn cho việc dùng lại trực tiếp giữa grocery-app/F&B/DocFlow |

**Toàn bộ danh mục 8 nhóm trong readme.md đã build xong (2026-08-28).** Avatar (nhóm 8) đã build từ trước (2026-08-26, cùng đợt 12 component khởi tạo) nên không lặp lại ở đây.

## Chưa build

*(trống — toàn bộ danh mục chuẩn trong readme.md đã build. Việc còn lại là review + xử lý các mục trong "Cần cải thiện" ở bảng trên, ví dụ: thiếu test cho Autocomplete/DatePicker/DateRangePicker, 2 test fail ở Toast, tên lệch danh mục chuẩn của Toggle/Autocomplete.)*

## Nợ hạ tầng đã phát hiện (không phải component cụ thể)

| Ngày phát hiện | Nội dung | Trạng thái |
|---|---|---|
| 2026-08-28 | `cn()` (`src/lib/utils.ts`) dùng `twMerge` mặc định, không nhận diện scale spacing tuỳ biến (`xs/sm/md/lg/xl` trong `tokens.spacing`) — class dùng token này không merge/đè đúng nhau (vd `p-0` không thắng được `px-md py-sm`), phát hiện khi build IconButton | **Đã sửa** — `extendTailwindMerge` khai báo đúng scale |
| 2026-08-26 (kiểm tra 2026-08-28) | Stack đã chọn Tailwind + shadcn/ui (Radix UI primitives) nhưng chưa cài `@radix-ui/react-*` nào, mọi component hiện có đều tự viết tay | **Đã quyết định 2026-08-28** — dùng Radix thật cho nhóm 4/8's overlay component, cài dần theo từng component |
| 2026-08-28 | `zod` v4 + `@hookform/resolvers` v5's generic signature đổi so với ví dụ trong `readme.md` (`ZodSchema<T>` không còn khớp `Resolver<T, any, T>` mà `useForm<T>` cần) — `tsc build:types` fail nếu giữ nguyên type từ spec | **Đã sửa** — `Form`'s `schema` prop khai kiểu `ZodType<T, T>` thay vì `ZodSchema<T>` |
