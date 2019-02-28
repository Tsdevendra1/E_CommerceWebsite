function navBar() {
    new Vue({
        el: '#navbar-app',
        data: function () {
            return {}
        },
        methods: {
            goToBasket: function () {
            }
        },
        computed: {}
    });
    let navBarItems = document.getElementsByClassName('nav-bar-tab');
    let secondaryNav = document.getElementsByClassName('secondary-navbar')[0];
    for (let tab of navBarItems) {
        tab.addEventListener('click', event => {

            // Toggle bottom border
            let mainNav = document.getElementsByClassName('main-navbar')[0];
            mainNav.classList.toggle('show-bottom-border');
            mainNav.classList.toggle('remove-bottom-border');

            secondaryNav.classList.toggle('display-block');
            secondaryNav.classList.toggle('display-none');

            event.target.classList.toggle('selected-tab');
        })
    }

    let prevScrollpos = window.pageYOffset;
    window.onscroll = function () {
        let currentScrollPos = window.pageYOffset;
        if (prevScrollpos > currentScrollPos) {
            document.getElementsByClassName('nav-bars-wrapper')[0].style.top = "0";

        } else {
            document.getElementsByClassName('nav-bars-wrapper')[0].style.top = "-110px";
        }
        prevScrollpos = currentScrollPos;
    };

    let secondDivButtons = document.getElementsByClassName('second-navbar-item');
    for (let button of secondDivButtons) {
        button.addEventListener('click', () => {
            window.location.href = button.getAttribute('data-url');
        })
    }

}

