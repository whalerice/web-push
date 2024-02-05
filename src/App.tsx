import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import './App.css';

function App() {
  // const [tokens, setTokens] = useState<any>({
  //   endpoint: '',
  //   keys: { auth: '', p256dh: '' },
  // });

  const [isSubscription, setIsSubscription] = useState<boolean>(false);

  const vapidKey =
    'BJlLPLCWtGen5AVvjK9BR9Ma5YIYI0P7Y_KXzWplZmid1XGDGXwkk_DODaA1kfSgIwk-i25qzVrpGNiBBRNo8Sc';

  const requestPermission = async () => {
    const registration = await navigator.serviceWorker.ready;

    try {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        // 이미 구독이 되어있다면 해지하기
        // TODO: DB에 구독 해지 정보 보내기
        subscription.unsubscribe();
        // subDel();
      } else {
        // 구독이 되어있지 않으면 구독하기
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidKey,
        });
        // TODO: DB에 구독 정보 보내기
        // console.log('subscription => ', subscription.toJSON());
        // subInsert(subscription.toJSON());
        // p256dh
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  // const subInsert = async (value: any) => {
  //   console.log(value);
  //   const sendData = {
  //     auth: value.keys?.auth,
  //     endpoint: value.endpoint,
  //     p256dh: value.keys?.p256dh,
  //   };

  //   const { error } = await supabase.from('sub').insert([sendData]).select();

  //   localStorage.setItem('auth', value.keys?.auth);
  //   if (error) {
  //     console.error(error);
  //   }
  // };

  // const subDel = async () => {
  //   const authValue = localStorage.getItem('auth');
  //   const { error } = await supabase.from('sub').delete().eq('auth', authValue);

  //   if (error) {
  //     console.error(error);
  //   }
  // };

  const get = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      setIsSubscription(true);
    } else {
      setIsSubscription(false);
    }
  };

  useEffect(() => {
    get();
    getNoty();
  }, []);

  async function getNoty() {
    await supabase
      .channel('*')
      .on('postgres_changes', { event: '*', schema: '*' }, async (payload) => {
        if (payload.table === 'noty') {
          if (payload.new) {
            onPush(payload.new);
          }
        }
      })
      .subscribe();
  }

  const onPush = async (data: any) => {
    const text = data.text;

    const registration = await navigator.serviceWorker.ready;
    registration.showNotification('웹푸쉬', { body: text });
  };

  const onSubscription = () => {
    setIsSubscription(!isSubscription);
    requestPermission();
  };

  return (
    <>
      <div>{isSubscription ? '구독중' : '미구독'}</div>
      <button onClick={onSubscription}>
        {isSubscription ? '구독해지' : '구독하기'}
      </button>
    </>
  );
}

export default App;
