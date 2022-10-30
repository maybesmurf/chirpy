import { getPublicEnvVar } from '@chirpy-dev/utils';

import { logger } from '../../utilities/logger';

const NOTIFICATION_DID_REGISTER_KEY =
  'chirpy.notification-subscription.did-register';

export function registerNotificationSubscription(): Promise<Response | void> {
  if (!checkServiceWorkerCompatibility()) {
    return Promise.reject();
  }
  // It's safe to register the service worker multiply times
  return navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      if (!registration.pushManager) {
        // Not supported
        return;
      }
      return registration.pushManager
        .getSubscription()
        .then((subscription) => {
          if (subscription) {
            return subscription;
          }
          const vapidKey = urlBase64ToUint8Array(
            getPublicEnvVar('NEXT_PUBLIC_VAPID', process.env.NEXT_PUBLIC_VAPID),
          );
          return registration.pushManager.subscribe({
            // This means all push events will result in a notification
            userVisibleOnly: true,
            applicationServerKey: vapidKey,
          });
        })
        .then((subscription) => {
          if (sessionStorage.getItem(NOTIFICATION_DID_REGISTER_KEY)) {
            return;
          }
          // Save the subscription details to server
          return fetch('/api/notification/register-device', {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify({ subscription }),
          })
            .then((rsp) => {
              sessionStorage.setItem(NOTIFICATION_DID_REGISTER_KEY, 'true');
              return rsp;
            })
            .catch((error) => {
              logger.warn('Register notification subscription', error);
            });
        });
    })
    .catch((error) => {
      logger.error('Service worker registration failed', error);
      throw error;
    });
}

const SERVICE_WORKER_ERROR = 'Service worker not supported';
export function checkServiceWorkerCompatibility(): boolean {
  const supported = 'serviceWorker' in navigator;
  if (!supported) {
    logger.error(SERVICE_WORKER_ERROR);
  }
  return supported;
}

const NOTIFICATION_ERROR = 'This browser does not support notifications.';

export function checkNotificationCompatibility(): boolean {
  const supported = 'Notification' in window;
  if (!supported) {
    logger.error(NOTIFICATION_ERROR);
  }
  return supported;
}

export function askNotificationPermission(): Promise<NotificationPermission> {
  return new Promise((resolve, reject) => {
    if (!checkNotificationCompatibility()) {
      reject(new Error(NOTIFICATION_ERROR));
      return;
    }
    if (checkNotificationPromise()) {
      Notification.requestPermission().then(resolve, reject);
    } else {
      Notification.requestPermission((permission) => {
        resolve(permission);
      });
    }
  });
}

function checkNotificationPromise() {
  try {
    Notification.requestPermission().then();
  } catch {
    return false;
  }

  return true;
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    const codePoint = rawData.codePointAt(i);
    if (codePoint) {
      outputArray[i] = codePoint;
    }
  }
  return outputArray;
}