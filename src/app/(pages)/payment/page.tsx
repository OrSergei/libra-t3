'use client'

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [status, setStatus] = useState('');

  const handlePayment = async () => {
    const res = await fetch(`/api/payment?userId=${userId}`, {
      method: 'POST',
    });

    const data = await res.json();
    setStatus(res.ok ? "Успешно оплачено!" : data.message || "Ошибка при оплате");
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Подтвердите оплату</h2>
      <button onClick={handlePayment}>Оплатить долг</button>
      <p>{status}</p>
    </div>
  );
}
