export default interface EscalationTimoutInterface {
    setAlertTimout: (duration: number, id: string) => Promise<void>;
    resetAlertTimout: (id: string) => Promise<void>;
}