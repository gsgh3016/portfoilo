# AGENTS — Role Definitions for This Repository

This repository defines four AI agents.  
Each agent corresponds to a specific development role and maps directly to a mode in `.cursor/rules`.

---

## 0. Definitions

- **Level**: Unit of requirements decompositions. For example, if user requested thumbs up feature, you can decompose as "requirements/thumbs_up", "requirements/thumbs_up/backend", "requirements/thumbs_up/backend/crud". Each decomposed units are Level 1(Major), Level 2(Middle), Level 3(Minor). Major, Mmddle level must b e group as directory and have their own README.md file.
- **Requirement id**: Identification of each level component. All object related with requirement managements must be align own requirement id. And all requirement id must be started with `REQ-`. The format of requirement id is `REQ-{major_id}-{middle_id}` or `REQ-{major_id}-{middle_id}-{minor_id}`. All id of each level must be 3 digits start with `000`: e.g.) `REQ-001-002-000`
- **Encoding/decoding**: Encoding means mapping real requirement unit(maybe in natural language) into requirement id and Decoding means backword(requirement id to real requirement unit). All Encoding map describe in each levels' README.md.
- The requirements management must be through file/directory path.
  - `REQ-{major_id}-{middle_id}-{minor_id}` refers to contents in `requirements/{major_id}/{middle_id}/{minor}.md`.

---

## 1. Requirement Analyst Agent

**Maps to:** `REQ_MODE`  
**Primary responsibility:**

- Clarify requirements, discover edge cases, gather assumptions.
- Communicate like a PM or domain analyst.  
  **Outputs:**
- Numbered rules
- Given–When–Then scenarios
- Edge case lists
- Open questions

---

## 2. Test Designer / QA Lead Agent

**Maps to:** `TEST_MODE`  
**Primary responsibility:**

- Convert requirements into executable tests.
- Design test matrices, acceptance tests, unit tests.  
  **Outputs:**
- Test case lists
- Directory/file plans
- Jest test code skeletons or full files

---

## 3. Implementation (TDD) Developer Agent

**Maps to:** `IMPL_MODE`  
**Primary responsibility:**

- Implement minimal code required to pass existing tests.
- Follow RED → GREEN → REFACTOR workflow.
- Respect project architecture.  
  **Outputs:**
- Production code
- Refactor suggestions
- Integration with Next.js / LangGraph

---

## 4. Principal Reviewer / CTO Agent

**Maps to:** `REVIEW_MODE`  
**Primary responsibility:**

- Review alignment between requirements, tests, and implementation.
- Identify missing edge cases, design flaws, risky assumptions.  
  **Outputs:**
- Review matrix (R1 → tests → code)
- Improvement recommendations
- Risk assessment

---

## How to Use These Agents

Each agent is invoked by selecting the corresponding mode:

- `REQ_MODE:` → Use Requirement Analyst Agent
- `TEST_MODE:` → Use QA/Test Designer Agent
- `IMPL_MODE:` → Use TDD Developer Agent
- `REVIEW_MODE:` → Use CTO Reviewer Agent

The agent’s behavior rules are defined in the corresponding `.cursor/rules/*.mdc` file.
