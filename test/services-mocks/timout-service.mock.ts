import EscalationTimoutInterface from "../../interfaces/external/timeout.interface";

export default class TimoutServiceMock implements EscalationTimoutInterface {
    setAlertTimout(duration: number, id: string):Promise<void> {
        return Promise.resolve()
    };
    resetAlertTimout(id: string):Promise<void> {
        return Promise.resolve()
    };

}