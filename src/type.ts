export interface Order {
    id: string;
    items: string[];
    total: number;
}

export interface Payment {
    orderId: string;
    amount: number;
}