function mainPage() {
    Vue.component('category-search-bar', {
        props: ['categories', 'sorted_selection', 'filter_selection', 'num_tops', 'num_bottoms'],
        mounted: function () {
            // Have to do this because for some reason the display isn't set to none
            let optionBoxs = document.getElementsByClassName('overlap');
            for (let i = 0; i < optionBoxs.length; i++) {
                optionBoxs[i].style.display = 'none';
            }

            let sortLinks = document.getElementsByClassName('sort-link');
            this.setLinkHref(sortLinks, 'order_by', true);

            let categoryLinks = document.getElementsByClassName('category-link');
            this.setLinkHref(categoryLinks, 'filter', false);

            // Have to open and close this so that You can click on the body to close the nav bar as well
            document.getElementsByClassName('option-button')[0].click();
            document.getElementsByClassName('option-button')[0].click();
        },
        data: function () {
            let filtersJson = JSON.parse(this.filter_selection);
            let json = JSON.parse(this.categories);
            return {
                highToLowSelected: (this.sorted_selection && this.sorted_selection === 'pricedesc'),
                lowToHighSelected: (this.sorted_selection && this.sorted_selection === 'priceascend'),
                categoriesArray: json.types,
                amountsArray: json.amounts,
                filters: filtersJson.parameters
            }
        },
        template: `<div class="options-wrapper">
    <ul>
        <li class="inline-list">
            <div class="option" style="display: inline" @click="showBox">
                <button class="option-button">Sort<i class="fas fa-caret-down"></i></button>
            </div>
        </li>
        <li class="inline-list">
            <div @click="showBox" style="display:inline">
                <button class="option-button">Category<i class="fas fa-caret-down"></i></button>
            </div>
        </li>
        <li class="inline-list">
            <div @click="showBox" style="display: inline">
                <button class="option-button">Product Type<i class="fas fa-caret-down"></i></button>
            </div>
        </li>
    </ul>
    <div class="overlap" id="sort-minibox">
        <ul style="list-style-type: none">

            <li :class="[{'selected-link':highToLowSelected},'option-select']" class="option-select">
                <a data-variable="pricedesc" :class="['option-link', 'wide', 'sort-link']" id="high_to_low" class="option-link">Price high to low <i v-if="highToLowSelected" class="far fa-dot-circle"></i><i v-else class="far fa-circle"></i></a>
            </li>
            <li :class="[{'selected-link':lowToHighSelected},'option-select']" class="option-select">
                <a data-variable="priceascend" :class="['option-link', 'wide', 'sort-link']" id="low_to_high">Price low to high <i v-if="lowToHighSelected" class="far fa-dot-circle"></i><i v-else class="far fa-circle"></i></a>
            </li>

        </ul>

    </div>

    <div class="overlap" id="category-minibox">
        <ul style="list-style-type: none">
            <div class="category-header">
                <p class="amount-selected" style="">0 selected</p>
                <button class="all-button">All<i style="margin-left: 5px;" class="fas fa-check"></i></button>
            </div>
            <li v-for="(item, index) in categoriesArray" :class="[checkIfFilter(item)?'selected-link':'', 'option-select']">
                <a  :data-variable="item" class="wide option-link category-link"><span>{{ item }}</span><span :style="checkIfFilter(item)?{color:'white'}:''" class="category-amount">({{ amountsArray[index] }})</span></a>
            </li>

        </ul>
    </div>
    <div class="overlap" id="product-minibox">
        <h3>This is an overlap</h3>
    </div>
</div>
        `,
        methods: {
            checkIfFilter: function (value) {
                return (this.filters.indexOf(value) > -1);
            },
            setLinkHref: function (linkToSet, urlVariable, setVariableValue) {
                // For all links we have to set the correct href and include the url parameter in the appropriate way
                let baseUrl = window.location.href.split('?')[0];
                let parametersAlreadyExist = window.location.href.indexOf('?');
                let variableAlreadyExist = window.location.href.indexOf(urlVariable);
                for (let link of linkToSet) {
                    let variableValue = link.getAttribute('data-variable');
                    if (!link.parentElement.classList.contains('selected-link')) {
                        if (parametersAlreadyExist < 0 && variableAlreadyExist < 0) {
                            link.href = baseUrl + `?${urlVariable}=${variableValue}`;
                        } else if (variableAlreadyExist >= 0) {
                            let urlObject = new URL(window.location.href);
                            if (setVariableValue) {
                                urlObject.searchParams.set(urlVariable, variableValue);
                            } else {
                                urlObject.searchParams.append(urlVariable, variableValue);
                            }
                            link.href = urlObject.href;
                        } else {
                            link.href = window.location.href + `&${urlVariable}=${variableValue}`;
                        }
                    } else {
                        if (urlVariable === 'filter') {
                            let urlObject = new URL(window.location.href);
                            let currentFilters = urlObject.searchParams.getAll('filter');
                            let index = currentFilters.indexOf(variableValue);
                            if (index > -1) {
                                currentFilters.splice(index, 1);
                            }
                            urlObject.searchParams.delete(urlVariable);
                            for (let value of currentFilters) {
                                urlObject.searchParams.append(urlVariable, value);
                            }
                            console.log(variableValue);
                            console.log(urlObject.href);
                            link.href = urlObject.href;
                        }
                    }
                }
            },
            showBox: function (event) {
                let currentElement = event.target;
                let optionButtons = document.getElementsByClassName('option-button');
                let optionBoxs = document.getElementsByClassName('overlap');


                function allowClickToClose() {
                    // This function closes any of the overlap boxes if the body is clicked
                    if (open) {
                        let overlapBoxes = document.getElementsByClassName('overlap');
                        for (let box of overlapBoxes) {
                            if (box.style.display !== 'none') {
                                box.style.display = 'none';
                            }
                        }
                        let openNavBarBoxes = document.getElementsByClassName('selected-tab');
                        for (let openTab of openNavBarBoxes) {
                            openTab.click();
                        }
                        open = false;
                    } else {
                        open = true;
                    }
                }


                let index = 0;
                // Go through buttons and show corresponding box for that button if clicked. Turn off all other boxes
                for (let button of optionButtons) {
                    let currentBox = optionBoxs[index];
                    if (button === currentElement && currentBox.style.display === 'none') {
                        currentBox.style.display = 'block';
                        var open = false;
                        document.getElementsByTagName('body')[0].onclick = allowClickToClose
                    } else {
                        currentBox.style.display = 'none';
                    }
                    index += 1;
                }
            }
        }
    });

    Vue.component('product', {
        props: ['page_url', 'source', 'price', 'title'],
        data: function () {
            return {
                count: 0
            }
        },
        // HTML
        template:
            `
<a :href="page_url  ">
    <img width="316" height="404" :src="source">
    <p>{{ title }}</p>
    <p>£{{ price }}</p>
</a>
`
    });
    new Vue({
        el: '#product-list',
        data: function () {
            return {}
        }
    });

    new Vue({
        el: '#app',
        data: function () {
            return {}
        }
    });
}

