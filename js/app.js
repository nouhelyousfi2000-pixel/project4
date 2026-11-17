import { state } from "./state.js";
import { loadAllData } from "./dataService.js";
import {
    findCustomerById,
    getOrderLines,
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
    renderOrders,
    fillOrderModal,
    openOrderModal
} from "./view.js";


// -------------------------------------------------
// Éléments HTML pour les événements
// -------------------------------------------------

const searchInput = document.querySelector("#searchInput");
const statusSelect = document.querySelector("#statusSelect");
const categorySelect = document.querySelector("#categorySelect");
const ordersTableBody = document.querySelector("#ordersTableBody");


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
// Gestion des événements
// -------------------------------------------------

const bindEvents = () => {
    // Recherche par client
    searchInput.addEventListener("input", (event) => {
        state.search = event.target.value;
        render();
    });

    // Filtre par statut
    statusSelect.addEventListener("change", (event) => {
        state.status = event.target.value;
        render();
    });

    // Filtre par catégorie
    categorySelect.addEventListener("change", (event) => {
        state.category = event.target.value;
        render();
    });

    // Détail d'une commande (délégation d'événement)
    ordersTableBody.addEventListener("click", (event) => {
        const button = event.target.closest(".detail-btn");
        if (!button) {
            return;
        }

        const orderId = Number(button.dataset.id);
        const order = state.orders.find(item => item.id === orderId);
        if (!order) {
            return;
        }

        const customer = findCustomerById(state.customers, order.customerId);
        const lines = getOrderLines(order, state.products);
        const total = getOrderTotal(order, state.products);

        fillOrderModal({ order, customer, lines, total });
        openOrderModal();
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
        bindEvents();
    } catch (error) {
        console.error(error);
        renderError("Impossible de charger les données. Vérifiez les fichiers JSON.");
    }
};

init();