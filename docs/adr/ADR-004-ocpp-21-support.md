# ADR-004: Support for OCPP 2.1

**Status:** Accepted (Deferred)  
**Date:** 2026-01-16  
**Decision Makers:** Project Maintainers  
**Scope:** Protocol architecture, post-MVP roadmap

---

## Context

The project currently implements **OCPP 1.6J** as its primary protocol, targeting a stable MVP release.
This version already enables real-world usage, demonstrations, pilot deployments, and integration with existing EVSE hardware.

**OCPP 2.1** introduces a significantly different architecture compared to OCPP 1.6, including:
- unified protocol model,
- Device / Component / Variable abstraction,
- event-driven transaction lifecycle,
- native support for ISO 15118 (Plug & Charge),
- bidirectional charging (V2G / V2H / V2X),
- stronger security and certificate management.

Due to these differences, OCPP 2.1 **cannot be treated as an incremental upgrade** of the existing OCPP 1.6 implementation.

---

## Decision

We decided to **intentionally defer implementation of OCPP 2.1** until after the OCPP 1.6 MVP is finalized and released.

OCPP 2.1 will be introduced in the future as:
- a **parallel protocol stack**,
- behind a **protocol/version router**,
- without impacting the stability or internal logic of the OCPP 1.6 core.

This decision protects MVP scope while keeping the project future-proof.

---

## Rationale

- OCPP 1.6 MVP is close to completion and already delivers tangible value.
- Introducing OCPP 2.1 at this stage would significantly increase complexity and risk.
- OCPP 2.1 requires a separate domain model and lifecycle handling.
- A parallel-stack approach aligns with long-term maintainability and open-source collaboration.

---

## Consequences

### Positive
- Clear architectural direction for contributors.
- Stable and predictable MVP delivery.
- Clean separation between protocol generations.
- Reduced risk of regressions in the existing core.

### Negative
- OCPP 2.1 features are not available in the MVP.
- Contributors interested solely in OCPP 2.1 must wait until the post-MVP phase.

---

## Contribution Policy (Open Source)

This project remains open to community input regarding OCPP 2.1.

At this stage:
- OK Design discussions, ADR proposals, and architectural feedback are welcome.
- OK Comparative analyses (OCPP 1.6 vs OCPP 2.1) are encouraged.
- NOK Direct implementation PRs for OCPP 2.1 core functionality may be deferred or closed until the MVP milestone is reached.

---

## Future Direction

After the MVP release:
- a dedicated `ocpp21` module will be introduced,
- a protocol router will determine protocol handling per charge point,
- shared components (state, persistence, diagnostics) will be reused where applicable.

This ADR will be revisited once the MVP milestone is completed.

---

## References

- OCPP 1.6 Specification
- OCPP 2.0.1 / 2.1 Specifications
- Project Roadmap and MVP Milestones
