# Project Context — my-letter

> Tài liệu này mô tả toàn bộ codebase để AI/prompt có thể hiểu context mà không cần đọc lại từng file.

---

## Mục đích dự án

Website tặng thư cá nhân. Người nhận phải giải một câu đố (nhập đúng ngày tháng) mới mở khoá được trang đọc thư. Sau khi đọc, họ có thể viết hồi đáp bằng rich-text editor.

---

## Tech stack

| Thành phần | Thư viện |
|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Language | TypeScript |
| Build tool | Vite |
| Routing | Vue Router 4 |
| Rich text editor | Tiptap v3 (`@tiptap/vue-3`, StarterKit, TextAlign) |
| Hiệu ứng pháo hoa | `fireworks-js` |
| Hiệu ứng confetti | `canvas-confetti` (file dự phòng, chưa dùng chính) |

---

## Cấu trúc thư mục

```
src/
├── App.vue                    # Root — chỉ chứa <RouterView>
├── main.ts                    # Khởi tạo Vue app + router
├── style.css                  # Global styles (reset, font base)
│
├── router/
│   └── index.ts               # Định nghĩa routes + guard bảo vệ /2507 /2508
│
├── translate/
│   ├── vie.json               # Tất cả chuỗi hiển thị tiếng Việt (nguồn duy nhất)
│   ├── 2508.letter.txt        # Nội dung bức thư tháng 8 (tagged format)
│   └── config/                # (trống, dành cho config dịch sau này)
│
├── assets/
│   └── css/
│       ├── letterlayout.css   # Style cho trang đọc thư (LetterLayout)
│       ├── replyview.css      # Style cho trang viết hồi đáp (ReplyView)
│       └── dot.css            # Style cho DotLoading
│
└── components/
    ├── OpeningPage.vue        # Trang chủ — puzzle nhập ngày tháng
    │
    ├── loginbox/
    │   └── LoginBox.vue       # Ô nhập password với typing-effect hint, kéo được
    │
    ├── genenric/              # (typo folder name — generic)
    │   ├── LetterLayout.vue   # Layout chung cho trang đọc thư
    │   ├── DotLoading.vue     # Overlay xác nhận "Cậu chắc chứ?" dạng typing
    │   ├── typingEffect.js    # Engine gõ từng chữ theo delay
    │   ├── typingSound.js     # Âm thanh tiếng gõ phím (Web Audio API)
    │   └── emailconfig.js     # Config + HTML template cho email hồi đáp (Resend)
    │
    ├── views/
    │   ├── Letter2507View.vue # Trang thư tháng 7
    │   ├── Letter2508View.vue # Trang thư tháng 8
    │   └── ReplyView.vue      # Trang viết hồi đáp (Tiptap editor)
    │
    ├── constants/
    │   ├── EnterIcon.ts       # Interface { enterIcon?: string }
    │   ├── Hint.ts            # Interface { hint?: string }
    │   └── LoginBoxHintMap.ts # Map số lần sai → key hint trong vie.json
    │
    ├── utils/
    │   ├── i18n.ts            # Hàm t(namespace, key) đọc từ vie.json
    │   ├── letterParser.ts    # parseTaggedLetter() — đọc file .txt có [date]/[title]/[content]
    │   ├── usePageBodyHeight.ts  # Composable: chiều cao trang theo viewport
    │   ├── useAutoPagination.ts  # Composable: chia content thành pages vừa màn hình
    │   ├── usePageFlipAudio.ts   # Composable: âm thanh lật trang (Web Audio API)
    │   ├── useReplyEditor.ts     # Composable: khởi tạo Tiptap editor cho ReplyView
    │   ├── vDraggable.ts      # Vue directive v-draggable (kéo element tự do)
    │   ├── fireworks.js       # triggerFireworks(seconds) — hiệu ứng pháo hoa
    │   ├── confetti.ts        # triggerFireworks dùng canvas-confetti (dự phòng)
    │   ├── clearPuzzle.js     # clearPuzzleAccess() — xoá sessionStorage
    │   ├── clearPuzzle.d.ts   # Type declaration cho clearPuzzle.js
    │   ├── fireworks.d.ts     # Type declaration cho fireworks.js
    │
    └── api/
        └── sendreply.js       # (trống — placeholder cho API gửi hồi đáp)
```

---

## Luồng hoạt động chính

