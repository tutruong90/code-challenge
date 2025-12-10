export interface Token {
  symbol: string;
  price: number;
  image: string;
  dominantColor?: string;
}

// for API
export interface TokenPrice {
  currency: string; // symbol
  price: number;
}
