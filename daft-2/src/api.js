import Product from "./product";

/* Class providing interface for performing api requests */
export default class Api {

    constructor({host, apiKey}) {
        this.host = host;
        this.apiKey = apiKey;
    }

    /* Makes request for products list and returns a promise instance */
    async getProductList(limit, offset = 0) {
        const url = new URL(`https://${this.host}/products/v2/list`)
        const params = {
            offset: offset,
            categoryId: "4209",
            limit: limit,
            store: "US"
        };
        url.search = new URLSearchParams(params).toString();
        const response = await fetch(url,
        {
            headers: {
                "x-rapidapi-host": this.host,
                "x-rapidapi-key": this.apiKey,
                "useQueryString": true
            }
        });
        if (response.status !== 200) throw new Error('Request error!');
        const responseJson = await response.json();
        return responseJson.products.map(el => Product.fromJson(el));
    }

}