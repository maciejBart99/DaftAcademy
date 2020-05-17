import Api from "./api";
import Product from "./product";

/* Module handling scroll to top, adding items to the container and dynamic carousel */
export default function app(apiInstance, scrollTopButtonId, dateContainerId,
                            {prButtonId, prContainerId, prTemplate, prSpecialContainer, prSpinnerId, prErrorId},
                            {carContainerId, arrowLeftId, arrowRightId, carSliderId, transClass, carouselItemTemplate, carouselErrorId, carouselSpinnerId}) {
    let productContainer;
    let carouselContainer;
    let carouselWidth;
    let carouselCurrentItem;
    let carouselItemWidth;
    let carouselWindowWidth;
    let productsError;
    let carouselItemsCount;
    let carouselSlider;
    let sliderWidth;
    let carouselError;
    let carouselSpinner;
    let touchStartCords;
    let prSpinner;
    let carouselTouchStartItem;
    let productSpecialContainer;
    let touchStartElement;
    let scrollBtn;
    let loadedProductsCount = 0;

    const step = 45;
    const listLimit = 20;
    const sliderElements = 8;

    function toggleScrollButton()
    {
        if (window.scrollY > window.innerHeight / 2) scrollBtn.style.display = 'initial';
        else scrollBtn.style.display = 'none';
    }

    function touchEndCancel(event)
    {
        event.preventDefault();
        carouselCurrentItem = Math.round(carouselCurrentItem);
        carouselContainer.classList.add(transClass);
        carouselSlider.classList.add(transClass);
        carouseMove();
    }

    /* Recursively scroll to top with timeout */
    function smoothGoTo() {
        window.scrollBy(0, -step);
        if (window.scrollY > 0) setTimeout(() => smoothGoTo(), 0);
    }

    /* update carousel and slider position */
    function carouseMove()
    {
        carouselContainer.style.transform = `translateX(${-carouselCurrentItem * carouselItemWidth}px)`;
        carouselSlider.style.transform = `translateX(${20 + ((carouselWindowWidth - carouselSlider.offsetWidth)
            * carouselCurrentItem / carouselItemsCount)}px)`;
    }

    /* Refresh carousel  */
    function reloadCarousel()
    {
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

    /* Add scroll to top support */
    function initScroll()
    {
        scrollBtn = document.getElementById(scrollTopButtonId);
        scrollBtn.addEventListener(
            'click', () => smoothGoTo()
        );
        window.addEventListener('scroll', toggleScrollButton);
        toggleScrollButton();
    }

    /* Start interactive carousel */
    function initCarousel() {
        carouselContainer = document.getElementById(carContainerId);
        carouselSlider = document.getElementById(carSliderId);
        carouselError = document.getElementById(carouselErrorId);
        carouselSpinner = document.getElementById(carouselSpinnerId);
        apiInstance.getProductList(sliderElements, loadedProductsCount).then(resp => {
            resp.forEach(prod => {
                const price = `${prod.currentPrice} ${prod.currency}`;
                const template = carouselItemTemplate.replace('@NAME@', prod.name)
                    .replace('@IMAGE@', `https://${prod.imgUrl}`)
                    .replace('@PRICE@', price);
                carouselContainer.insertAdjacentHTML('beforeend', template);
            });
            sliderWidth = carouselSlider.offsetWidth;
            carouselCurrentItem = 0;
            reloadCarousel();
        }).finally(_ => {
            carouselSpinner.classList.remove('d-flex');
            carouselSpinner.classList.add('d-none');
        }).catch(_ => {
            carouselError.classList.remove('d-none');
            carouselError.classList.add('d-flex');
        });
        loadedProductsCount += sliderElements;
        document.getElementById(arrowLeftId).addEventListener(
            'click', () => {
                if (carouselCurrentItem !== 0) {
                    carouselCurrentItem--;
                    carouseMove();
                }
            }
        );
        document.getElementById(arrowRightId).addEventListener(
            'click', () => {
                if (carouselCurrentItem !== carouselItemsCount - 1
                    && carouselCurrentItem * carouselItemWidth + carouselWindowWidth < carouselWidth) {
                    carouselCurrentItem++;
                    carouseMove();
                }
            }
        );
        window.addEventListener('resize', reloadCarousel);
        // Add touch swipe support
        carouselContainer.parentElement.addEventListener(
            'touchstart', event => {
                event.preventDefault();
                touchStartCords = {
                    x: event.targetTouches[0].screenX,
                    y: event.targetTouches[0].screenY
                };
                carouselTouchStartItem = carouselCurrentItem;
                carouselContainer.classList.remove(transClass);
                carouselSlider.classList.remove(transClass);
                touchStartElement = carouselCurrentItem;
            }
        );
        carouselContainer.parentElement.addEventListener(
            'touchmove', event => {
                event.preventDefault();
                let xTranslation = -event.targetTouches[0].screenX + touchStartCords.x;
                let xProportion = xTranslation / carouselItemWidth;
                carouselCurrentItem = Math.max(0, Math.min(carouselTouchStartItem + xProportion,
                    carouselItemsCount - Math.floor(carouselWindowWidth / carouselItemWidth)));
                carouseMove();
            }
        );
        carouselContainer.parentElement.addEventListener(
            'touchend', touchEndCancel
        );
        carouselContainer.parentElement.addEventListener(
            'touchcancel', touchEndCancel
        );
    }
    /* Update date in the footer */
    function setFooterDate() {
        document.getElementById(dateContainerId).innerText = String((new Date()).getFullYear());
    }

    function appendMoreProducts()
    {
        document.getElementById(prButtonId).setAttribute('disabled', 'true');
        prSpinner.classList.remove('d-none');
        productsError.classList.add('d-none');
        apiInstance.getProductList(listLimit, loadedProductsCount).then(resp => {
            productsError.classList.add('d-none');
            resp.forEach(prod => {
                const price = `${prod.currentPrice} ${prod.currency}`;
                const template = prTemplate.replace('@NAME@', prod.name)
                    .replace('@IMAGE@', `https://${prod.imgUrl}`)
                    .replace('@PRICE@', price);
                productContainer.insertAdjacentHTML('beforeend', template);
            });
        }).catch(_ => {
            productsError.classList.remove('d-none');
        }).finally(_ => {
            prSpinner.classList.add('d-none');
            document.getElementById(prButtonId).removeAttribute('disabled');
        });
        loadedProductsCount += listLimit;
    }

    /* Add AllProducts support */
    function initProducts() {
        productContainer = document.getElementById(prContainerId);
        productSpecialContainer = document.getElementById(prSpecialContainer);
        prSpinner = document.getElementById(prSpinnerId);
        productsError = document.getElementById(prErrorId);
        appendMoreProducts();
        const specials = productSpecialContainer.querySelectorAll('[data-value="item"]');
        apiInstance.getProductList(specials.length, loadedProductsCount).then(resp => {
            specials.forEach(
                (el, ind) => {
                    const nameField = el.querySelector('[data-value="name"]');
                    const imgField = el.querySelector('[data-value="image"]');
                    nameField.innerHTML = resp[ind].name;
                    imgField.src = `https://${resp[ind].imgUrl}`;
                }
            );
            productSpecialContainer.classList.remove('d-none');
        });
        loadedProductsCount += specials.length;
        document.getElementById(prButtonId).addEventListener(
            'click', () => {
              appendMoreProducts();
            }
        );
    }

    /* load module on ready DOM tree */
    function init()
    {
        initScroll();
        setFooterDate();
        initCarousel();
        initProducts();
    }

    return {
        init
    }
}