function addPage() {
    new Vue({
        el: '#app',
        data: function () {
            return {
                currentlyDisplayed: 1,
            }
        },
        computed: {
            disableRemoveButton: function () {
                return (this.currentlyDisplayed === 1)
            },
            disableAddButton: function () {
                return (this.currentlyDisplayed === 4)
            }
        },
        methods: {
            showPicture: function () {
                let formsetGroup = document.getElementsByClassName('formset-group');
                let currentlyDisplay = 0;
                for (let form of formsetGroup) {
                    if (form.style.display !== 'none') {
                        currentlyDisplay++;
                    }
                }
                if (currentlyDisplay < formsetGroup.length) {
                    // Display the next form
                    formsetGroup[(currentlyDisplay)].style.display = 'block';
                }
                this.currentlyDisplayed = currentlyDisplay + 1;

            },
            removePicture: function () {
                let formsetGroup = document.getElementsByClassName('formset-group');
                let currentlyDisplay = 0;
                for (let form of formsetGroup) {
                    if (form.style.display !== 'none') {
                        currentlyDisplay++;
                    }
                }
                if (currentlyDisplay > 1) {
                    // Display the next form
                    formsetGroup[(currentlyDisplay - 1)].style.display = 'none';
                }
                this.currentlyDisplayed = currentlyDisplay - 1;
            }
        }
    });
}


function saveUserPurchases(url, productId, csrfToken) {
    let data = {productId: productId};
    fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "X-CSRFToken": csrfToken,
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
}

function productPage() {
    // localStorage.clear();
    new Vue({
        el: '#app',
        data: function () {
            return {
                currentImageNum: 0,
            }
        },
        methods: {
            addItemToBasket: function (productId) {
                let csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
                let url = document.getElementById('post-url').getAttribute('data-url');
                saveUserPurchases(url, productId, csrfToken);
            },
            leftImageButton: function () {
                let images = document.getElementsByClassName('product-image');
                this.currentImageNum--;
                // Reset to end if out of bounds
                if (this.currentImageNum < 0) {
                    this.currentImageNum = images.length - 1;
                }
                let mainImage = document.getElementById('main-image');
                mainImage.src = images[this.currentImageNum].getAttribute('data-src');

            },
            rightImageButton: function () {
                let images = document.getElementsByClassName('product-image');
                this.currentImageNum++;
                // Reset to start if out of bounds
                if (this.currentImageNum >= images.length) {
                    this.currentImageNum = 0;
                }
                let mainImage = document.getElementById('main-image');
                mainImage.src = images[this.currentImageNum].getAttribute('data-src');
            },
            setMainImage: function (event) {
                let images = document.getElementsByClassName('product-image');
                let currentImageIndex = 0;
                for (let image of images) {
                    if (image === event.target) {
                        break;
                    } else {
                        currentImageIndex++;
                    }
                }
                document.getElementById('main-image').src = images[currentImageIndex].src;
                this.currentImageNum = currentImageIndex;

            }
        }
    });
}

function basketPage() {

}
