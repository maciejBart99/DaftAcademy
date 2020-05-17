export default class Product
{
    constructor({name, currentPrice, previousPrice, currency, brandName, imgUrl}) {
        this.name = name;
        this.currentPrice = currentPrice;
        this.previousPrice = previousPrice;
        this.brandName = brandName;
        this.currency = currency;
        this.imgUrl = imgUrl;
    }

    get isPromo() {
        return this.previousPrice && this.previousPrice !== this.currentPrice;
    }

    static fromJson(json) {
        return new Product({
            name: json.name,
            currentPrice: json.price.current.value,
            previousPrice: json.price.previous.value,
            currency: json.price.currency,
            brandName: json.brandName,
            imgUrl: json.imageUrl})
    }
}