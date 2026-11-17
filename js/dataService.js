const fetchJson = async (path) => {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status} lors du chargement de ${path}`);
    }

    return response.json();
};

export const loadAllData = async () => {
    const [customers, products, orders] = await Promise.all([
        fetchJson("data/customers.json"),
        fetchJson("data/products.json"),
        fetchJson("data/orders.json")
    ]);

    return {
        customers,
        products,
        orders
    };
};