import asyncio
from datetime import datetime, timezone
from typing import Optional

from ocpp.v16.datatypes import (
    IdTagInfo,
)
from ocpp.v16 import call, call_result
from ocpp.v16.enums import (
    Action,
    RegistrationStatus,
    AuthorizationStatus,
    GenericStatus,
    DataTransferStatus,
    CertificateSignedStatus,
    ChargePointErrorCode,
    DiagnosticsStatus,
)
from ocpp.routing import on
from ocpp.v16 import ChargePoint as cp
from ocpp.v16.enums import Action, RegistrationStatus, ChargePointStatus
from ocpp.v201.enums import (
    AuthorizationStatusEnumType,
)
from ..ftp import Ftp
from ..utils import read_diagnostic_file
from ..engine import Engine
from typing import cast

def get_error_code(sn: call.StatusNotification) -> str:
    return (
        sn.error_code
        if sn.error_code != ChargePointErrorCode.other_error
        else sn.vendor_error_code or "Unknown Error"
    )


def or_now(ts: Optional[str]) -> str:
    return ts or datetime.now(timezone.utc).isoformat()


class ChargePoint16(cp):
    def __init__(self, ftp, engine, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._engine: Engine = engine
        self._ftp: Ftp = ftp
        self._sessions = {}
        self._diagnostics_upload_future = asyncio.get_event_loop().create_future()
        self._background_tasks = set()

    @on(Action.boot_notification)
    def on_boot_notification(
        self, charge_point_vendor: str, charge_point_model: str, **kwargs
    ):
        return call_result.BootNotification(
            current_time=datetime.now(timezone.utc).isoformat(),
            interval=10,
            status=RegistrationStatus.accepted,
        )

    @on(Action.heartbeat)
    def on_heartbeat(self, **kwargs):
        return call_result.Heartbeat(
            current_time=datetime.now(timezone.utc).isoformat()
        )

    @on(Action.authorize)
    def on_authorize(self, **kwargs):
        id_tag_info = IdTagInfo(status=AuthorizationStatusEnumType.accepted)
        return call_result.Authorize(id_tag_info=id_tag_info)

    @on(Action.meter_values)
    def on_meter_values(self, **kwargs):
        return call_result.MeterValues()

    @on(Action.start_transaction)
    def on_start_transaction(self, **kwargs):
        id_tag_info = IdTagInfo(status=AuthorizationStatus.accepted)
        return call_result.StartTransaction(transaction_id=1, id_tag_info=id_tag_info)

    @on(Action.stop_transaction)
    def on_stop_transaction(self, **kwargs):
        return call_result.StopTransaction()

    @on(Action.diagnostics_status_notification)
    def on_diagnostics_status_notification(self, **kwargs):
        sn = call.DiagnosticsStatusNotification(**kwargs)
        if sn.status == DiagnosticsStatus.uploaded:
            self._diagnostics_upload_future.set_result(None)
        elif sn.status == DiagnosticsStatus.upload_failed:
            self._diagnostics_upload_future.set_exception(
                Exception("Diagnostics upload failed")
            )
        return call_result.DiagnosticsStatusNotification()

    @on(Action.sign_certificate)
    def on_sign_certificate(self, **kwargs):
        self.csr = kwargs["csr"]
        return call_result.SignCertificate(GenericStatus.accepted)

    @on(Action.security_event_notification)
    def on_security_event_notification(self, **kwargs):
        return call_result.SecurityEventNotification()

    @on(Action.signed_firmware_status_notification)
    def on_signed_update_firmware_status_notificaion(self, **kwargs):
        return call_result.SignedFirmwareStatusNotification()

    @on(Action.log_status_notification)
    def on_log_status_notification(self, **kwargs):
        return call_result.LogStatusNotification()

    @on(Action.firmware_status_notification)
    def on_firmware_status_notification(self, **kwargs):
        return call_result.FirmwareStatusNotification()

    @on(Action.data_transfer)
    def on_data_transfer(self, **kwargs):
        return call_result.DataTransfer(
            status=DataTransferStatus.unknown_vendor_id, data="Please implement me"
        )

    @on(Action.status_notification)
    def on_status_notification(self, **kwargs):
        task = asyncio.create_task(
            self.handle_status_notification(call.StatusNotification(**kwargs))
        )
        self._background_tasks.add(task)
        task.add_done_callback(self._background_tasks.discard)
        return call_result.StatusNotification()

    async def get_configuration_req(self, **kwargs):
        payload = call.GetConfiguration(**kwargs)
        return await self.call(payload)

    async def change_configuration_req(self, **kwargs):
        payload = call.ChangeConfiguration(**kwargs)
        return await self.call(payload)

    async def clear_cache_req(self, **kwargs):
        payload = call.ClearCache()
        return await self.call(payload)

    async def remote_start_transaction_req(self, **kwargs):
        payload = call.RemoteStartTransaction(**kwargs)
        return await self.call(payload)

    async def remote_stop_transaction_req(self, **kwargs):
        payload = call.RemoteStopTransaction(**kwargs)
        return await self.call(payload)

    async def unlock_connector_req(self, **kwargs):
        payload = call.UnlockConnector(**kwargs)
        return await self.call(payload)

    async def change_availability_req(self, **kwargs):
        payload = call.ChangeAvailability(**kwargs)
        return await self.call(payload)

    async def reset_req(self, **kwargs):
        payload = call.Reset(**kwargs)
        return await self.call(payload)

    async def get_local_list_version_req(self, **kwargs):
        payload = call.GetLocalListVersion()
        return await self.call(payload)

    async def send_local_list_req(self, **kwargs):
        payload = call.SendLocalList(**kwargs)
        return await self.call(payload)

    async def reserve_now_req(self, **kwargs):
        payload = call.ReserveNow(**kwargs)
        return await self.call(payload)

    async def cancel_reservation_req(self, **kwargs):
        payload = call.CancelReservation(**kwargs)
        return await self.call(payload)

    async def trigger_message_req(self, **kwargs):
        payload = call.TriggerMessage(**kwargs)
        return await self.call(payload)

    async def set_charging_profile_req(self, payload: call.SetChargingProfile):
        return await self.call(payload)

    async def get_composite_schedule(
        self, payload: call.GetCompositeSchedule
    ) -> call_result.GetCompositeSchedule:
        return await self.call(payload)

    async def get_composite_schedule_req(
        self, **kwargs
    ) -> call_result.GetCompositeSchedule:
        payload = call.GetCompositeSchedule(**kwargs)
        return await self.call(payload)

    async def clear_charging_profile_req(self, **kwargs):
        payload = call.ClearChargingProfile(**kwargs)
        return await self.call(payload)

    async def data_transfer_req(self, **kwargs):
        payload = call.DataTransfer(**kwargs)
        return await self.call(payload)

    async def extended_trigger_message_req(self, **kwargs):
        payload = call.ExtendedTriggerMessage(**kwargs)
        return await self.call(payload)

    async def certificate_signed_req(self, **kwargs):
        payload = call_result.CertificateSigned(CertificateSignedStatus.rejected)
        return await self.call(payload)

    async def install_certificate_req(self, **kwargs):
        payload = call.InstallCertificate(**kwargs)
        return await self.call(payload)

    async def get_installed_certificate_ids_req(self, **kwargs):
        payload = call.GetInstalledCertificateIds(**kwargs)
        return await self.call(payload)

    async def delete_certificate_req(self, **kwargs):
        payload = call.DeleteCertificate(**kwargs)
        return await self.call(payload)

    async def get_log_req(self, **kwargs):
        payload = call.GetLog(**kwargs)
        return await self.call(payload)

    async def signed_update_firmware_req(self, **kwargs):
        payload = call.SignedUpdateFirmware(**kwargs)
        return await self.call(payload)

    async def update_firmware_req(self, **kwargs):
        payload = call.UpdateFirmware(**kwargs)
        return await self.call(payload)

    async def get_diagnostic(self, start_time: str) -> str:
        self._diagnostics_upload_future = asyncio.get_event_loop().create_future()
        result = cast(
            call_result.GetDiagnostics,
            await self.call(
                call.GetDiagnostics(
                    start_time=start_time, location=self._ftp.get_location_url()
                )
            ),
        )
        await self._diagnostics_upload_future
        if result.file_name:
            return self._ftp.get_pathname(result.file_name)
        raise Exception("No diagnostic file name received")

    async def handle_status_notification(self, sn: call.StatusNotification):
        if sn.status == ChargePointStatus.available:
            session = self._sessions.get(sn.connector_id)

            if session and not session.has_entered_charging():
                session.ended_silent(
                    or_now(sn.timestamp),

                    "PREPARING_ABORTED_BEFORE_CHARGING",
                )
                await self._engine.handle_failed_session(
                    cast(Session, session),
                )
            self._sessions.pop(sn.connector_id, None)

        if sn.status == ChargePointStatus.preparing:
            self._sessions[sn.connector_id] = Session(
                self,
                or_now(sn.timestamp),

            )
        if sn.status == ChargePointStatus.charging:
            session = self._sessions.get(sn.connector_id)
            if session:
                session.mark_entered_charging()

        if sn.status == ChargePointStatus.faulted:
            session = self._sessions.get(sn.connector_id)
            if not session:
                session = Session(self, or_now(sn.timestamp))
                self._sessions[sn.connector_id] = session
            session.ended(or_now(sn.timestamp), get_error_code(sn))
            await self._engine.handle_failed_session(
                cast(Session, session)
            )
            self._sessions.pop(sn.connector_id, None)


class Session:
    def __init__(self, charger: ChargePoint16, timestamp: str):
        self._charger = charger
        self._end_timestamp = ""
        self._start_timestamp = timestamp
        self._error_code = ""
        self._has_entered_charging = False

    def mark_entered_charging(self):
        self._has_entered_charging = True

    def has_entered_charging(self) -> bool:
        return self._has_entered_charging

    def ended(self, timestamp: str, error_code: str):
        self._end_timestamp = timestamp
        self._error_code = error_code

    def ended_silent(self, timestamp: str, reason: str):
        self._end_timestamp = timestamp
        self._error_code = reason

    async def get_diagnostic(self) -> str:
        pathname = await self._charger.get_diagnostic(self._start_timestamp)
        return read_diagnostic_file(pathname)

    def charger_id(self) -> str:
        return self._charger.id

    def timestamp(self) -> str:
        return self._end_timestamp

    def error_code(self) -> str:
        return self._error_code
