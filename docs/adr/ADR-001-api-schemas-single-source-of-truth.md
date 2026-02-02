# ADR-001: API Schemas – Single Source of Truth

## Status
Accepted

## Context
While implementing automated tests for the `/api/v1/sessions` endpoint,
we encountered repeated FastAPI response validation errors related to
`datetime` fields (`start_timestamp`, `stop_timestamp`).

Root cause analysis revealed:
- Multiple response models with overlapping responsibility:
  - `FaultedSessionOut` defined in `api/sessions.py`
  - `FaultedSession` and `FaultedSessionsResponse` defined in `api/schemas.py`
- FastAPI was validating ORM objects against inconsistent schemas.
- Datetime objects were returned directly while response models expected strings.

This caused:
- Failing integration tests
- Hard-to-debug runtime `ResponseValidationError`
- Risk of API contract drift

## Decision
We decided to:
1. Define **all API response schemas in a single module**:
   - `csds/uec_csds/api/schemas.py`
2. Treat this module as the **single source of truth** for API contracts.
3. Remove or avoid defining response models directly in route files.
4. Ensure datetime fields are serialized consistently (ISO 8601 strings).

Routes may reference schemas, but must not redefine them.git sta

## Consequences
### Positive
- Clear API contract
- Predictable FastAPI validation behavior
- Tests validate real API responses, not implementation details
- Easier onboarding for new contributors

### Negative
- Slightly more indirection when navigating code
- Requires discipline to avoid redefining schemas in routes

## Notes
This ADR was introduced while implementing automated tests for
faulted OCPP sessions (UEC CSDS project).

It aligns with long-term maintainability and testability goals.
