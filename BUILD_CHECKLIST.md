# BUILD_CHECKLIST.md
---
INSTRUCTIONS:
- Work through the checklist top to bottom.
- After completing an item, replace `[ ]` with `[x]`.
- Do NOT skip or re-order tasks.
- Stop and log errors if a task fails or can't be completed.
---

## 📚 General Layout
- [x] Build a React-style SPA layout
- [x] Add right-side vertical tab bar
- [x] Each tab opens a full-screen panel on the left
- [x] Use simple, responsive styling (desktop + tablet)
- [x] No authentication required
- [x] Label every field clearly
- [x] Display real API feedback neatly (JSON prettified)

---

## 🏠 Home Tab (Chat + Auto Flow)
- [x] Create "Home" tab
- [x] Add dropdown for existing projects
- [x] Add "Create New Project" button
- [x] On project select or creation:
  - [x] Upload dropped PDFs to `/api/v1/data/upload/{project_id}`
  - [x] Call `/api/v1/data/process/{project_id}` (chunk_size=100, overlap_size=20)
  - [x] Call `/api/v1/nlp/index/push/{project_id}`
- [x] After indexing completes:
  - [x] Show chat input field
  - [x] On submit, call `/api/v1/nlp/index/answer/{project_id}`
  - [x] Display `answer`, `full_prompt`, and `chat_history` in chat format

---

## 📥 Welcome Endpoint Tab
- [x] Show GET `/api/v1/` endpoint info
- [x] Add "Try it" button
- [x] Display `app_name` and `app_version` from response

---

## 📁 Upload Data Tab
- [x] Show POST `/api/v1/data/upload/{project_id}`
- [x] Input for `project_id` (path param)
- [x] File input (for PDF)
- [x] "Upload" button
- [x] Display response: `signal`, `file_id`

---

## ⚙️ Process Data Tab
- [x] Show POST `/api/v1/data/process/{project_id}`
- [x] Inputs: `file_id` (optional), `chunk_size`, `overlap_size`, `do_reset`
- [x] "Process" button
- [x] Display response: `signal`, `inserted_chunks`, `processed_files`

---

## 📦 Index Push Tab
- [x] Show POST `/api/v1/nlp/index/push/{project_id}`
- [x] Inputs: `do_reset` (JSON body)
- [x] Form + "Push" button
- [x] Display: `signal`, `inserted_items_count`

---

## 🔎 Index Info Tab
- [x] Show GET `/api/v1/nlp/index/info/{project_id}`
- [x] Input: `project_id`
- [x] "Fetch Info" button
- [x] Display: `collection_info` object

---

## 📃 Index Search Tab
- [x] Show POST `/api/v1/nlp/index/search/{project_id}`
- [x] Inputs: `text`, `limit`
- [x] "Search" button
- [x] Display results list

---

## 💬 Index Answer Tab
- [x] Show POST `/api/v1/nlp/index/answer/{project_id}`
- [x] Inputs: `text`, `limit`
- [x] "Ask" button
- [x] Display: `answer`, `full_prompt`, `chat_history`

---

## 🧪 Mocking (optional)
- [x] Add "Mock Mode" toggle to simulate API responses (for demo/dev)
