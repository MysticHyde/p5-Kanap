let url = window.location.href
url = new URL(url);
let order_id = url.searchParams.get("id");
if (String(order_id).length > 0) {
    let el_orderId = document.getElementById('orderId')

    el_orderId.textContent = order_id
} else {
    let redirect = "./";
    window.location.href = redirect;
}
