# Rypto Proyecto de Desarrollo

## Estructura de Componentes:

### Open Orders (0):
- **Component:** `OrderTabs.js`
  - Líneas: 8771, 8770
- **WebSocket:** `order_tabs_web_socket.py`
  - Líneas: 8771
- **WebSocket:** `order_tabs_history_web_socket.py`
  - Líneas: 8770

**Detalle:**  
Open Orders en UI muestra las órdenes abiertas referentes a la dirección correspondiente que están esperando para ser ejecutadas en 10 minutos. El usuario las ve como pedidos de compra para Rypto Stable que están esperando 10 minutos para la validación.

### Wallets:
- **Component:** `Components/command/Market.js`
- **WebSocket:** `wallet_web_socket.py`
  - Manda el balance actualizado y escucha de compras ejecutadas.
- **WebSocket:** `ganache_time_bot.py`
  - Para testeo, incrementa el tiempo.
- **Daemon:** `rypto_stable_purchase_handler.py`
  - Busca los que pasaron 10 minutos y llama a `execute purchase`.

### Rypto Naive:
- **Component:** `Components/command/Limit.js`

**Nota:**  
Cuidado al estar en la librería el evento `pair transaction` para escucharlo. Hay que agregarlo en el ABI manualmente o modificar el smart contract. Igualmente, es solo.

---

### Instrucciones de Uso:

1. Clonar el repositorio.
2. Configurar las dependencias necesarias.
3. Ejecutar el proyecto según las indicaciones.

### Contribuciones:
Para contribuir, por favor crear un fork del repositorio, hacer los cambios pertinentes y enviar un pull request. Nos aseguraremos de revisarlo y fusionarlo si todo está en orden.

### Licencia:
Este proyecto está licenciado bajo los términos de la licencia XYZ.

---

Para más información, visita nuestra [documentación oficial](#).
