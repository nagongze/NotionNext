// 这里编写自定义js脚本；将被静态引入到页面中
import * as PusherPushNotifications from "@pusher/push-notifications-web"
{
  const beamsClient = new PusherPushNotifications.Client({
    instanceId: 'ffacfd04-1318-4bf3-a236-1ab1c84377f0',
  });

  beamsClient.start()
    .then(() => beamsClient.addDeviceInterest('hello'))
    .then(() => console.log('Successfully registered and subscribed!'))
    .catch(console.error);
}
