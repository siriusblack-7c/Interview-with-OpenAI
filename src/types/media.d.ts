// Type declarations for media APIs to ensure TypeScript compatibility

declare global {
    interface Navigator {
        mediaDevices?: MediaDevices;
        permissions?: Permissions;
    }

    interface MediaDevices {
        getUserMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
    }

    interface Permissions {
        query(permissionDesc: PermissionDescriptor): Promise<PermissionStatus>;
    }

    interface PermissionDescriptor {
        name: PermissionName;
    }

    type PermissionName = 'microphone' | 'camera' | 'geolocation' | 'notifications';

    interface PermissionStatus extends EventTarget {
        state: 'granted' | 'denied' | 'prompt';
    }

    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export { };