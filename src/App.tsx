import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import './App.css';

function App() {
  const [tokens, setTokens] = useState<any>({
    endpoint: '',
    keys: { auth: '', p256dh: '' },
  });

  const [payload, setPayload] = useState<any>({ text: '' });

  const vapidKey =
    'BCjQjaIt1dH87Qd9iOr42bk-1Eu_s-RGMI4bsCvYGW4qS2m49ZkOb-p9psaYH3ZXYNCNc6bJkC_xQB2jF6gNZxs';

  const requestPermission = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKey,
    });
    // TODO: DB에 구독 정보 보내기
    console.log('subscription => ', subscription.toJSON());
    const data = subscription.toJSON();
    if (data) {
      setTokens({ endpoint: data.endpoint, keys: data.keys });
    }

    // subscriptionJson = subscription.toJSON();
    // const subscription = await registration.pushManager.getSubscription();
    //   if (subscription) {
    //     // 이미 구독이 되어있다면 해지하기
    //     // TODO: DB에 구독 해지 정보 보내기
    //     subscription.unsubscribe();
    //   } else {
    //     // 구독이 되어있지 않으면 구독하기
    //     const subscription = await registration.pushManager.subscribe({
    //       userVisibleOnly: true,
    //       applicationServerKey:
    //         'BCjQjaIt1dH87Qd9iOr42bk-1Eu_s-RGMI4bsCvYGW4qS2m49ZkOb-p9psaYH3ZXYNCNc6bJkC_xQB2jF6gNZxs',
    //     });
    //     // TODO: DB에 구독 정보 보내기
    //     console.log('subscription => ', subscription.toJSON());
    //   }
    // } catch (e: any) {
    //   console.error(e.message);
    // }
  };

  useEffect(() => {
    getNoty();

    requestPermission();
  }, []);

  const webPush = async (text: any) => {
    const registration = await navigator.serviceWorker.ready;
    console.log(registration);
    registration.showNotification('웹푸쉬', { body: text });
  };

  async function getNoty() {
    await supabase
      .channel('*')
      .on('postgres_changes', { event: '*', schema: '*' }, async (payload) => {
        if (payload.table === 'noty') {
          // const data: any = payload.new;
          if (payload.new) {
            setPayload(payload.new);
            console.log(payload);
            // webPush(data.text);
          }
        }
      })
      .subscribe();
  }

  async function send() {
    console.log(tokens);
    webPush(payload.text);
    // await supabase
    //   .from('noty')
    //   .insert([{ text: '테스트', nickname: 'data', user_uid: 'data' }])
    //   .select();
  }

  return (
    <>
      <p>{payload.text}</p>
      <input
        type="text"
        value={payload.text}
        onChange={(e: any) => setPayload({ text: e.target.value })}
      />
      <button onClick={send}>알림 테스트</button>
    </>
  );
}

export default App;
