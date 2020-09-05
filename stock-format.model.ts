export class StockFormat {
    constructor(
        public id: String,
        public action: String,
        public date: Date,
        public stopLoss: number,
        public symbol: String,
        public target: number,
        public trigger: number,
        public eodPrice: number,
        public eodPriceUpdated: String
    ){}
}
