# MySavings
<img width="540" height="1170" alt="image" src="https://github.com/user-attachments/assets/f1a3abb8-08f6-4dca-b739-8ba59d0ce455" />



# 💰 MySavings - Aplicación de Gestión Financiera Personal

Una aplicación móvil completa para gestionar tus finanzas personales con React Native y Expo.

## 🎯 Características Principales

### 📊 Dashboard
- **Resumen Financiero**: Visualiza tu balance total, ingresos y gastos del mes actual
- **Análisis de Gastos**: Porcentaje de gasto respecto a ingresos con recomendaciones inteligentes
- **Consejos Financieros**: Tips útiles para mejorar tu situación financiera
- **Refresco Manual**: Actualiza los datos con un gesto

### 💰 Gestión de Ingresos
- **Registro de Ingresos**: Registra ingresos semanales o mensuales
- **Calendario Interactivo**: Selecciona la fecha de ingreso desde un calendario personalizado
- **Historial**: Visualiza todos tus ingresos registrados
- **Edición y Eliminación**: Modifica o elimina registros

### 💸 Seguimiento de Gastos Diarios
- **Categorización**: Clasifica gastos en 7 categorías (Alimentación, Transporte, Entretenimiento, etc.)
- **Selección de Fecha**: Elige fácilmente la fecha del gasto
- **Emojis Visuales**: Iconos para cada categoría de gasto
- **Historial Reciente**: Visualiza tus últimos 10 gastos con totales

### 🔔 Recordatorios y Alertas
- **Recordatorios Personalizados**: Para renovaciones, membresías y pagos cotidianos
- **Frecuencia Flexible**: Configura como únicos, mensuales o anuales
- **Prioridades**: Asigna niveles de prioridad a cada recordatorio
- **Estado Activo/Inactivo**: Controla qué recordatorios están vigentes

### 🎯 Planes de Ahorro
- **Metas Financieras**: Crea planes con objetivos y fechas límite
- **Seguimiento Visual**: Barras de progreso con porcentaje completado
- **Prioridades**: Bajo, Medio, Alto
- **Agregar Ahorros**: Incrementa el ahorro de forma rápida o edítalo directamente
- **Planes Completados**: Visualiza tus logros

## 🛠️ Tecnologías Utilizadas

- **React Native 0.81.5**: Framework multiplataforma
- **TypeScript**: Tipado estático para mayor seguridad
- **Expo 54.0.18**: Plataforma de desarrollo
- **AsyncStorage**: Almacenamiento persistente de datos
- **StyleSheet**: Estilos nativos optimizados

## 📦 Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd MySavings
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación**
   ```bash
   npm start
   ```

4. **Ejecutar en tu dispositivo**
   - **Android**: Presiona `a` en la terminal
   - **iOS**: Presiona `i` en la terminal
   - **Web**: Presiona `w` en la terminal

## 📱 Estructura del Proyecto

```
MySavings/
├── App.tsx                 # Componente principal con navegación
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx      # Pantalla de resumen
│   │   ├── IncomeForm.tsx     # Registro de ingresos
│   │   ├── ExpenseForm.tsx    # Registro de gastos
│   │   ├── Reminders.tsx      # Gestor de recordatorios
│   │   ├── SavingsPlan.tsx    # Planes de ahorro
│   │   └── ui/
│   │       ├── Button.tsx     # Componente reutilizable
│   │       ├── Input.tsx      # Campo de entrada
│   │       └── Card.tsx       # Contenedor de tarjetas
│   └── storage.ts           # Lógica de almacenamiento
├── package.json
└── tsconfig.json
```

## 💾 Almacenamiento de Datos

Todos los datos se guardan localmente usando **AsyncStorage**, esto significa:
- ✅ Los datos persisten entre sesiones
- ✅ No se requiere conexión a internet
- ✅ Privacidad total - los datos permanecen en tu dispositivo
- ✅ Almacenamiento ilimitado (según el dispositivo)

## 🎨 Interfaz de Usuario

- **Colores Modernos**: Paleta de colores profesional (Índigo, Rojo, Verde, Amarillo)
- **Emojis Intuitivos**: Iconos visuales para mejor comprensión
- **Diseño Responsive**: Se adapta a diferentes tamaños de pantalla
- **Navegación Inferior**: 5 pestañas principales para fácil acceso

## 🚀 Funcionalidades Avanzadas

### Análisis Inteligente
- Cálculo automático de balance
- Porcentaje de gastos vs ingresos
- Recomendaciones contextuales

### Gestión Flexible
- Editar cualquier registro
- Historial completo
- Búsqueda y filtrado

### Datos Visuales
- Barras de progreso
- Estadísticas por categoría
- Resumen mensual

## 📝 Guía de Uso

### Primer Uso
1. Accede a **Ingresos** y registra tu primer ingreso
2. Ve a **Gastos** y comienza a registrar tus gastos diarios
3. Crea **Recordatorios** para pagos importantes
4. Establece **Planes de Ahorro** con tus metas

### Consejos
- Registra los gastos el mismo día que ocurren
- Revisa el Dashboard regularmente
- Mantén actualizados los planes de ahorro
- Activa los recordatorios según sea necesario

## 🔒 Seguridad

- Los datos se almacenan solo en tu dispositivo
- No se envía información a servidores externos
- Control total sobre tus finanzas

## 🐛 Troubleshooting

**La app no inicia:**
- Asegúrate de tener Node.js instalado
- Borra `node_modules` y ejecuta `npm install` nuevamente

**Los datos no se guardan:**
- Verifica que AsyncStorage esté correctamente instalado
- Intenta reiniciar la app

**Error de compilación:**
- Limpia el caché: `npm start --reset-cache`
- Asegúrate de usar TypeScript 5.9.2+

## 📄 Licencia

Este proyecto es de uso personal.

## 🤝 Contribuciones

Siéntete libre de mejorar la aplicación según tus necesidades.
##Download Android :

https://expo.dev/artifacts/eas/8qmWBktAnjpoQrobN6LX6F.apk
---

**Hecho con ❤️ para tu tranquilidad financiera**
