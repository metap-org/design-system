# Component status tracker

Bảng theo dõi độ hoàn thiện từng component trong `@ui/ui-lib` — cập nhật mỗi khi thêm/sửa
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

## Chưa build (theo đúng thứ tự ưu tiên còn lại trong readme.md)

| Component | Nhóm ưu tiên | Ghi chú |
|---|---|---|
| Table | 5 | — |
| NumberInput | 6 | Component duy nhất còn thiếu trong nhóm 6 |
| Alert, Progress, Spinner | 7 | — |
| Tabs, Accordion, DropdownMenu, Popover, Tooltip, Breadcrumb, Pagination | 8 | Phần lớn cần Radix cho focus-trap/positioning (Popover/DropdownMenu/Tooltip đặc biệt khó làm đúng a11y nếu tự viết tay) |

## Nợ hạ tầng đã phát hiện (không phải component cụ thể)

| Ngày phát hiện | Nội dung | Trạng thái |
|---|---|---|
| 2026-08-28 | `cn()` (`src/lib/utils.ts`) dùng `twMerge` mặc định, không nhận diện scale spacing tuỳ biến (`xs/sm/md/lg/xl` trong `tokens.spacing`) — class dùng token này không merge/đè đúng nhau (vd `p-0` không thắng được `px-md py-sm`), phát hiện khi build IconButton | **Đã sửa** — `extendTailwindMerge` khai báo đúng scale |
| 2026-08-26 (kiểm tra 2026-08-28) | Stack đã chọn Tailwind + shadcn/ui (Radix UI primitives) nhưng chưa cài `@radix-ui/react-*` nào, mọi component hiện có đều tự viết tay | **Đã quyết định 2026-08-28** — dùng Radix thật cho nhóm 4/8's overlay component, cài dần theo từng component |
| 2026-08-28 | `zod` v4 + `@hookform/resolvers` v5's generic signature đổi so với ví dụ trong `readme.md` (`ZodSchema<T>` không còn khớp `Resolver<T, any, T>` mà `useForm<T>` cần) — `tsc build:types` fail nếu giữ nguyên type từ spec | **Đã sửa** — `Form`'s `schema` prop khai kiểu `ZodType<T, T>` thay vì `ZodSchema<T>` |