```
/ → /home (OpeningPage)
        │
        ├─ nhập đúng "2507" → sessionStorage('puzzleAccess', '2507') → /2507
        ├─ nhập đúng "2508" → xác nhận DotLoading → sessionStorage('puzzleAccess', '2508') → /2508
        └─ nhập sai → hint thay đổi theo LoginBoxHintMap, sau 7 lần sai bắn pháo hoa
                                │
                    /2507 hoặc /2508 (LetterLayout)
                        │  router.beforeEach kiểm tra sessionStorage
                        │  sai/thiếu → redirect /home
                        │
                        └─ click "Hồi đáp" → window.open('/reply', '_blank')
                                │
                            /reply (ReplyView — Tiptap editor)
```

---

## Hệ thống i18n

Tất cả chuỗi hiển thị đều nằm trong `src/translate/vie.json`.  
Dùng hàm `t('vie', 'key')` từ `utils/i18n.ts` — TypeScript tự suy kiểu key từ JSON nên sai key là lỗi compile.

**Các nhóm key trong vie.json:**

| Nhóm | Keys |
|---|---|
| Hint puzzle | `hint_first_meet`, `hint_wrong_attempts`, `hint_final`, `hint_one_more`, `hint_winter` |
| UI chung | `are_you_sure`, `enter_icon`, `yes`, `no`, `start`, `dot` |
| Nút layout | `home_button`, `reply_button` |
| Trang reply | `reply_title`, `reply_description`, `reply_placeholder`, `send_reply` |
| Toolbar editor | `editor_bold`, `editor_italic`, `editor_strike`, `editor_heading`, `editor_bullet_list`, `editor_ordered_list`, `editor_align_left/center/right`, `editor_undo`, `editor_redo` |

---

## Định dạng file thư (.txt)

```
[date]
25 tháng 7, 2025

[title]
Tiêu đề bức thư

[content]
Đoạn 1...

Đoạn 2...
```

`parseTaggedLetter()` trong `utils/letterParser.ts` nhận chuỗi raw (import với `?raw`) và trả về `{ date, title, content }`.  
Các đoạn văn cách nhau bằng dòng trắng (`\n\n`). `LetterLayout` tự chia thành nhiều trang nếu nội dung quá dài.

---

## LetterLayout — phân trang tự động

```
props.content (string)
    │
    ├─ useAutoPagination  ──  dùng hidden <div> đo chiều cao thực tế
    │       │                 ghép từng đoạn vào cho đến khi vượt maxHeight
    │       └─ autoPages[]   (mảng string, mỗi phần tử = 1 trang)
    │
    ├─ usePageBodyHeight  ──  50% viewport height, clamp [320, 520]px
    │
    └─ usePageFlipAudio  ──  triangle oscillator, 0.16s, fade in/out
```

Nếu truyền `pages[]` thủ công thì bỏ qua autoPages (prop ưu tiên hơn).

---

## Guard bảo vệ route

`router/index.ts` — `beforeEach`:
- Route có `meta.requiresPuzzle: true` → kiểm tra `sessionStorage.getItem('puzzleAccess')`
- Giá trị phải khớp với path (ví dụ `/2507` cần `puzzleAccess === '2507'`)
- Sai/thiếu → redirect về `/home`
- Route `/reply` có `meta.requiresReplyAccess: true` nhưng **chưa có guard** (hiện ai biết URL đều vào được)

---

## CSS — quy ước font

Cả hai trang (đọc thư và viết reply) dùng chung font stack:

```css
font-family: 'Palatino Linotype', Palatino, 'Times New Roman', serif;
text-rendering: optimizeLegibility;
-webkit-font-smoothing: antialiased;
word-spacing: 0;          /* fix khoảng cách tiếng Việt */
word-break: normal;
overflow-wrap: break-word;
```

`letterlayout.css` là chuẩn gốc — `replyview.css` phải theo.

---

## Những thứ chưa hoàn thiện (TODO)

| Mục | Trạng thái |
|---|---|
| `src/components/api/sendreply.js` | Trống — chưa implement gửi email |
| `emailconfig.js` | Config Resend có sẵn nhưng chưa được gọi |
| Guard cho route `/reply` | Chưa có, cần implement `requiresReplyAccess` |
| `src/translate/config/` | Thư mục trống |
| `Letter2507View` | Hiện vẫn đọc `2508.letter.txt` (chưa có file 2507 riêng) |
