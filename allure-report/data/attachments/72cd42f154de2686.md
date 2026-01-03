# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img
        - generic [ref=e7]: Sales Portal
      - link "Home" [ref=e9] [cursor=pointer]:
        - /url: "#/home"
      - link "Orders" [ref=e11] [cursor=pointer]:
        - /url: "#/orders"
      - link "Products" [ref=e13] [cursor=pointer]:
        - /url: "#/products"
      - link "Customers" [ref=e15] [cursor=pointer]:
        - /url: "#/customers"
      - link "Managers" [ref=e17] [cursor=pointer]:
        - /url: "#/managers"
    - generic [ref=e19]:
      - button "" [ref=e21] [cursor=pointer]:
        - generic: 
      - button "" [ref=e22] [cursor=pointer]:
        - generic: 
      - link "User" [ref=e24] [cursor=pointer]:
        - /url: "#/managers/undefined"
        - strong [ref=e25]: User
      - button "" [ref=e26] [cursor=pointer]:
        - generic: 
  - generic [ref=e29]:
    - heading "Connection failed" [level=1] [ref=e30]
    - paragraph [ref=e31]: Opps! Something went wrong.
    - paragraph [ref=e32]: Can't reach the data. Please, try again later.
    - link "Back to Home" [ref=e33] [cursor=pointer]:
      - /url: "#/home"
```