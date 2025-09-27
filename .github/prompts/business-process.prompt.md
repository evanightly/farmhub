---
mode: agent
---

Business Process

1.  Product Management + Payment + Image list for carousel (Done)
2.  Catalog Page (Needs refinement)
    Note: `theres 2 transaction path:
    - Authenticated
    - Non-Authenticated Customer

    Both store the same details on the order data, i.e. email, phone number even if the user is authenticated`
3.  Cart page
4.  Payment
5.  Transaction Page, shows transaction list
    5a. (Admin) Order Status Handling:
        - 'status', // pending, confirmed, shipped, delivered, cancelled
        - 'payment_status', // unpaid, paid, verified
    5b. (User) Transaction List
        - Show all user transactions referenced by email, not id
