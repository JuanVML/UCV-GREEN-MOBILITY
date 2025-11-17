# 📊 Sistema de Logging del Chatbot

## 🎯 ¿Qué hace?

Guarda **automáticamente** todas las conversaciones del chatbot en Firebase para calcular la **precisión >= 88%** que requiere tu profesor.

---

## ⚡ Quick Start

### 1. Iniciar servidor
```bash
cd backend/functions
npm run dev:server
```

### 2. Usar el chatbot normalmente
✅ Los logs se guardan automáticamente en Firebase
✅ No requiere configuración adicional

### 3. Ver estadísticas
```bash
curl http://localhost:3001/chatbot-getStatistics
```

### 4. Exportar a Excel
```bash
# Desde navegador:
http://localhost:3001/chatbot-exportLogs

# Desde terminal:
curl -o logs.csv http://localhost:3001/chatbot-exportLogs
```

---

## 📊 Datos Guardados

Cada conversación incluye:
- Pregunta del usuario
- Respuesta del bot
- Fecha/hora
- Tiempo de respuesta (ms)
- Éxito/Fallo
- Usuario (email)

---

## 🔌 Endpoints

### **1. Estadísticas**
```bash
GET http://localhost:3001/chatbot-getStatistics
```
Retorna:
```json
{
  "totalConversations": 150,
  "totalUsers": 25,
  "successRate": 92.67,  // ← PRECISIÓN
  "averageResponseTime": 1450
}
```

### **2. Logs por usuario**
```bash
GET http://localhost:3001/chatbot-getUserLogs?userId=EMAIL
```

### **3. Exportar CSV**
```bash
GET http://localhost:3001/chatbot-exportLogs
```
Parámetros opcionales:
- `userId=EMAIL` - Filtrar por usuario
- `startDate=2025-01-01` - Fecha inicio
- `endDate=2025-12-31` - Fecha fin

---

## 📈 Análisis en Excel

### **Paso 1: Exportar**
```bash
curl -o chatbot_logs.csv http://localhost:3001/chatbot-exportLogs
```

### **Paso 2: Abrir en Excel**
File → Open → `chatbot_logs.csv`

### **Paso 3: Calcular precisión**
```
Precisión = (Cantidad de "Yes" / Total) × 100
```

**Ejemplo:**
- Total: 100 conversaciones
- Success: 93
- **Precisión: 93%** ✅ (supera el 88%)

---

## 🔥 Ver en Firebase Console

### **Opción 1: Pedir acceso**
Tu compañero te invita:
1. Firebase Console → Configuración → Usuarios y permisos
2. Agregar miembro → Tu email → Editor
3. Aceptas invitación

### **Opción 2: Usar su cuenta**
Pedirle usuario/contraseña temporalmente

### **Ver logs:**
1. Firebase Console → Firestore Database
2. Colección: `chatbot_logs`
3. Export → CSV

---

## 🧪 Probar (2 minutos)

```bash
# 1. Enviar mensaje
curl -X POST http://localhost:3001/chatbot-sendMessage \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Cómo llego a la UCV?", "userId": "test@ucv.edu.pe"}'

# 2. Ver logs
curl "http://localhost:3001/chatbot-getUserLogs?userId=test@ucv.edu.pe"

# 3. Ver estadísticas
curl http://localhost:3001/chatbot-getStatistics

# 4. Exportar CSV
curl -o test.csv http://localhost:3001/chatbot-exportLogs
```

---

## 📝 Para tu Profesor

### **Entregables:**

1. **CSV con conversaciones** ✅
   ```bash
   curl -o analisis.csv http://localhost:3001/chatbot-exportLogs
   ```

2. **Precisión calculada** ✅
   - En Excel: `= COUNTIF(ColumnSuccess, "Yes") / COUNTA(ColumnSuccess) * 100`
   - Debe ser >= 88%

3. **Gráficos en Excel** ✅
   - Precisión por día
   - Tiempos de respuesta
   - Usuarios activos

---

## ❓ FAQ

**¿Se guarda automáticamente?**
Sí, cada conversación se guarda en Firebase sin intervención.

**¿Afecta la velocidad?**
No, el logging no bloquea la respuesta del bot.

**¿Qué pasa si Firebase falla?**
El chatbot sigue funcionando, solo no se guarda ese log.

**¿Cómo exporto solo mis conversaciones?**
```bash
curl -o mis_logs.csv "http://localhost:3001/chatbot-exportLogs?userId=TU_EMAIL"
```

---

## ✅ Checklist

- [x] Sistema de logging implementado
- [x] Endpoints funcionando
- [x] Export a CSV funcionando
- [ ] **Pedir acceso a Firebase** ← TU SIGUIENTE PASO
- [ ] Probar con conversaciones reales
- [ ] Analizar en Excel
- [ ] Crear gráficos
- [ ] Presentar al profesor

---

## 🎯 Resumen Ultra-Corto

1. **Usa el chatbot** → Se guarda automáticamente
2. **Cuando necesites analizar** → `http://localhost:3001/chatbot-exportLogs`
3. **Abre en Excel** → Calcula precisión
4. **Presenta al profesor** → CSV + gráficos + precisión >= 88%

¡Listo! 🚀
