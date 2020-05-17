import './styles/style.scss';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap';
import app from './app';
import Api from "./api";


document.addEventListener('DOMContentLoaded', () => {
    const apiInstance = new Api({
        host: 'asos2.p.rapidapi.com',
        apiKey: '3270bbdef6msh9e79abb83a793edp159126jsn80ec67867bce'
    })

    const root = app(
        apiInstance,
        'scroll-to-top',
        'date-field',
        {
            prButtonId: 'all-products',
            prContainerId: 'products-container',
            prSpecialContainer: 'special-products-container',
            prErrorId: 'products-error',
            prSpinnerId: 'products-spinner',
            prTemplate: `<div class="col-6 col-lg-3 padding-5px">
                            <div class="card card-product card-product-padding">
                              <img class="card-product-image-standard product-image" alt="Product" src="@IMAGE@">
                              <div class="card-product-body">
                                <p class="label label-small">@NAME@</p>
                                <h6 class="label label-price">@PRICE@</h6>
                              </div>
                            </div>
                          </div>`
        },
        {
            carContainerId: 'carousel-container',
            arrowLeftId: 'carousel-arrow-left',
            arrowRightId: 'carousel-arrow-right',
            carouselErrorId: 'carousel-error',
            carouselSpinnerId: 'carousel-spinner',
            carSliderId: 'carousel-bottom-slider',
            transClass: 'transition-05',
            carouselItemTemplate: `
            <div class="cover-image cover-image-margin cover-image-hoverable">
              <img class="carousel-image" alt="Product" src="@IMAGE@">
              <div class="image-cover image-cover-reverse">
                <p class="label label-small">@NAME@</p>
                <h6 class="label label-price">@PRICE@</h6>
              </div>
            </div>
            `
        }
    );

    root.init();
});
