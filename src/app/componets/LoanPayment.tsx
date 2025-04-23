import { useEffect } from 'react';
import QRCode from 'react-qr-code'


export default function LoanPayment({ userId, loan_sum, onClick }: { userId: string, loan_sum: number, onClick: () => void }) {
    const paymentUrl = `localhost:3000/api/payment?userId=${userId}`


    return (
      <div style={{ padding: 16 }}>
        <div></div>
        <h3 >Отсканируй для оплаты</h3>
        <p>Долг: {loan_sum}</p>

        <QRCode value={paymentUrl} size={256} />
       <button onClick={onClick} className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
       >Оплатить</button> 
      </div>
    )
}
