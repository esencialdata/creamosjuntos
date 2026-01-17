import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 'creamos_juntos_device_id';

export const getDeviceID = () => {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);

    if (!deviceId) {
        deviceId = uuidv4();
        localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
};
