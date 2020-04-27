import './styles/style.scss';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap';
import app from './app';

document.addEventListener('DOMContentLoaded', () => {
    const root = app(
        'scroll-to-top',
        'date-field',
        {
            prButtonId: 'all-products',
            prContainerId: 'products-container',
            prTemplate: `<div class="col-6 col-lg-3 padding-5px">
                    <div class="card card-product card-product-padding">
                      <img class="card-product-image-standard" alt="Product" src="https://via.placeholder.com/309x390">
                      <div class="card-product-body">
                        <p class="label label-small">Azure Tote</p>
                        <h6 class="label label-price">$299.99</h6>
                      </div>
                    </div>
                  </div>`
        },
        {
            carContainerId: 'carousel-container',
            arrowLeftId: 'carousel-arrow-left',
            arrowRightId: 'carousel-arrow-right',
            carSliderId: 'carousel-bottom-slider',
            transClass: 'transition-05'
        }
    );

    root.init();
});
