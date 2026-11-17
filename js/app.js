
import { state } from "./state.js";
import { loadAllData } from "./dataService.js";
import {
    findCustomerById,
    getOrderTotal,
    getCategories,
    getVisibleOrders,
    getCumulativeAmount
} from "./selectors.js";
import {
    renderError,
    renderCategories,
    renderStats,
    renderResultCount,
    renderOrders
} from "./view.js";


// -------------------------------------------------
// Rendu principal
// -------------------------------------------------

const render = () => {
    const visibleOrders = getVisibleOrders(
        state.orders,
        state.customers,
        state.products,
        {
            search: state.search,
            status: state.status,
            category: state.category
        }
    );

    const preparedOrders = visibleOrders.map(order => ({
        ...order,
        customer: findCustomerById(state.customers, order.customerId),
        total: getOrderTotal(order, state.products)
    }));

    renderOrders(preparedOrders);
    renderResultCount(preparedOrders.length);

    renderStats({
        customersCount: state.customers.length,
        productsCount: state.products.length,
        ordersCount: state.orders.length,
        cumulativeAmount: getCumulativeAmount(state.orders, state.products)
    });
};


// -------------------------------------------------
// Initialisation
// -------------------------------------------------

const init = async () => {
    try {
        const { customers, products, orders } = await loadAllData();

        state.customers = customers;
        state.products = products;
        state.orders = orders;

        const categories = getCategories(state.products);
        renderCategories(categories);

        render();
    } catch (error) {
        console.error(error);
        renderError("Impossible de charger les données. Vérifiez les fichiers JSON.");
    }
};

init();