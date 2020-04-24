
/* Module handling scroll to top, adding items to the container and dynamic carousel */
function app(scrollTopButtonId, dateContainerId,
                            {prButtonId, prContainerId, prTemplate},
                            {carContainerId, arrowLeftId, arrowRightId, carSliderId}) {
    let productContainer;
    let carouselContainer;
    let carouselWidth;
    let carouselCurrentItem;
    let carouselItemWidth;
    let carouselWindowWidth;
    let carouselItemsCount;
    let carouselSlider;
    let sliderWidth;
    let touchStartCords = null;
    let touchStartElement;

    const step = 45;

    /* Recursively scroll to top with timeout */
    function smoothGoTo(y) {
        y -= step;
        window.scrollBy(0, -step);
        if (y >= 0) setTimeout(() => smoothGoTo(y), 0);
    }

    /* update carousel and slider position */
    function carouseMove()
    {
        carouselContainer.style.left = String(-carouselCurrentItem * carouselItemWidth) + 'px';
        carouselSlider.style.left = String(20 + ((carouselWindowWidth - 200)
            * carouselCurrentItem / carouselItemsCount)) + 'px';
    }

    /* Refresh carousel  */
    function reloadCarousel()
    {
        console.log('reload');
        carouselWidth = 0;
        Array.from(carouselContainer.children).forEach(
            (el) => {
                const st = getComputedStyle(el);
                carouselWidth += el.offsetWidth + parseInt(st.marginLeft) + parseInt(st.marginRight);
            });
        carouselWindowWidth = carouselContainer.clientWidth;
        carouselItemsCount = carouselContainer.childElementCount;
        carouselItemWidth = (carouselItemsCount !== 0) ? (carouselWidth / carouselItemsCount) : 0;
    }

    /* load module on ready DOM tree */
    function init()
    {
        // Add scroll to top support
        document.getElementById(scrollTopButtonId).addEventListener(
            'click', () => smoothGoTo(window.scrollY)
        );
        // Update date in the footer
        document.getElementById(dateContainerId).innerText = String((new Date()).getFullYear());
        // Add AllProducts support
        productContainer = document.getElementById(prContainerId);
        document.getElementById(prButtonId).addEventListener(
            'click', () => {
                for(let i = 0; i < 8; i++)
                    productContainer.insertAdjacentHTML('beforeend', prTemplate);
            }
        );
        // Add carousel
        carouselContainer = document.getElementById(carContainerId);
        carouselSlider = document.getElementById(carSliderId);
        sliderWidth = carouselSlider.offsetWidth;
        carouselCurrentItem = 0;
        reloadCarousel();
        document.getElementById(arrowLeftId).addEventListener(
            'click', () => {
                if (carouselCurrentItem !== 0)
                {
                    carouselCurrentItem--;
                    carouseMove();
                }
            }
        );
        document.getElementById(arrowRightId).addEventListener(
            'click', () => {
                if (carouselCurrentItem !== carouselItemsCount - 1
                    && carouselCurrentItem * carouselItemWidth + carouselWindowWidth < carouselWidth)
                {
                    carouselCurrentItem++;
                    carouseMove();
                }
            }
        );
        window.addEventListener('resize', reloadCarousel);
        // Add touch swipe support
        carouselContainer.addEventListener(
            'touchstart', event => {
                touchStartCords = {
                    x: event.targetTouches[0].screenX,
                    y: event.targetTouches[0].screenY
                };
                carouselContainer.classList.remove('transition-05');
                carouselSlider.classList.remove('transition-05');
                touchStartElement = carouselCurrentItem;
            }
        );
        carouselContainer.addEventListener(
            'touchmove', event => {
                let xTranslation = -event.targetTouches[0].screenX + touchStartCords.x;
                let xProportion = xTranslation * carouselItemsCount / carouselWidth / 10;
                carouselCurrentItem = Math.max(0, Math.min(carouselCurrentItem + xProportion,
                    carouselItemsCount - Math.floor(carouselWindowWidth / carouselItemWidth)));
                carouseMove();
            }
        );
        carouselContainer.addEventListener(
            'touchend', event => {
                carouselCurrentItem = Math.round(carouselCurrentItem);
                carouselContainer.classList.add('transition-05');
                carouselSlider.classList.add('transition-05');
                carouseMove();
            }
        );
    }

    if (arguments.length !== 4) throw Error("Invalid arguments!");

    return {
        init, reloadCarousel
    }
}

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
        carSliderId: 'carousel-bottom-slider'
    }
);

document.addEventListener('DOMContentLoaded', root.init);
