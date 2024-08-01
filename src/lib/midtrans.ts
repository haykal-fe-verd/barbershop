import midtransClient from "midtrans-client";

export interface MidtransTransaction {
    token: string;
    redirect_url: string;
}

export const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY,
});

export const createTransaction = async (params: any) => {
    const data = snap.createTransaction(params);
    return data;
};

export const getTransaction = async (token: string) => {
    const data = snap.transaction.status(token);
    return data;
};
