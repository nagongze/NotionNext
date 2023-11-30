// 这里编写自定义js脚本；将被静态引入到页面中
<script src="https://js.pusher.com/beams/1.0/push-notifications-cdn.js"></script>
{
  const beamsClient = new PusherPushNotifications.Client({
    instanceId: 'ffacfd04-1318-4bf3-a236-1ab1c84377f0',
  });

  beamsClient.start()
    .then(() => beamsClient.addDeviceInterest('hello'))
    .then(() => console.log('Successfully registered and subscribed!'))
    .catch(console.error);
}
