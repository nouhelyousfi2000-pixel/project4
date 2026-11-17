// -------------------------------------------------
// Recherche d'entités (find)
// -------------------------------------------------

export const findCustomerById = (customers, id) => {
    return customers.find(customer => customer.id === id);
};

export const findProductById = (products, id) => {
    return products.find(product => product.id === id);
};


// -------------------------------------------------
// Lignes et montant total d'une commande (map / forEach)
// -------------------------------------------------

export const getOrderLines = (order, products) => {
    return order.items.map(item => {
        const product = findProductById(products, item.productId);
        const price = product ? product.price : 0;

        return {
            product,
            quantity: item.quantity,
            lineAmount: price * item.quantity
        };
    });
};

export const getOrderTotal = (order, products) => {
    const lines = getOrderLines(order, products);
    let total = 0;

    lines.forEach(line => {
        total += line.lineAmount;
    });

    return total;
};


// -------------------------------------------------
// Liste unique des catégories (map + Set)
// -------------------------------------------------

export const getCategories = (products) => {
    const categories = products.map(product => product.category);
    return [...new Set(categories)];
};


// -------------------------------------------------
// Filtrage des commandes visibles (filter + find + some)
// -------------------------------------------------

export const getVisibleOrders = (orders, customers, products, filters) => {
    const searchQuery = filters.search.trim().toLowerCase();

    return orders.filter(order => {
        // 1. Filtre recherche (nom du client)
        const customer = findCustomerById(customers, order.customerId);
        const customerName = customer ? customer.name.toLowerCase() : "";
        const matchesSearch =
            searchQuery === "" || customerName.includes(searchQuery);

        // 2. Filtre statut
        const matchesStatus =
            filters.status === "" || order.status === filters.status;

        // 3. Filtre catégorie (au moins un produit de la commande appartient à la catégorie)
        const matchesCategory =
            filters.category === "" ||
            order.items.some(item => {
                const product = findProductById(products, item.productId);
                return product && product.category === filters.category;
            });

        return matchesSearch && matchesStatus && matchesCategory;
    });
};


// -------------------------------------------------
// Montant cumulé global
// -------------------------------------------------

export const getCumulativeAmount = (orders, products) => {
    // Choix métier : on exclut les commandes ayant le statut "Annulee"
    // car une commande annulée ne génère pas de chiffre d'affaires réel.
    let cumulative = 0;

    orders.forEach(order => {
        if (order.status !== "Annulee") {
            cumulative += getOrderTotal(order, products);
        }
    });

    return cumulative;
};