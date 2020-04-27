
/* Module handling scroll to top, adding items to the container and dynamic carousel */
export default function app(scrollTopButtonId, dateContainerId,
                            {prButtonId, prContainerId, prTemplate},
                            {carContainerId, arrowLeftId, arrowRightId, carSliderId, transClass}) {
    let productContainer;
    let carouselContainer;
    let carouselWidth;
    let carouselCurrentItem;
    let carouselItemWidth;
    let carouselWindowWidth;
    let carouselItemsCount;
    let carouselSlider;
    let sliderWidth;
    let touchStartCords;
    let carouselTouchStartItem;
    let touchStartElement;
    let scrollBtn;

    const step = 45;

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

    /* load module on ready DOM tree */
    function init()
    {
        // Add scroll to top support
        scrollBtn = document.getElementById(scrollTopButtonId);
        scrollBtn.addEventListener(
            'click', () => smoothGoTo()
        );
        window.addEventListener('scroll', toggleScrollButton);
        toggleScrollButton();
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

    return {
        init
    }
}
