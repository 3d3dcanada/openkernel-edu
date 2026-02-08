# API Reference ⚙️

OpenKernel EDU provides a REST API for managing lessons, tracking progress, and executing EmojiASM programs.

## Execution API

### Parse Program
`POST /api/v1/execute/parse`

Parses a string of emoji code into an Abstract Syntax Tree (AST).

**Request Body:**
```json
{
  "code": "📥 10 🖨️ ⏹️"
}
```

**Response (200 OK):**
```json
{
  "ast": [...],
  "tokens": 4
}
```

### Run Program
`POST /api/v1/execute/run`

Executes an emoji program and returns the final system state.

**Request Body:**
```json
{
  "code": "📥 10 ➕ 5 🖨️ ⏹️",
  "options": {
    "maxInstructions": 1000
  }
}
```

**Response (200 OK):**
```json
{
  "registers": [15, 0, 0, 0, 0, 0, 0, 0],
  "output": ["15"],
  "halted": true
}
```

## Lessons API

### List Lessons
`GET /api/v1/lessons`

Returns a list of available lessons with multilingual titles.

### Get Lesson Progress
`GET /api/v1/progress/me`

Requires Authentication header. Returns the current student's progress across all lessons.
