// -------------------------------------------------
// Éléments HTML
// -------------------------------------------------

const errorMessage = document.querySelector("#errorMessage");
const categorySelect = document.querySelector("#categorySelect");

const totalCustomers = document.querySelector("#totalCustomers");
const totalProducts = document.querySelector("#totalProducts");
const totalOrders = document.querySelector("#totalOrders");
const totalAmount = document.querySelector("#totalAmount");

const resultCount = document.querySelector("#resultCount");
const ordersTableBody = document.querySelector("#ordersTableBody");

const orderModalElement = document.querySelector("#orderModal");
const modalTitle = document.querySelector("#modalTitle");
const modalBody = document.querySelector("#modalBody");


// -------------------------------------------------
// Helpers d'affichage
// -------------------------------------------------

const formatMoney = (amount) => {
    return `${amount.toLocaleString("fr-FR")} MAD`;
};

const getStatusBadgeClass = (status) => {
    if (status === "Livree") {
        return "status-delivered";
    }
    if (status === "En attente") {
        return "status-pending";
    }
    return "status-cancelled";
};

const getStatusLabel = (status) => {
    if (status === "Livree") {
        return "Livrée";
    }
    if (status === "Annulee") {
        return "Annulée";
    }
    return status;
};


// -------------------------------------------------
// Erreur
// -------------------------------------------------

export const renderError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.remove("d-none");
};


// -------------------------------------------------
// Catégories (<select>)
// -------------------------------------------------

export const renderCategories = (categories) => {
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
};


// -------------------------------------------------
// Indicateurs (4 cartes)
// -------------------------------------------------

export const renderStats = ({ customersCount, productsCount, ordersCount, cumulativeAmount }) => {
    totalCustomers.textContent = customersCount;
    totalProducts.textContent = productsCount;
    totalOrders.textContent = ordersCount;
    totalAmount.textContent = formatMoney(cumulativeAmount);
};


// -------------------------------------------------
// Compteur de résultats
// -------------------------------------------------

export const renderResultCount = (count) => {
    resultCount.textContent = `${count} commande(s) affichée(s)`;
};


// -------------------------------------------------
// Tableau des commandes
// -------------------------------------------------

const createOrderRow = (order) => {
    const customerName = order.customer ? order.customer.name : "Client inconnu";
    const paymentText = order.paid ? "Payée" : "Non payée";
    const paymentClass = order.paid ? "text-success" : "text-danger";

    return `
        <tr>
            <td>#${order.id}</td>
            <td>${customerName}</td>
            <td>${order.date}</td>
            <td>
                <span class="status ${getStatusBadgeClass(order.status)}">
                    ${getStatusLabel(order.status)}
                </span>
            </td>
            <td class="${paymentClass}">${paymentText}</td>
            <td class="fw-semibold">${formatMoney(order.total)}</td>
            <td>
                <button
                    type="button"
                    class="btn btn-sm btn-outline-dark detail-btn"
                    data-id="${order.id}"
                >
                    Détail
                </button>
            </td>
        </tr>
    `;
};

export const renderOrders = (preparedOrders) => {
    if (preparedOrders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    Aucune commande
                </td>
            </tr>
        `;
        return;
    }

    ordersTableBody.innerHTML = preparedOrders
        .map(createOrderRow)
        .join("");
};


// -------------------------------------------------
// Modal (remplissage + ouverture)
// -------------------------------------------------

export const fillOrderModal = ({ order, customer, lines, total }) => {
    modalTitle.textContent = `Commande #${order.id}`;

    const clientName = customer ? customer.name : "Client inconnu";
    const clientCity = customer ? customer.city : "-";

    const linesRows = lines.map(line => {
        const productName = line.product ? line.product.name : "Produit inconnu";
        const productPrice = line.product ? formatMoney(line.product.price) : "0 MAD";

        return `
            <tr>
                <td>${productName}</td>
                <td>${productPrice}</td>
                <td>${line.quantity}</td>
                <td class="fw-semibold">${formatMoney(line.lineAmount)}</td>
            </tr>
        `;
    }).join("");

    modalBody.innerHTML = `
        <div class="row mb-3">
            <div class="col-sm-6">
                <p class="mb-1"><strong>Client :</strong> ${clientName}</p>
                <p class="mb-1"><strong>Ville :</strong> ${clientCity}</p>
            </div>
            <div class="col-sm-6">
                <p class="mb-1"><strong>Date :</strong> ${order.date}</p>
                <p class="mb-1">
                    <strong>Statut :</strong>
                    <span class="status ${getStatusBadgeClass(order.status)}">
                        ${getStatusLabel(order.status)}
                    </span>
                </p>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-sm align-middle mb-3">
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Prix</th>
                        <th>Qté</th>
                        <th>Montant</th>
                    </tr>
                </thead>
                <tbody>
                    ${linesRows}
                </tbody>
            </table>
        </div>

        <p class="text-end fs-5 mb-0">
            <strong>Total :</strong> ${formatMoney(total)}
        </p>
    `;
};

export const openOrderModal = () => {
    bootstrap.Modal.getOrCreateInstance(orderModalElement).show();
};