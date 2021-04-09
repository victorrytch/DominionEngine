class DriverNotify{
    static DRIVER_EVENT: string = "DRIVER_EVENT"

    static ping() {
        MessagingCenter.notify(DriverNotify.DRIVER_EVENT, {});
    }

    static subscribe(callback: (any) => void) {
        MessagingCenter.addListener(DriverNotify.DRIVER_EVENT, callback, false);
    }
}