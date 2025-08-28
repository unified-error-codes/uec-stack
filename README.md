# UEC Software Stack

A complete software stack (Backend, Frontend, EVSE) for the seamless integration of Unified Error Codes in the e-mobility ecosystem.

---

For the overall vision please see our main [**manifesto repository**](https://github.com/unified-error-codes/unified-error-codes).

## Software Components Concept

* **/backend/**: The central backend service. It receives, validates, and persists error codes from chargers and exposes a REST API for the frontend. Its primary focus is on robust error handling over OCPP, as defined in the DIN DKE SPEC 99003 standard.
* **/frontend/**: A web-based dashboard (GUI) for Charge Point Operators (CPOs) and technicians. It provides a detailed, user-friendly presentation of error codes.
* **/evse/**: A software designed for seamless integration into any EVSE firmware stack. It minimizes the effort to become UEC compliant by providing **out-of-the-box** error handling for common hardware components.
* **/evse-integrations/everest-module/**: A specific integration module for the [EVerest](https://github.com/EVerest/EVerest) open-source EVSE platform, enabling it to report UEC-compliant error codes.

## Development Roadmap

Our goal is to deliver value incrementally, starting with a robust Minimum Viable Product (MVP) that validates the core concepts of the UEC Initiative.

### MVP Phase (v0.1 - v1.0)

Our initial focus is on building and validating a complete end-to-end system with a clear, high-value use case.

* **v0.1: The Foundation - Basic End-to-End Flow**
    * **Goal:** Establish a complete, demonstrable flow for a single standardized error code.
    * **Key Deliverables:**
        * A simulator that generates a simple, DIN DKE SPEC 99003 compliant error.
        * A backend that receives and persists this error via OCPP 1.6.
        * A frontend that displays a real-time list of all reported errors.

* **v0.2: Adding Context - ISO 15118-2 Scenario**
    * **Goal:** Handle a specific, high-value use case: an authorization timeout.
    * **Key Deliverables:**
        * The simulator models an ISO 15118-2 authorization loop timeout.
        * The backend provides deep-dive analysis, including potential reasons and root causes.
        * The frontend displays enriched, actionable details for this specific error.

* **v0.3: Real-World Validation - EVerest Integration**
    * **Goal:** Prove the UEC concept on a popular, open-source EVSE stack.
    * **Key Deliverables:**
        * An EVerest framework module that natively reports UEC-compliant errors for the authorization timeout scenario.

* **v1.0: Broadening Coverage & Finalizing the MVP**
    * **Goal:** Evolve from specific, hardcoded scenarios to a more robust system covering a prioritized set of DIN SPEC 99003 error codes.
    * **Key Deliverables:**
        * A flexible backend capable of handling multiple, community-prioritized error types.
        * A data-driven frontend that can display details for any supported error code.
        * Establish a process for community feedback to prioritize future use cases.

### Post-MVP (Future Goals)

After establishing a stable v1.0, our focus will shift to features that drive mass adoption and provide unparalleled value to the ecosystem.

* **v2.0: Out-of-the-Box Hardware Integration**
    * **Goal:** Drastically reduce integration effort for manufacturers by providing pre-built support for common EVSE hardware components.
    * **Example:** A plugin for the **Infineon CoolSiC™ Power Module** that automatically translates proprietary hardware fault codes into the UEC standard, saving weeks of custom development.

## Contribute

We welcome contributions from the community! Whether it's reporting a bug, suggesting a feature, or writing code, your help is valuable.
