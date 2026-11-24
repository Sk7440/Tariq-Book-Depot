# Checkout

Checkout is a five-step flow: customer, address, shipping, payment, and completion. COD is the first supported payment method. The cart cookie must only be cleared after Medusa returns `response.type === "order"`.
